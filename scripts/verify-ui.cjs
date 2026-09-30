/**
 * 浏览器级验证（playwright-core + 本地 chromium，无需 playwright-cli）
 * 覆盖：S1 焦点管理 / W2 色板底衬 / W3 预览 aria-hidden / W7 favicon+OG
 *       F1 深链分享 / F2 Markdown 导出 / F4 定制抽屉
 *       回归：稀疏分类吸顶、li 语义与标题层级、控制台错误
 *
 * 运行：NODE_PATH=<托管 workspace>/node_modules node scripts/verify-ui.cjs [baseUrl]
 */
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

/** 解析 playwright-core：优先常规解析，其次托管工作区（无需手动设置 NODE_PATH） */
function loadPlaywrightCore() {
  const candidates = [
    'playwright-core',
    path.join(os.homedir(), '.workbuddy', 'binaries', 'node', 'workspace', 'node_modules', 'playwright-core'),
  ];
  for (const candidate of candidates) {
    try {
      return require(candidate);
    } catch {
      /* 尝试下一个候选路径 */
    }
  }
  throw new Error('未找到 playwright-core，请安装到托管工作区后重试');
}

const { chromium } = loadPlaywrightCore();

const BASE = process.argv[2] || 'http://127.0.0.1:4173';
const CHROME_CANDIDATES = [
  path.join(process.env.LOCALAPPDATA || '', 'ms-playwright', 'chromium-1045', 'chrome-win', 'chrome.exe'),
  path.join(process.env.LOCALAPPDATA || '', 'ms-playwright', 'chromium-978106', 'chrome-win', 'chrome.exe'),
];

const results = [];
const pass = (name, detail) => results.push({ ok: true, name, detail });
const fail = (name, detail) => results.push({ ok: false, name, detail });
const check = (name, condition, detail) => (condition ? pass(name, detail) : fail(name, detail));

async function main() {
  const chromePath = CHROME_CANDIDATES.find((p) => p && fs.existsSync(p));
  if (!chromePath) throw new Error('未找到本地 chromium，请检查 ms-playwright 缓存');
  const browser = await chromium.launch({ executablePath: chromePath, args: ['--no-sandbox'] });
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

  /* --------------------------- F1a 深链直达 + 分类 --------------------------- */
  await page.goto(`${BASE}/?cat=%E8%89%BA%E6%9C%AF&style=bauhaus`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const deep = await page.evaluate(() => {
    const dlg = document.querySelector('[role=dialog]');
    const active = Array.from(document.querySelectorAll('.sticky button'))
      .filter((b) => b.className.includes('bg-brand'))
      .map((b) => b.textContent.trim());
    return { dialog: !!dlg, label: dlg && dlg.getAttribute('aria-label'), active };
  });
  check(
    'F1a 深链恢复分类并自动打开详情',
    deep.dialog && deep.active.includes('艺术') && (deep.label || '').includes('包豪斯'),
    JSON.stringify(deep),
  );

  /* ------------------------------- S1 焦点陷阱 ------------------------------- */
  const initialFocusInside = await page.evaluate(
    () => !!document.querySelector('[role=dialog]')?.contains(document.activeElement),
  );
  let escaped = false;
  for (let i = 0; i < 25; i += 1) {
    await page.keyboard.press('Tab');
    const inside = await page.evaluate(
      () => !!document.querySelector('[role=dialog]')?.contains(document.activeElement),
    );
    if (!inside) {
      escaped = true;
      break;
    }
  }
  check('S1a 初始聚焦在弹窗内且 Tab 不逃逸', initialFocusInside && !escaped, `初始在内=${initialFocusInside} 逃逸=${escaped}`);

  /* ---------------------------- W2 色板棋盘格底衬 ---------------------------- */
  const swatchBacked = await page.evaluate(() => {
    const el = document.querySelector('[role=dialog] [style*=conic]');
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
  await page.getByRole('button', { name: '下载', exact: true }).click();
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

  /* -------------------- S1b Esc 关闭（深链路径无触发元素） -------------------- */
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  const afterEsc = await page.evaluate(() => ({ dialog: !!document.querySelector('[role=dialog]') }));
  check('S1b Esc 关闭弹窗（深链路径）', !afterEsc.dialog, JSON.stringify(afterEsc));

  /* --------------- S1c 点击打开 → Esc → 焦点归还触发按钮（真实验证） --------------- */
  const trigger = page.locator('article').first().locator('button', { hasText: '查看提示词' });
  await trigger.click();
  await page.waitForTimeout(450);
  const openedByClick = await page.evaluate(
    () => !!document.querySelector('[role=dialog]')?.contains(document.activeElement),
  );
  await page.keyboard.press('Escape');
  await page.waitForTimeout(450);
  const restored = await page.evaluate(() => ({
    dialog: !!document.querySelector('[role=dialog]'),
    focusText: (document.activeElement && document.activeElement.textContent) || '',
  }));
  check(
    'S1c 点击打开时焦点入弹窗、Esc 后归还触发按钮',
    openedByClick && !restored.dialog && restored.focusText.includes('查看提示词'),
    `打开时入内=${openedByClick} 归还后焦点文本="${restored.focusText.trim()}"`,
  );

  /* ---------------------------- W3 预览 aria-hidden ---------------------------- */
  const aria = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('article'));
    return { cards: cards.length, hidden: cards.filter((c) => c.querySelector('button > div[aria-hidden=true]')).length };
  });
  check('W3 所有卡片预览对读屏隐藏', aria.cards === aria.hidden && aria.cards === 3, JSON.stringify(aria));

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
    'F2b 合集导出（25 篇 + 目录 + 文件名）',
    bundle.sections === 25 && bundle.hasToc && /^style-prompts-collection-\d{8}\.md$/.test(bundle.name),
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
    'REG1 稀疏分类下 sticky 恒钉顶 + URL 同步',
    sticky.top === 0 && sticky.scrollY > 0 && sticky.cards === 1 && sticky.url.includes('cat='),
    JSON.stringify(sticky),
  );

  await page.locator('article button[aria-label*=详情]').first().click();
  await page.waitForTimeout(500);
  const list = await page.evaluate(() => {
    const d = document.querySelector('[role=dialog]');
    return {
      uls: d.querySelectorAll('ul').length,
      nakedLi: Array.from(d.querySelectorAll('li')).filter((li) => !li.closest('ul,ol')).length,
      h2: d.querySelectorAll('h2').length,
      h3: d.querySelectorAll('h3').length,
      h4: d.querySelectorAll('h4').length,
    };
  });
  check(
    'REG2 li 语义与标题层级（h2=1）',
    list.nakedLi === 0 && list.uls > 0 && list.h2 === 1 && list.h3 > 0 && list.h4 > 0,
    JSON.stringify(list),
  );
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  const realErrors = errors.filter((e) => !e.includes('favicon'));
  check('REG3 无控制台错误', realErrors.length === 0, JSON.stringify(realErrors));

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
