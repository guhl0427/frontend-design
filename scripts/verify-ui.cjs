/**
 * 浏览器级验证（playwright-core + 本地 chromium，无需 playwright-cli）
 * 覆盖：S1 详情页结构与返回 / W2 色板底衬 / W3 预览 aria-hidden / W7 favicon+OG
 *       F1 深链分享 / F2 Markdown 导出 / F4 定制抽屉
 *       F3 收藏与最近（localStorage + URL 纯净性）/ F5 多风格对比 / F9 DESIGN.md 导出
 *       D 卡片封面 ↔ 详情页 ↔ 展示区一一对应、各详情页结构统一
 *       回归：稀疏分类吸顶、li 语义与标题层级、控制台错误
 *
 * 运行：node scripts/verify-ui.cjs [baseUrl]
 * 依赖：playwright-core（devDependencies 已声明）
 * 浏览器解析顺序：SG_CHROME_PATH / CHROME_PATH → Playwright 自带解析 → Playwright 缓存扫描 → 系统 Chrome / Edge
 */
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

/** 解析 playwright-core：常规解析优先，兼容以全局方式安装了 playwright 的环境 */
function loadPlaywrightCore() {
  const candidates = [
    'playwright-core',
    'playwright',
    path.join(os.homedir(), '.workbuddy', 'binaries', 'node', 'workspace', 'node_modules', 'playwright-core'),
  ];
  for (const candidate of candidates) {
    try {
      return require(candidate);
    } catch {
      /* 尝试下一个候选路径 */
    }
  }
  throw new Error(
    '未找到 playwright-core。请先在仓库根目录执行 npm install（该包已声明为 devDependency），' +
      '或临时安装：npm i -D playwright-core',
  );
}

const { chromium } = loadPlaywrightCore();

const BASE = process.argv[2] || 'http://127.0.0.1:4173';
/** 风格总数：合集导出的篇数断言以此为准，新增风格时必须同步 */
const TOTAL_STYLES = 35;

/** 系统已安装的 Chrome / Edge，便于无 Playwright 缓存的环境（含 CI 镜像） */
function systemBrowsers() {
  const programFiles = process.env.ProgramFiles || 'C:\\Program Files';
  const programFilesX86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';
  const localAppData = process.env.LOCALAPPDATA || '';
  return [
    path.join(programFiles, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    path.join(programFilesX86, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    path.join(localAppData, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    path.join(programFiles, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    path.join(programFilesX86, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ];
}

/**
 * 逐个尝试启动，直到成功。
 * 顺序：显式环境变量 → Playwright 自带 Chromium → 系统 Chrome / Edge → channel → 默认解析。
 * 不扫描缓存里的历史 revision：旧内核缺少新 API（如 checkVisibility），报错信息与真实原因无关，排查成本高。
 */
async function launchBrowser() {
  const candidates = [];
  const explicit = process.env.SG_CHROME_PATH || process.env.CHROME_PATH;
  if (explicit) {
    candidates.push({ label: `环境变量指定：${explicit}`, options: { executablePath: explicit } });
  }

  try {
    const bundled = chromium.executablePath();
    if (bundled && fs.existsSync(bundled)) {
      candidates.push({ label: 'Playwright 自带 Chromium', options: { executablePath: bundled } });
    }
  } catch {
    /* 未安装 Playwright 浏览器时 executablePath 会抛错，继续降级 */
  }

  for (const systemBrowser of systemBrowsers()) {
    if (fs.existsSync(systemBrowser)) {
      candidates.push({ label: systemBrowser, options: { executablePath: systemBrowser } });
    }
  }

  candidates.push({ label: 'channel=chrome', options: { channel: 'chrome' } });
  candidates.push({ label: 'channel=msedge', options: { channel: 'msedge' } });
  candidates.push({ label: 'Playwright 默认 Chromium', options: {} });

  const failures = [];
  for (const candidate of candidates) {
    try {
      const browser = await chromium.launch({ args: ['--no-sandbox'], ...candidate.options });
      if (candidate.options.executablePath || candidate.options.channel) {
        console.log(`使用浏览器：${candidate.label}`);
      }
      return browser;
    } catch (error) {
      failures.push(`${candidate.label} → ${String(error.message).split('\n')[0]}`);
    }
  }

  throw new Error(
    '未找到可用浏览器。任选其一后重试：\n' +
      '  1) npx playwright install chromium\n' +
      '  2) 安装本机 Chrome / Edge\n' +
      '  3) SG_CHROME_PATH=/path/to/chrome node scripts/verify-ui.cjs\n' +
      `已尝试：\n  ${failures.join('\n  ')}`,
  );
}

const results = [];
const pass = (name, detail) => results.push({ ok: true, name, detail });
const fail = (name, detail) => results.push({ ok: false, name, detail });
const check = (name, condition, detail) => (condition ? pass(name, detail) : fail(name, detail));

async function main() {
  const browser = await launchBrowser();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  /* ---------------------------- W7 favicon / meta ---------------------------- */
  const favicon = await page.request.get(`${BASE}/favicon.svg`);
  check('W7a favicon.svg 可访问', favicon.status() === 200, `HTTP ${favicon.status()}`);
  const html = await (await page.request.get(`${BASE}/`)).text();
  check(
    'W7b OG 元信息已注入',
    html.includes('og:title') && html.includes('og:description') && html.includes('theme-color'),
    'og:title / og:description / theme-color',
  );

  /* ------------------------ F1a 深链直达详情页 ------------------------ */
  await page.goto(`${BASE}/?cat=art&style=bauhaus`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const deep = await page.evaluate(() => {
    const root = document.querySelector('[data-style-detail]');
    const showcase = document.querySelector('[data-showcase]');
    return {
      styleId: root && root.getAttribute('data-style-id'),
      h1: document.querySelector('h1') ? document.querySelector('h1').textContent.trim() : null,
      showcaseInFrame: !!document.querySelector('[data-showcase-frame] [data-showcase]'),
      /* 展示区骨架固定 6 段：导航 / 主视觉 / 数据条 / 特性卡片 / 行动号召 / 页脚 */
      showcaseBlocks: showcase ? showcase.children.length : 0,
      dialogs: document.querySelectorAll('[role=dialog]').length,
    };
  });
  check(
    'F1a 深链恢复分类并直达该风格详情页',
    deep.styleId === 'bauhaus' &&
      (deep.h1 || '').includes('包豪斯') &&
      deep.showcaseInFrame &&
      deep.showcaseBlocks === 6 &&
      deep.dialogs === 0,
    JSON.stringify(deep),
  );

  /* ---------------------- S1 详情页结构（页面而非弹窗） ---------------------- */
  const structure = await page.evaluate(() => {
    const root = document.querySelector('[data-style-detail]');
    const h1s = document.querySelectorAll('h1');
    return {
      root: !!root,
      h1Count: h1s.length,
      /* 展示框必须有边界：外框 1px 线 + 内框 1px 线，两层都在 DOM 里 */
      frameBorder: root ? getComputedStyle(root.querySelector('[data-showcase-frame]')).borderTopWidth : null,
      explainer: !!root && root.textContent.includes('共用同一份预览配置'),
    };
  });
  check(
    'S1a 详情页结构：唯一 h1 + 带边界展示框 + 对应关系说明',
    structure.root && structure.h1Count === 1 && structure.frameBorder === '1px' && structure.explainer,
    JSON.stringify(structure),
  );

  /* ---------------------------- W2 色板棋盘格底衬 ---------------------------- */
  const swatchBacked = await page.evaluate(() => {
    const el = document.querySelector('[data-style-detail] [data-swatch] [style*=conic]');
    return !!el && getComputedStyle(el).backgroundImage.includes('conic');
  });
  check('W2 半透明色块有棋盘格底衬', swatchBacked, `conic 底衬=${swatchBacked}`);

  /* --------------------- F2a 单风格下载（拦截 blob/anchor） --------------------- */
  await page.evaluate(() => {
    window.__dl = [];
    const origCreate = URL.createObjectURL.bind(URL);
    URL.createObjectURL = (blob) => {
      window.__blob = blob;
      return origCreate(blob);
    };
    HTMLAnchorElement.prototype.click = function () {
      window.__dl.push(this.download);
    };
  });
  await page.getByRole('button', { name: /下载 \.md/ }).click();
  await page.waitForTimeout(300);
  const single = await page.evaluate(async () => {
    const text = window.__blob ? await window.__blob.text() : '';
    return { names: window.__dl, len: text.length, hasBans: text.includes('## 反模式禁令'), head: text.slice(0, 40) };
  });
  check(
    'F2a 单风格导出 .md（文件名 + 内容）',
    single.names.length === 1 && /^style-bauhaus-\d{8}\.md$/.test(single.names[0]) && single.hasBans,
    JSON.stringify(single),
  );

  /* ----------------------------- F1b 分享链接复制 ----------------------------- */
  await page.getByRole('button', { name: '分享', exact: true }).click();
  await page.waitForTimeout(300);
  const shareFeedback = await page.evaluate(() => document.body.textContent.includes('链接已复制'));
  check('F1b 分享按钮反馈', shareFeedback, `反馈=${shareFeedback}`);

  /* -------------------- S1b Esc 从详情页返回画廊（深链路径） -------------------- */
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  const afterEsc = await page.evaluate(() => ({
    detail: !!document.querySelector('[data-style-detail]'),
    style: new URLSearchParams(location.search).get('style'),
    cards: document.querySelectorAll('article').length,
  }));
  check(
    'S1b Esc 从详情页返回画廊（深链路径不离开站点）',
    !afterEsc.detail && afterEsc.style === null && afterEsc.cards > 0,
    JSON.stringify(afterEsc),
  );

  /* ---------- S1c 点击封面 → 对应详情页 → Esc → 焦点归还该封面 ---------- */
  const firstCover = page.locator('article button[data-cover-id]').first();
  const coverId = await firstCover.getAttribute('data-cover-id');
  await firstCover.click();
  await page.waitForTimeout(500);
  const openedByClick = await page.evaluate(() => ({
    id: document.querySelector('[data-style-detail]')?.getAttribute('data-style-id'),
    style: new URLSearchParams(location.search).get('style'),
  }));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  const restored = await page.evaluate(() => ({
    detail: !!document.querySelector('[data-style-detail]'),
    focusId: (document.activeElement && document.activeElement.getAttribute('data-cover-id')) || '',
  }));
  check(
    'S1c 封面点击进入对应详情页，Esc 返回并把焦点交还封面',
    openedByClick.id === coverId &&
      openedByClick.style === coverId &&
      !restored.detail &&
      restored.focusId === coverId,
    `封面=${coverId} 打开=${JSON.stringify(openedByClick)} 返回后=${JSON.stringify(restored)}`,
  );

  /* ------------- D1 封面 / 跳转目标 / 展示内容 三者一一对应（抽查 3 款） ------------- */
  const samples = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('article')).slice(0, 3);
    return cards.map((card) => ({
      id: card.querySelector('button[data-cover-id]').getAttribute('data-cover-id'),
      nameZh: card.querySelector('h3').textContent.trim(),
    }));
  });
  const pairs = [];
  for (const sample of samples) {
    await page.locator(`article button[data-cover-id="${sample.id}"]`).click();
    await page.waitForTimeout(400);
    pairs.push(
      await page.evaluate((expected) => {
        const root = document.querySelector('[data-style-detail]');
        const showcase = document.querySelector('[data-showcase]');
        return {
          expectedId: expected.id,
          expectedName: expected.nameZh,
          detailId: root && root.getAttribute('data-style-id'),
          h1: document.querySelector('h1').textContent.trim(),
          showcaseLabel: showcase ? showcase.getAttribute('aria-label') : '',
        };
      }, sample),
    );
    await page.keyboard.press('Escape');
    await page.waitForTimeout(420);
  }
  const allPaired = pairs.every(
    (p) => p.detailId === p.expectedId && p.h1 === p.expectedName && p.showcaseLabel.includes(p.expectedName),
  );
  check('D1 封面 / 详情页 / 展示区三者一一对应', samples.length === 3 && allPaired, JSON.stringify(pairs));

  /* --------------------- D2 各详情页结构统一（骨架签名一致） --------------------- */
  const readSignature = () =>
    page.evaluate(() => {
      const root = document.querySelector('[data-style-detail]');
      const sig = (selector) => root.querySelectorAll(selector).length;
      return {
        h1: sig('h1'),
        h2: sig('h2'),
        figure: sig('figure'),
        frame: sig('[data-showcase-frame]'),
        showcaseBlocks: document.querySelector('[data-showcase]').children.length,
        asideSections: sig('aside section'),
        swatches: sig('[data-swatch]'),
        specs: sig('dl > div'),
        neighborNav: sig('nav[aria-label="相邻风格"] button'),
        promptH3: sig('.prompt-body h3'),
        promptH4: sig('.prompt-body h4'),
      };
    });

  await page.locator('article button[data-cover-id]').nth(0).click();
  await page.waitForTimeout(450);
  const sigA = await readSignature();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(450);
  await page.locator('article button[data-cover-id]').nth(2).click();
  await page.waitForTimeout(450);
  const sigB = await readSignature();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(450);
  check(
    'D2 任意两款风格的详情页结构完全一致',
    sigA.h1 === 1 &&
      sigA.promptH3 === 1 &&
      sigA.promptH4 === 6 &&
      sigA.swatches === 6 &&
      JSON.stringify(sigA) === JSON.stringify(sigB),
    `A=${JSON.stringify(sigA)} B=${JSON.stringify(sigB)}`,
  );

  /* -------------------- F1d URL 参数只用英文 slug -------------------- */
  /* Esc 关闭详情后 URL 应只剩 ?cat=art：分类必须是 ASCII slug，不得回退成中文分类名 */
  const catParam = await page.evaluate(() => ({
    cat: new URLSearchParams(location.search).get('cat'),
    query: location.search,
  }));
  check(
    'F1d 分类参数为英文 slug（URL 无中文、无百分号编码）',
    catParam.cat === 'art' && !/%[0-9A-F]{2}/i.test(catParam.query),
    JSON.stringify(catParam),
  );


  /* ---------------------------- W3 预览 aria-hidden ---------------------------- */
  const aria = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('article'));
    return { cards: cards.length, hidden: cards.filter((c) => c.querySelector('button > div[aria-hidden=true]')).length };
  });
  /* 只断言「有卡片且全部隐藏」，不绑定具体数量：分类内风格数会随内容扩充变化 */
  check('W3 所有卡片预览对读屏隐藏', aria.cards > 0 && aria.cards === aria.hidden, JSON.stringify(aria));

  /* ------------------------- F2b 导出当前筛选结果为合集 ------------------------- */
  await page.locator('.sticky button', { hasText: '全部' }).first().click();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: /导出 \d+ 条/ }).click();
  await page.waitForTimeout(400);
  const bundle = await page.evaluate(async () => {
    const text = window.__blob ? await window.__blob.text() : '';
    return {
      name: window.__dl[window.__dl.length - 1],
      sections: (text.match(/^## \d+\./gm) || []).length,
      hasToc: text.includes('## 目录'),
    };
  });
  check(
    `F2b 合集导出（${TOTAL_STYLES} 篇 + 目录 + 文件名）`,
    bundle.sections === TOTAL_STYLES && bundle.hasToc && /^style-prompts-collection-\d{8}\.md$/.test(bundle.name),
    JSON.stringify(bundle),
  );

  /* ------------------------------- F4 定制抽屉 ------------------------------- */
  const setRange = (id, value) =>
    page.evaluate(
      ([sel, val]) => {
        const el = document.querySelector(sel);
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
        setter.call(el, String(val));
        el.dispatchEvent(new Event('input', { bubbles: true }));
      },
      [id, value],
    );

  await page.locator('article').first().locator('button', { hasText: '定制' }).click();
  await page.waitForTimeout(700);
  const drawer = await page.evaluate(() => {
    const d = document.querySelector('[role=dialog]');
    return {
      label: d && d.getAttribute('aria-label'),
      hasPreview: !!d?.querySelector('div[aria-hidden=true]'),
      sliders: d ? d.querySelectorAll('input[type=range]').length : 0,
      promptChars: d?.querySelector('pre')?.textContent?.length ?? 0,
    };
  });
  check(
    'F4a 抽屉打开（预览 + 三档滑块 + 生成结果）',
    !!drawer.hasPreview && drawer.sliders === 3 && drawer.promptChars > 300,
    JSON.stringify(drawer),
  );

  await setRange('#tuning-density', 9);
  await page.waitForTimeout(200);
  await setRange('#tuning-variance', 9);
  await page.waitForTimeout(250);
  const tuned = await page.evaluate(() => {
    const pv = document.querySelector('[role=dialog] div[aria-hidden=true]');
    const lastRow = pv.lastElementChild;
    const cards = Array.from(lastRow.children);
    const text = document.querySelector('[role=dialog] pre').textContent;
    return {
      padding: getComputedStyle(pv).padding,
      asym: cards.some((c) => getComputedStyle(c).transform !== 'none'),
      hasVariance: text.includes('布局实验度 9/10'),
      hasDensity: text.includes('信息密度 9/10'),
      hasCustomBlock: text.includes('## 定制参数'),
    };
  });
  check(
    'F4b 三档参数联动预览与提示词',
    tuned.padding === '12px' && tuned.asym && tuned.hasVariance && tuned.hasDensity && tuned.hasCustomBlock,
    JSON.stringify(tuned),
  );

  const brandName = `测试品牌${Date.now() % 1000}`;
  await page.locator('[role=dialog] input[type=text]').first().fill(brandName);
  await page.locator('[role=dialog] input[type=text]').nth(1).fill('#ff0000');
  await page.waitForTimeout(300);
  const brand = await page.evaluate((name) => {
    const pv = document.querySelector('[role=dialog] div[aria-hidden=true]');
    const text = document.querySelector('[role=dialog] pre').textContent;
    return {
      badgeBg: getComputedStyle(pv.querySelector('span')).backgroundColor,
      hasHex: text.includes('#ff0000'),
      hasName: text.includes(name),
    };
  }, brandName);
  check(
    'F4c 品牌占位符写入预览与提示词',
    brand.badgeBg === 'rgb(255, 0, 0)' && brand.hasHex && brand.hasName,
    JSON.stringify(brand),
  );

  // 段落开关顺序：0 色板 / 1 组件规则 / 2 反模式禁令
  await page.locator('[role=dialog] input[type=checkbox]').nth(2).click();
  await page.waitForTimeout(300);
  const sections = await page.evaluate(() => {
    const text = document.querySelector('[role=dialog] pre').textContent;
    return { hasBans: text.includes('## 反模式禁令'), hasPalette: text.includes('## HSL 色板') };
  });
  check('F4d 段落开关生效（关闭禁令，保留色板）', !sections.hasBans && sections.hasPalette, JSON.stringify(sections));

  await page.getByRole('button', { name: /复制定制提示词|已复制/ }).click();
  await page.waitForTimeout(400);
  const copyFeedback = await page.evaluate(() => document.body.textContent.includes('已复制'));
  check('F4e 复制定制提示词反馈', copyFeedback, `反馈=${copyFeedback}`);

  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  /* ----------------------- 回归：稀疏分类吸顶 + li 语义 ----------------------- */
  await page.locator('.sticky button', { hasText: '国风' }).first().click();
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(300);
  const sticky = await page.evaluate(() => ({
    top: Math.round(document.querySelector('.sticky').getBoundingClientRect().top),
    scrollY: Math.round(window.scrollY),
    cards: document.querySelectorAll('article').length,
    url: location.search,
  }));
  check(
    'REG1 稀疏分类下 sticky 恒钉顶 + URL 同步（英文 slug）',
    /* 「稀疏」以 ≤3 张为准，不锁死具体条数（分类内容会随风格扩充增长） */
    sticky.top === 0 &&
      sticky.scrollY > 0 &&
      sticky.cards > 0 &&
      sticky.cards <= 3 &&
      sticky.url.includes('cat=chinese'),
    JSON.stringify(sticky),
  );

  await page.locator('article button[data-cover-id]').first().click();
  await page.waitForTimeout(500);
  const list = await page.evaluate(() => {
    const root = document.querySelector('[data-style-detail]');
    return {
      uls: root.querySelectorAll('ul').length,
      nakedLi: Array.from(root.querySelectorAll('li')).filter((li) => !li.closest('ul,ol')).length,
      h1: root.querySelectorAll('h1').length,
      h2: root.querySelectorAll('h2').length,
      h3: root.querySelectorAll('h3').length,
      h4: root.querySelectorAll('h4').length,
    };
  });
  check(
    'REG2 详情页 li 语义与标题层级（h1 唯一，h2/h3/h4 逐级存在）',
    list.nakedLi === 0 && list.uls > 0 && list.h1 === 1 && list.h2 >= 2 && list.h3 > 0 && list.h4 > 0,
    JSON.stringify(list),
  );
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  /* ============================ 公共工具 ============================ */

  /** 读取 localStorage 原始字符串 */
  const readLS = (key) => page.evaluate((k) => window.localStorage.getItem(k), key);

  /** 清空本地库后回到干净首页（避免断言之间相互污染） */
  const resetApp = async () => {
    await page.evaluate(() => window.localStorage.clear());
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(450);
  };

  /** 拦截下载：记录 anchor.download 并保留最后一个 Blob（goto 之后必须重新安装） */
  const installDownloadSpy = () =>
    page.evaluate(() => {
      window.__dl = [];
      window.__blob = null;
      const origCreate = URL.createObjectURL.bind(URL);
      URL.createObjectURL = (blob) => {
        window.__blob = blob;
        return origCreate(blob);
      };
      HTMLAnchorElement.prototype.click = function () {
        window.__dl.push(this.download);
      };
    });

  /* ==================== F3 收藏 / 最近（本地库） ==================== */

  await resetApp();

  /* F3a 卡片星标切换收藏（aria-pressed 与字形联动） */
  const star = page.locator('article').first().locator('button[aria-label*="收藏"]');
  const starBefore = await star.evaluate((el) => ({
    pressed: el.getAttribute('aria-pressed'),
    text: el.textContent.trim(),
  }));
  await star.click();
  await page.waitForTimeout(350);
  const starAfter = await star.evaluate((el) => ({
    pressed: el.getAttribute('aria-pressed'),
    text: el.textContent.trim(),
  }));
  check(
    'F3a 卡片星标 aria-pressed 切换收藏',
    starBefore.pressed === 'false' && starBefore.text === '☆' && starAfter.pressed === 'true' && starAfter.text === '★',
    `前=${JSON.stringify(starBefore)} 后=${JSON.stringify(starAfter)}`,
  );

  /* F3b 收藏写入 localStorage（key: style-gallery:favorites） */
  const favRaw = await readLS('style-gallery:favorites');
  let favIds = [];
  try {
    favIds = JSON.parse(favRaw || '[]');
  } catch {
    favIds = null;
  }
  check(
    'F3b 收藏持久化到 style-gallery:favorites',
    Array.isArray(favIds) && favIds.length === 1 && typeof favIds[0] === 'string' && favIds[0].length > 0,
    `raw=${favRaw}`,
  );

  /* F3c ★ 收藏 / ◷ 最近 chip 固定在最前且带 aria-pressed */
  const chipHead = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.sticky button'))
      .slice(0, 2)
      .map((b) => b.textContent.trim()),
  );
  const favChipPressed = await page.getByRole('button', { name: '筛选已收藏的风格' }).getAttribute('aria-pressed');
  check(
    'F3c ★ 收藏 / ◷ 最近 chip 位于筛选栏最前',
    chipHead[0] === '★ 收藏' && chipHead[1] === '◷ 最近' && favChipPressed === 'false',
    `前两枚=${JSON.stringify(chipHead)} 收藏 chip pressed=${favChipPressed}`,
  );

  /* F3d 收藏筛选生效，且 URL 绝不含 cat=（本地筛选不得写入 URL） */
  const favName = (await page.locator('article').first().locator('h3').textContent()).trim();
  await page.getByRole('button', { name: '筛选已收藏的风格' }).click();
  await page.waitForTimeout(400);
  const favView = await page.evaluate(() => ({
    cards: document.querySelectorAll('article').length,
    search: location.search,
    names: Array.from(document.querySelectorAll('article h3')).map((h) => h.textContent.trim()),
  }));
  check(
    'F3d 收藏筛选仅显示已收藏且 URL 保持纯净',
    favView.cards === 1 && favView.names[0] === favName && favView.search === '',
    JSON.stringify(favView),
  );

  /* F3e 最近浏览：连续打开 10 款 → 严格 ≤ 8、无重复、最近在前 */
  await resetApp();
  const openedIds = [];
  for (let i = 0; i < 10; i += 1) {
    await page.locator('article').nth(i).locator('button[aria-label*="详情"]').click();
    await page.waitForTimeout(230);
    openedIds.push(await page.evaluate(() => new URLSearchParams(location.search).get('style')));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(230);
  }
  const recentIds = JSON.parse((await readLS('style-gallery:recent')) || '[]');
  const expectedRecent = openedIds.slice().reverse().slice(0, 8);
  check(
    'F3e 最近浏览上限 8、去重、最近在前',
    openedIds.length === 10 &&
      openedIds.every(Boolean) &&
      new Set(openedIds).size === 10 &&
      recentIds.length === 8 &&
      new Set(recentIds).size === 8 &&
      JSON.stringify(recentIds) === JSON.stringify(expectedRecent),
    `打开=${JSON.stringify(openedIds)} recent=${JSON.stringify(recentIds)}`,
  );

  /* F3f 最近筛选生效，且 URL 依然纯净 */
  await page.getByRole('button', { name: '筛选最近浏览的风格' }).click();
  await page.waitForTimeout(400);
  const recentView = await page.evaluate(() => ({
    cards: document.querySelectorAll('article').length,
    search: location.search,
  }));
  check(
    'F3f 最近筛选显示 8 条且 URL 不含 cat=',
    recentView.cards === 8 && recentView.search === '',
    JSON.stringify(recentView),
  );

  /* F3g / F3h 两个本地空态文案各自正确 */
  await resetApp();
  await page.getByRole('button', { name: '筛选已收藏的风格' }).click();
  await page.waitForTimeout(400);
  const favEmpty = await page.evaluate(() => document.body.textContent);
  await page.getByRole('button', { name: '筛选最近浏览的风格' }).click();
  await page.waitForTimeout(400);
  const recentEmpty = await page.evaluate(() => document.body.textContent);
  check(
    'F3g 收藏空态文案正确',
    favEmpty.includes('还没有收藏任何风格') && favEmpty.includes('☆ 收藏'),
    `含收藏空态=${favEmpty.includes('还没有收藏任何风格')}`,
  );
  check(
    'F3h 最近空态文案正确且不与收藏空态混淆',
    recentEmpty.includes('还没有浏览记录') && !recentEmpty.includes('还没有收藏任何风格'),
    `含最近空态=${recentEmpty.includes('还没有浏览记录')}`,
  );

  /* ========================= F5 多风格对比 ========================= */

  await resetApp();

  /* F5a 卡片「对比」按钮加入对比集并唤起对比条 */
  const firstCard = page.locator('article').first();
  const firstName = (await firstCard.locator('h3').textContent()).trim();
  const cmpBtn = firstCard.locator('button[aria-label*="对比集"]');
  const cmpBefore = await cmpBtn.evaluate((el) => ({
    pressed: el.getAttribute('aria-pressed'),
    text: el.textContent.trim(),
  }));
  await cmpBtn.click();
  await page.waitForTimeout(350);
  const cmpAfter = await cmpBtn.evaluate((el) => ({
    pressed: el.getAttribute('aria-pressed'),
    text: el.textContent.trim(),
  }));
  const trayText = await page.evaluate(() => {
    const tray = document.querySelector('.fixed.inset-x-0.bottom-0');
    return tray ? tray.textContent : null;
  });
  check(
    'F5a 卡片对比按钮加入对比集并出现对比条',
    cmpBefore.text === '对比' &&
      cmpAfter.text === '已加入对比' &&
      cmpAfter.pressed === 'true' &&
      trayText !== null &&
      trayText.includes(firstName),
    `前=${JSON.stringify(cmpBefore)} 后=${JSON.stringify(cmpAfter)} tray=${JSON.stringify(trayText)}`,
  );

  /* F5b 对比条单项移除后整条消失 */
  await page.locator('.fixed.inset-x-0.bottom-0 button[aria-label^="从对比集移除"]').first().click();
  await page.waitForTimeout(350);
  const trayAfterRemove = await page.evaluate(() => ({
    tray: !!document.querySelector('.fixed.inset-x-0.bottom-0'),
    cardText: document.querySelector('article button[aria-label*="对比集"]').textContent.trim(),
  }));
  check(
    'F5b 对比条单项移除后整条消失',
    trayAfterRemove.tray === false && trayAfterRemove.cardText === '对比',
    JSON.stringify(trayAfterRemove),
  );

  /* F5c 清空按钮清空整个对比集 */
  await page.locator('article').nth(0).locator('button[aria-label*="对比集"]').click();
  await page.locator('article').nth(1).locator('button[aria-label*="对比集"]').click();
  await page.waitForTimeout(400);
  const trayTwo = await page.evaluate(() => {
    const tray = document.querySelector('.fixed.inset-x-0.bottom-0');
    return tray ? tray.querySelectorAll('button[aria-label^="从对比集移除"]').length : 0;
  });
  await page.locator('.fixed.inset-x-0.bottom-0 button', { hasText: '清空' }).click();
  await page.waitForTimeout(400);
  const trayCleared = await page.evaluate(() => !!document.querySelector('.fixed.inset-x-0.bottom-0'));
  check(
    'F5c 清空按钮清空对比集',
    trayTwo === 2 && trayCleared === false,
    `清空前 chip=${trayTwo} 清空后 tray 存在=${trayCleared}`,
  );

  /* F5d 对比集上限 3：第 4 款被拒并给出可见 role=status 提示 */
  for (const i of [0, 1, 2]) {
    await page.locator('article').nth(i).locator('button[aria-label*="对比集"]').click();
    await page.waitForTimeout(200);
  }
  await page.locator('article').nth(3).locator('button[aria-label*="对比集"]').click();
  await page.waitForTimeout(350);
  const limit = await page.evaluate(() => {
    const tray = document.querySelector('.fixed.inset-x-0.bottom-0');
    const notice = document.querySelector('div[role=status]');
    return {
      chips: tray ? tray.querySelectorAll('button[aria-label^="从对比集移除"]').length : 0,
      notice: notice ? notice.textContent.trim() : null,
      visible: notice ? notice.getClientRects().length > 0 : false,
    };
  });
  check(
    'F5d 第 4 款被拒并给出可见 role=status 提示',
    limit.chips === 3 && limit.visible && (limit.notice || '').includes('最多同时对比 3 款风格'),
    JSON.stringify(limit),
  );

  /* F5e 提示自动消失且不残留 DOM 节点 */
  await page.waitForTimeout(2800);
  const noticeGone = await page.evaluate(() => document.querySelector('div[role=status]') === null);
  check('F5e 上限提示自动消失且不残留 DOM', noticeGone, `残留=${!noticeGone}`);

  /* F5f 详情页内也有对比按钮；详情页是页面，不与任何模态层叠加 */
  await page.locator('article').nth(0).locator('button[aria-label*="详情"]').click();
  await page.waitForTimeout(500);
  const detailStack = await page.evaluate(() => {
    const root = document.querySelector('[data-style-detail]');
    return {
      detail: !!root,
      dialogs: document.querySelectorAll('[role=dialog]').length,
      hasCompareBtn:
        !!root && Array.from(root.querySelectorAll('button')).some((b) => (b.getAttribute('aria-label') || '').includes('对比集')),
    };
  });
  check(
    'F5f 详情页含对比按钮且不叠加模态层',
    detailStack.detail && detailStack.dialogs === 0 && detailStack.hasCompareBtn,
    JSON.stringify(detailStack),
  );
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  /* F5g / F5h / F5i 对比视图：模态语义 + 并排 3 份 Preview + 7 段横向对照 */
  await page.locator('.fixed.inset-x-0.bottom-0 button', { hasText: '开始对比' }).click();
  await page.waitForTimeout(600);
  const compareView = await page.evaluate(() => {
    const dlgs = document.querySelectorAll('[role=dialog]');
    const d = dlgs[0];
    const text = d ? d.textContent : '';
    const titles = ['角色定位', '设计理念', '字体方案', 'HSL 色板', '间距与圆角', '组件规则', '反模式禁令'];
    return {
      count: dlgs.length,
      label: d && d.getAttribute('aria-label'),
      modal: d && d.getAttribute('aria-modal'),
      previews: d ? d.querySelectorAll('div[aria-hidden=true]').length : 0,
      /* 用语义锚点计数，不绑 Tailwind 类名——改视觉时断言不该跟着断 */
      rows: d ? d.querySelectorAll('[data-compare-row]').length : 0,
      present: titles.filter((t) => text.includes(t)),
    };
  });
  check(
    'F5g 对比视图 role=dialog + aria-modal 且同屏仅一个 dialog',
    compareView.count === 1 && compareView.label === '风格对比' && compareView.modal === 'true',
    JSON.stringify(compareView),
  );
  check('F5h 对比视图并排渲染 3 份 Preview', compareView.previews === 3, `Preview 数=${compareView.previews}`);
  check(
    'F5i 段落横向对照 7 段全部呈现',
    compareView.rows === 7 && compareView.present.length === 7,
    `行数=${compareView.rows} 命中标题=${JSON.stringify(compareView.present)}`,
  );

  /* F5j 对比弹窗焦点陷阱 + Esc 关闭 */
  const cmpInitFocus = await page.evaluate(
    () => !!document.querySelector('[role=dialog]')?.contains(document.activeElement),
  );
  let cmpEscaped = false;
  for (let i = 0; i < 25; i += 1) {
    await page.keyboard.press('Tab');
    const inside = await page.evaluate(
      () => !!document.querySelector('[role=dialog]')?.contains(document.activeElement),
    );
    if (!inside) {
      cmpEscaped = true;
      break;
    }
  }
  await page.keyboard.press('Escape');
  await page.waitForTimeout(450);
  const afterCmpEsc = await page.evaluate(() => ({
    dialogs: document.querySelectorAll('[role=dialog]').length,
    tray: !!document.querySelector('.fixed.inset-x-0.bottom-0'),
  }));
  check(
    'F5j 对比弹窗焦点陷阱生效 + Esc 关闭',
    cmpInitFocus && !cmpEscaped && afterCmpEsc.dialogs === 0,
    `初始在内=${cmpInitFocus} 逃逸=${cmpEscaped} 关闭后 dialog=${afterCmpEsc.dialogs}`,
  );
  check('F5k 关闭对比视图后对比集保留', afterCmpEsc.tray === true, JSON.stringify(afterCmpEsc));

  /* ======================= F9 DESIGN.md 导出 ======================= */

  await resetApp();
  await installDownloadSpy();

  /* F9a 详情页「导出 DESIGN.md」：文件名 + 六个章节 */
  await page.locator('article').nth(0).locator('button[aria-label*="详情"]').click();
  await page.waitForTimeout(500);
  const paletteFromDom = await page.evaluate(() => {
    const root = document.querySelector('[data-style-detail]');
    const map = {};
    /* 色板格子上的 data-swatch 是稳定锚点，值取格子内 title 属性 */
    root.querySelectorAll('[data-swatch]').forEach((el) => {
      const name = el.getAttribute('data-swatch');
      const valueEl = el.querySelector('[title]');
      if (name && valueEl) map[name] = valueEl.getAttribute('title');
    });
    return map;
  });
  await page.getByRole('button', { name: '导出 DESIGN.md', exact: true }).click();
  await page.waitForTimeout(400);
  const design = await page.evaluate(async () => {
    const text = window.__blob ? await window.__blob.text() : '';
    return { names: window.__dl, text };
  });
  const designHeads = [
    '## Overview',
    '## Color Palette',
    '## Typography',
    '## Shape & Depth',
    '## Components',
    "## Do's & Don'ts",
  ];
  check(
    'F9a 详情导出 DESIGN.md（文件名 + 六个章节）',
    design.names.length === 1 && design.names[0] === 'DESIGN.md' && designHeads.every((h) => design.text.includes(h)),
    `names=${JSON.stringify(design.names)} 命中章节=${designHeads.filter((h) => design.text.includes(h)).length}/6`,
  );

  /* F9b Color Palette 8 行 Token 表，且值与 preview.palette 一致 */
  const paletteRows = {};
  for (const line of design.text.split('\n')) {
    const m = /^\|\s*([a-z][a-z-]*)\s*\|\s*([^|]+?)\s*\|/.exec(line);
    if (m) paletteRows[m[1]] = m[2].trim();
  }
  const tokenOrder = ['background', 'surface', 'text', 'text-muted', 'accent', 'accent-text', 'border', 'shadow'];
  const paletteMatched =
    paletteRows.background === paletteFromDom['背景'] &&
    paletteRows.surface === paletteFromDom['表面'] &&
    paletteRows.accent === paletteFromDom['强调'] &&
    paletteRows.text === paletteFromDom['文字'] &&
    paletteRows['text-muted'] === paletteFromDom['次级文字'] &&
    paletteRows.border === paletteFromDom['边框'];
  check(
    'F9b Color Palette 8 行 Token 表且值与 preview.palette 一致',
    Object.keys(paletteRows).length === 8 && tokenOrder.every((t) => t in paletteRows) && paletteMatched,
    `rows=${JSON.stringify(paletteRows)} DOM色板=${JSON.stringify(paletteFromDom)}`,
  );

  /* F9c 工具栏「导出 DESIGN.md 合集」 */
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  await page.evaluate(() => {
    window.__dl = [];
    window.__blob = null;
  });
  await page.getByRole('button', { name: /导出 DESIGN\.md 合集/ }).click();
  await page.waitForTimeout(450);
  const designBundle = await page.evaluate(async () => {
    const text = window.__blob ? await window.__blob.text() : '';
    return {
      name: window.__dl[window.__dl.length - 1],
      sections: (text.match(/^## \d+\./gm) || []).length,
      hasPalette: text.includes('## Color Palette'),
      hasToc: text.includes('## 目录'),
    };
  });
  check(
    `F9c DESIGN.md 合集导出（${TOTAL_STYLES} 篇 + 目录 + 文件名）`,
    /^design-md-collection-\d{8}\.md$/.test(designBundle.name || '') &&
      designBundle.sections === TOTAL_STYLES &&
      designBundle.hasPalette &&
      designBundle.hasToc,
    JSON.stringify(designBundle),
  );

  /* ---------------- F1e 旧中文分类链接兼容（读得懂 + 回写规范化） ---------------- */
  await page.goto(`${BASE}/?cat=${encodeURIComponent('国风')}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const legacy = await page.evaluate(() => ({
    active: Array.from(document.querySelectorAll('.sticky button[aria-current="true"]')).map((b) =>
      b.textContent.trim(),
    ),
    cat: new URLSearchParams(location.search).get('cat'),
  }));
  check(
    'F1e 旧中文分类链接可读并规范化回写为 slug',
    legacy.active.includes('国风') && legacy.cat === 'chinese',
    JSON.stringify(legacy),
  );

  const realErrors = errors.filter((e) => !e.includes('favicon'));  check('REG3 无控制台错误', realErrors.length === 0, JSON.stringify(realErrors));

  await browser.close();

  /* --------------------------------- 汇总输出 --------------------------------- */
  const failed = results.filter((r) => !r.ok);
  console.log('=== UI 验证结果 ===');
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}\n        ${r.detail}`);
  console.log(`\n合计 ${results.length} 项，通过 ${results.length - failed.length}，失败 ${failed.length}`);
  process.exit(failed.length === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error('验证脚本异常：', error);
  process.exit(2);
});
