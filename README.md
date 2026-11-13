# 前端风格提示词画廊 · style-gallery

> 35 种前端视觉风格的结构化设计规格书。每种风格都给出可直接粘贴进 AI 编程工具（Claude Code、Cursor、v0 等）的七段式提示词，并配一版纯 CSS 实时预览，让「看起来是什么样」和「怎么写出来的」同时可见。

这是一个纯静态单页应用：无后端、无账号、无追踪，`npm run build` 之后的产物可以放在任何静态托管上。

<!-- TODO(部署后替换)：把下面一行换成真实地址，例如 https://<你的用户名>.github.io/style-gallery/ -->
**在线演示**：部署后填入 → 部署步骤见 [部署](#部署)

---

## 它解决什么问题

「做个玻璃拟态风格的页面」这类指令，交给 AI 之后得到的结果通常偏平庸——因为提示词里没有具体数值。本项目把每种风格拆成七段可执行规格，全部落在具体数值上：

| 段落 | 内容 |
|---|---|
| 1. 角色定位 | 让模型进入特定设计师身份 |
| 2. 设计理念 | 该风格为什么长这样，约束的取舍 |
| 3. 字体方案 | 字体名 + 字重 + 字号阶梯 + 行高 |
| 4. HSL 色板 | 每个颜色的精确 hsl 值及用途 |
| 5. 间距与圆角 | 具体 px / rem 值与圆角阶梯 |
| 6. 组件规则 | 按钮、卡片、输入框的处理方式 |
| 7. 反模式禁令 | 明确禁止的做法（如禁用 Inter、禁用紫渐变） |

色彩对比度由 `npm run verify:data` 强制校验，全部满足 WCAG 4.5:1——提示词里写下的配色不是审美偏好，是可以直接交付的。

## 风格名录

共 9 个分类 35 条。URL 中分类使用英文 slug，便于分享。

| 分类 | slug | 风格 |
|---|---|---|
| 现代 | `modern` | 新粗野主义 `neo-brutalism` · 玻璃拟态 `glassmorphism` · 便当盒布局 `bento-grid` · 暗黑高级 `dark-luxury` · 商务专业 `corporate-professional` · 表现性 Material `m3-expressive` |
| 极简 | `minimal` | 瑞士国际主义 `swiss-international` · 极简编辑风 `editorial-minimal` · 日式侘寂 `japanese-zen` |
| 复古 | `retro` | 蒸汽波 `vaporwave` · 装饰艺术 `artdeco` · 千禧风 `y2k` · 孟菲斯 `memphis` · 报纸印刷 `newsprint` · 像素复古 `pixel-art` · 水果航空 `frutiger-aero` · 学院暗调 `dark-academia` |
| 工业 | `industrial` | 终端风 `terminal-cli` · 工程蓝图 `blueprint` · 磁带未来主义 `cassette-futurism` |
| 柔和 | `soft` | 柔和新拟态 `neumorphism` · 童趣几何 `playful-geometric` · 黏土拟态 `claymorphism` |
| 未来 | `future` | 赛博朋克 `cyberpunk` · 极光渐变 `aurora-mesh` · 液态玻璃 `liquid-glass` · 太阳朋克 `solarpunk` |
| 艺术 | `art` | 包豪斯 `bauhaus` · 极繁主义 `maximalism` · 手绘素描 `hand-drawn` · 孔版印刷 `risograph` |
| 国风 | `chinese` | 新中式国风 `guochao` |
| 企业 | `corporate` | 数据仪表盘 `data-dashboard` · Fluent 2 企业级 `fluent-2` · 企业扁平插画 `corporate-memphis` |

## 功能

- **页面级详情**：点击封面进入独立详情页，含边界展示框与整页样张；Esc 或返回回到画廊，并还原滚动位置与焦点
- **纯 CSS 实时预览**：11 种卡片变体 + 10 种按钮变体，不使用截图，任何屏幕密度下都清晰
- **提示词定制**：三档强度滑块、品牌名占位符替换、七段段落开关，生成结果随改随看
- **收藏与最近浏览**：存 localStorage，不写 URL，分享链接不会被个人偏好污染
- **风格对比**：最多 3 条并排预览，7 段横向对照，差异一眼可见
- **导出**：单条 / 合集 Markdown，以及对齐 [awesome-design-md](https://github.com/) 规范的 `DESIGN.md`
- **深链分享**：`?cat=art&q=bauhaus&style=bauhaus` 可直达筛选结果或某个风格详情页

## 快速开始

需要 Node.js **≥ 20.19**（Vite 8 要求）。

```bash
npm ci
npm run dev          # http://localhost:5173
```

构建与本地预览：

```bash
npm run build
npm run preview -- --host 127.0.0.1
```

> `preview` 默认只监听 IPv6 地址，加 `--host 127.0.0.1` 才能用该地址访问。

## 脚本

| 命令 | 作用 |
|---|---|
| `npm run dev` | 开发服务器（HMR） |
| `npm run build` | `tsc -b` 类型检查 + Vite 生产构建 |
| `npm run preview` | 预览构建产物 |
| `npm run verify:data` | 校验 35 条数据完整性：字段齐全、提示词七段结构、色彩对比度 ≥ 4.5:1 |
| `npm run verify:ui` | 浏览器端 45 项断言：详情页结构、深链、导出、收藏、对比、控制台零报错 |
| `npm run verify` | `verify:data` + `build`，提交前跑这个 |

`verify:ui` 需要 `playwright-core`（已在 devDependencies 中）与一个 Chromium。若本机没有浏览器缓存：

```bash
npx playwright install chromium
npm run build && npm run preview -- --host 127.0.0.1
node scripts/verify-ui.cjs http://127.0.0.1:4173
```

脚本按以下顺序寻找浏览器：环境变量 `SG_CHROME_PATH` → Playwright 缓存 → 系统 Chrome/Edge。也可以用 `SG_CHROME_PATH=/path/to/chrome` 显式指定。

## 浏览器支持

构建依赖 Tailwind CSS 4 的 `color-mix()`，门槛比一般项目高：

| 浏览器 | 最低版本 |
|---|---|
| Chrome / Edge | 111 |
| Safari | 16.4 |
| Firefox | 128 |

低于这些版本时，所有带透明度修饰的颜色会**整体失效**（不是轻微偏差），请勿用于需要兼容旧浏览器的场景。

## 技术栈

Vite 8 · React 19 · TypeScript 6（`strict` 全开）· Tailwind CSS 4（CSS-first 配置，无 `tailwind.config.js`）

运行时依赖只有 `react` 与 `react-dom`。刻意不引入状态管理库、路由库、组件库，也不做 SSR——35 条静态数据不需要这些，少一层抽象就少一处需要维护的耦合。

## 目录结构

```
src/
  App.tsx                  画廊 / 详情页二选一的路由与筛选状态
  components/
    StyleDetailPage.tsx    详情页骨架
    StyleShowcase.tsx      详情页整页样张（6 段结构）
    stylePrimitives.ts     按钮 / 面板变体原语，Preview 与 Showcase 的唯一来源
    Preview.tsx            纯 CSS 预览（11 卡片 + 10 按钮变体）
    Customizer.tsx         提示词定制抽屉
    CompareTray.tsx        对比托盘（上限 3）
    CompareDialog.tsx      对比弹窗（7 段横向对照）
    StyleCard.tsx          画廊卡片
  data/
    styles.ts              35 条风格数据（提示词正文唯一来源）
    fonts.ts               字体栈定义
  hooks/                   useLibrary（收藏/最近）、useCopy、useFocusTrap
  utils/                   viewState（URL 编解码）、export、promptComposer、promptSections
docs/
  code-wiki/               面向维护者的 8 篇代码文档
  internal/                过程留档（2026-09 的代码审查与调研），非对外文档
  Git提交规范.md            提交信息格式与钩子说明
scripts/
  verify-styles.mjs        数据校验
  verify-ui.cjs            浏览器断言
```

## 维护文档

`docs/code-wiki/` 是为「不逐行读源码也能安全改动」写的，建议先看：

| 文档 | 用途 |
|---|---|
| [架构总览](docs/code-wiki/01-架构总览.md) | 数据流与渲染路径 |
| [数据模型与内容规范](docs/code-wiki/02-数据模型与内容规范.md) | 字段定义、七段提示词的写法要求 |
| [模块职责](docs/code-wiki/03-模块职责.md) | 每个文件的边界 |
| [关键函数参考](docs/code-wiki/04-关键函数参考.md) | 签名与副作用 |
| [依赖关系](docs/code-wiki/05-依赖关系.md) | 模块耦合矩阵与隐性耦合常量 |
| [运行构建与质量保障](docs/code-wiki/06-运行构建与质量保障.md) | 验证链与排查路径 |
| [扩展指南与已知限制](docs/code-wiki/07-扩展指南与已知限制.md) | 加风格、加变体的完整步骤 |

`docs/internal/` 存放过程性留档（2026-09 的代码审查与规划、立项前的开源项目调研）。它们保留是为了追溯设计决策，**不代表当前状态**，其中引用的文件名与行号已部分失效。当前状态的唯一真相是 `docs/code-wiki/` 与源码。

## 部署

`vite.config.ts` 中设了 `base: './'`，构建产物全部使用相对路径引用资源，因此可以放在任意子路径下，不需要服务端配置，也不需要改写任何 URL。

### GitHub Pages

仓库自带 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)：推送到 `main` 后自动执行 `npm ci` → `verify:data` → `build`，再把 `dist/` 发布到 Pages。

启用步骤：

1. 仓库 **Settings → Pages** → **Source** 选择 **GitHub Actions**
2. 推送 `main`，等待 Actions 中的 `Deploy to GitHub Pages` 完成
3. 站点地址形如 `https://<用户名>.github.io/style-gallery/`，把它填回本文件顶部的「在线演示」

深链使用查询参数（`?cat=art&style=bauhaus`）而非路径路由，静态托管不需要 404 重写规则，直接访问链接不会 404。

### 其它静态托管

Vercel、Netlify、对象存储、Nginx 都只需要上传 `dist/` 目录。构建命令 `npm run build`，输出目录 `dist`。

## 新增一种风格

1. 先查同类目现有条目的 `palette` 与 `headingFont`——配色或字体撞车就等于重复条目，不要只看 `id`
2. 在 `src/data/styles.ts` 追加条目，七段提示词必须含具体 hsl 值、字体名与字重、px 值
3. `npm run verify:data` 会校验字段完整性与对比度，必须全绿
4. 同步 `scripts/verify-ui.cjs` 顶部的 `TOTAL_STYLES`（当前 35），否则合集导出断言会失败
5. 同步 `docs/code-wiki/` 的字段表、props 表与隐性耦合常量表

## 参与贡献

提交信息遵循 [Conventional Commits 收窄版](docs/Git提交规范.md)：`<type>(<scope>): <描述>`，类型白名单为 `feat fix style a11y perf refactor docs chore build ci test revert`。

仓库自带 `commit-msg` 校验钩子。`npm install` 时会通过 `prepare` 自动设置 `core.hooksPath`；如未生效，手动执行一次：

```bash
git config core.hooksPath .githooks
```

提交前请确保 `npm run verify` 通过。改动 `src/` 或 `src/data/styles.ts` 时不要跳过。

## 已知限制

- 隐私模式下 localStorage 写入会静默失败，收藏不生效且没有提示
- 字体通过 Google Fonts CDN 加载 27 个家族。**中国大陆网络下不可达**，页面会退化为系统默认字体，字体方案的展示效果会明显打折
- 预览 `<button>` 内嵌块级元素，是浏览器容错下的可用结构，不符合 HTML 内容模型
- 缺少 1200×630 的 `og:image`，社交平台分享无封面图
- 国风分类仅 1 条、极简 3 条，是刻意避开重复条目的结果

## 许可证

[MIT](LICENSE)
