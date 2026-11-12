# Git 提交规范

> **版本** v1.1 · 制定于 2026-09-10 · 修订于 2026-09-30
> **适用仓库** `style-gallery`（仓库根目录即 `style-gallery/`；本文件位于 `docs/`）
> **参考标准** [Conventional Commits 1.0.0](https://www.conventionalcommits.org/)，按本项目场景做了收窄与补充

---

## 0. 一句话规则

```
<type>(<scope>): <简要描述>
```

> 例：`feat(styles): 新增包豪斯与孟菲斯两套风格`

- **type（必填）**：这次提交是「哪一类」改动 → 见 §3
- **scope（建议填）**：改动落在「哪一块」→ 见 §4
- **描述（必填）**：具体做了什么，中文可用

---

## 1. 为什么要定这个规范

| 想解决的问题 | 规范带来的好处 |
|---|---|
| 翻历史时看不出每次改了啥 | 类型 + 范围一眼可读，`git log --oneline` 就是变更清单 |
| 想生成 CHANGELOG 无从下手 | 类型固定，可脚本化聚合「新增/修复/无障碍/性能」 |
| 排查「哪个提交引入了这个 Bug」慢 | 一个提交只做一件事，`git bisect` 命中率高 |
| 回滚时被迫牵连无关改动 | 原子提交，`git revert` 精确回滚单点 |
| 多人/AI 协作口径不一 | 有唯一格式，也有自动校验兜底 |

---

## 2. 完整格式

```
<type>(<scope>)!: <简要描述>
<空行>
正文：为什么改、怎么改、有什么副作用（每行 ≤ 100 字，可多段）
<空行>
脚注：BREAKING CHANGE: 破坏性变更说明
      Closes #12
      Refs #7
```

标题行的结构：

```
feat(styles): 新增像素复古风格
└┬─┘└──┬───┘ └──────┬──────┘
 │     │           └─ 做了什么事，祈使/陈述语气，≤72 字，结尾不加句号
 │     └─ 影响范围（可选但强烈建议）
 └─ 变更类型（必填）
```

**硬性要求**

1. 类型必须是 §3 表中的 12 个之一，**全小写**
2. `type` 与 `scope` 之间无空格，`scope` 用小括号包裹，**全小写**
3. **冒号后必须有且仅有一个空格**
4. 标题行 ≤ 72 字（建议 ≤ 50 字）
5. 标题行结尾**不加句号**（`.` 或 `。`）
6. 标题行与正文之间**必须空一行**

---

## 3. 变更类型（type）

| type | 含义 | 本项目示例 |
|---|---|---|
| `feat` | 新增功能、新增风格数据 | `feat(styles): 新增极光渐变风格` |
| `fix` | 修复缺陷 | `fix(preview): 修复极繁主义标题对比度仅 1.0:1` |
| `style` | **仅**代码格式/排版，不影响逻辑 | `style: 统一组件内 2 空格缩进` |
| `a11y` | 无障碍：焦点、键盘、对比度、语义标签、读屏 | `a11y(detail): 弹窗加焦点陷阱与 Esc 关闭` |
| `perf` | 性能优化 | `perf(preview): 移除内联 style 计算，改用 CSS 变量` |
| `refactor` | 重构，**不改变外部行为** | `refactor(preview): switch 分支抽为变体映射表` |
| `docs` | 文档、注释、报告 | `docs: 补充风格提示词六段结构说明` |
| `chore` | 杂项：仓库配置、忽略规则、辅助工具 | `chore: 初始化 git 仓库并添加提交规范` |
| `build` | 构建系统与依赖 | `build: 升级 vite 至 5.4.11` |
| `ci` | 持续集成配置 | `ci: 新增 GitHub Actions 校验工作流` |
| `test` | 测试与校验脚本 | `test(verify): 新增深链分享相关断言` |
| `revert` | 回滚此前的提交 | `revert: 回滚预览变体改动` |

> **`style` 与 `refactor` 的区别**：`style` 只动「长什么样」（空格、引号、换行），`refactor` 动「怎么组织」（拆函数、换数据结构）但行为不变。若改动同时改了行为 → 用 `feat` 或 `fix`。

---

## 4. 影响范围（scope）

scope 决定粒度，**建议填**。本项目约定以下取值：

| scope | 对应位置 |
|---|---|
| `styles` | `src/data/styles.ts` — 风格数据、分类、提示词正文 |
| `fonts` | `src/data/fonts.ts` — 字体清单 |
| `preview` | `src/components/Preview.tsx` — CSS 实时预览渲染 |
| `card` | `src/components/StyleCard.tsx` — 画廊卡片 |
| `detail` | `src/components/PromptDetail.tsx` — 提示词详情弹窗 |
| `customizer` | `src/components/Customizer.tsx` — 定制参数抽屉 |
| `prompt` | `src/utils/promptComposer.ts` — 提示词合成/去重/定制参数段 |
| `export` | `src/utils/export.ts` — Markdown 导出 |
| `share` | `src/utils/viewState.ts` — URL 深链与状态同步 |
| `filters` | `src/App.tsx` — 分类/搜索/计数/筛选栏 |
| `a11y` | 跨组件的无障碍统一调整 |
| `seo` | `index.html`、`public/` — 标题、OG、favicon |
| `theme` | `src/index.css`（`@theme` 令牌块）— 设计令牌与全局样式 |
| `build` | `vite.config.ts`、`tsconfig*.json` |
| `verify` | `scripts/verify-*.mjs|cjs` 与校验命令 |
| `deps` | `package.json` / `package-lock.json` |
| `docs` | Markdown 文档与报告 |

- 一处改动跨多个 scope 且都很重 → **拆成多个提交**，而不是叠加 scope
- 全仓库级的杂项（如本次 `.gitignore`）→ **省略 scope**，写 `chore: xxx`
- 确实需要多 scope 时用逗号：`fix(card,detail): ...`（**尽量别用，优先拆提交**）

---

## 5. 正文与脚注

**正文（body）**：能省则省；但凡「为什么这么改」不明显，就写。

```
fix(preview): 修复极繁主义预览标题不可见

原配色为深底深字，实测对比度 1.00:1，标题完全不可读。
将底色由 hsl(280 45% 12%) 调整为 hsl(48 70% 93%)，并同步更新
提示词正文中的色板段，保证预览与提示词一致。
```

**脚注（footer）**

| 写法 | 用途 |
|---|---|
| `BREAKING CHANGE: 说明` | 破坏性变更（也应在 `:` 前加 `!`，如 `feat(styles)!: ...`） |
| `Closes #12` | 关闭对应 Issue |
| `Refs #7` | 关联但不关闭 |

> 本项目当前为纯静态、无对外 API，`BREAKING CHANGE` 一般指：URL 参数语义变更、导出 Markdown 结构变更、风格数据字段重命名。

---

## 6. 示例对照

### ✅ 推荐

```
feat(styles): 新增包豪斯、孟菲斯、手绘素描三套风格

- 补全 CATEGORIES 中的「艺术」分类
- 每套风格含六段结构提示词与 hsl 色板
- 预览变体新增 sketch 分支

Refs #4
```

```
a11y(detail): 详情弹窗加焦点陷阱与 Esc 关闭
```

```
perf(preview): 色块棋盘格底衬改用 conic-gradient

去掉了 10 行内联 style 拼接，改为 CSS 背景，重绘开销更低。
```

```
chore: 初始化 git 仓库，添加 .gitignore 与提交规范
```

### ❌ 反例

| 反例 | 问题 | 改法 |
|---|---|---|
| `更新一下` | 无类型、无信息 | `docs: 更新开源项目调研结论` |
| `fix: 修复bug。` | 描述空泛 + 多句号 | `fix(card): 复制按钮在 Safari 下失效` |
| `feat: 加了新风格和修了预览bug还有改了文档` | 三件事混在一个提交 | 拆成 `feat(styles)` / `fix(preview)` / `docs` 三个提交 |
| `Feat(styles): 新增风格` | 类型首字母大写（钩子会拦截） | `feat(styles): 新增风格` |
| `feat (styles): 新增风格` | 类型与括号间有空格 | `feat(styles): 新增风格` |
| `feat(styles):新增风格` | 冒号后缺空格 | `feat(styles): 新增风格` |

---

## 7. 提交粒度与流程

### 7.1 什么时候提交

**一个提交 = 一个完整且自洽的变更**，满足：

- 能独立描述清楚（一句话标题能概括）
- 不夹带无关改动（顺手改的错别字 → 单独 `docs:` 或 `style:` 提交）
- 尽量可构建、可运行（实在做不到时在正文说明）

### 7.2 分支策略（轻量）

| 分支 | 用途 |
|---|---|
| `main` | 唯一长期分支，始终可用、可构建 |
| `feat/<简述>` | 新功能，如 `feat/pixel-style` |
| `fix/<简述>` | 修缺陷，如 `fix/sticky-tabs` |
| `chore/<简述>` | 配置类，如 `chore/git-setup` |

单人开发也可以直接提交到 `main`；一旦需要「先做 A 再做 B 且 B 未完成不许进 main」，就开分支。

### 7.3 推荐流程

```bash
npm run verify            # 1. 改完先自检（数据校验 + 构建）
git status                # 2. 确认改动范围，警惕夹带
git add <具体文件>         # 3. 精确 add，少用 git add .
git diff --cached         # 4. 复核将要提交的内容
git commit                # 5. 用 .gitmessage 模板填写，钩子自动校验
```

---

## 8. 工具链（已配置）

本仓库已内置三件套，**无需额外安装依赖**：

| 文件 | 作用 | 启用方式 |
|---|---|---|
| `.gitmessage` | 提交信息模板，含格式说明与正反例 | `git config commit.template .gitmessage` |
| `.gitattributes` | 统一换行符（LF）、二进制识别、lock 文件降噪 | 自动生效 |
| `.githooks/commit-msg` | 提交时自动校验标题行格式 | `git config core.hooksPath .githooks` |

**校验规则（提交时自动执行）**

- 拦截：标题行不符合 `<type>(<scope>): <描述>`，或类型不在白名单
- 提示（不拦截）：标题超 72 字、结尾带句号、标题与正文之间缺空行
- 放行：`Merge ...` / `Revert ...` / `fixup!` / `squash!` 开头的信息

**临时跳过校验**（仅在确有特殊情况时使用）

```bash
git commit --no-verify
```

**手动试跑钩子**

```bash
printf 'feat(styles): 新增像素复古风格\n' > /tmp/m && .githooks/commit-msg /tmp/m && echo OK
```

---

## 9. FAQ

**Q：一个提交里既有新功能又有它的测试，算不算混？**
A：不算。功能与其校验/测试属于同一件事，用 `feat(verify): ...` 或直接在正文里说明即可。

**Q：改了风格数据里的色值，算 `fix` 还是 `style`？**
A：看目的。对比度不达标 → `fix`，且 scope 用 `styles` 或 `preview`；纯视觉微调 → `style`。

**Q：一次加 10 套新风格，要拆 10 个提交吗？**
A：不必。同一批同质内容可合成一个 `feat(styles): 新增 N 套风格（列举）`；若其中有独立可复用的预览变体改动，再单独拆一个。

**Q：钩子报错但我确实想这么写？**
A：优先改信息；确属特殊场景用 `--no-verify`，但请在正文里说明原因，避免成为习惯。

---

## 附录：提交前自检清单

```
[ ] 标题行：<type>(<scope>): <描述>，类型在 12 个白名单内
[ ] 冒号后有空格，结尾无句号，≤72 字
[ ] 本提交只做「一件事」，无夹带无关改动
[ ] 未提交 node_modules / dist / .playwright-cli / 临时日志
[ ] 涉及源码或数据时，已跑过 `npm run verify`
[ ] 需要时已跑 `npm run verify:ui`（浏览器端 19 项断言）
[ ] 破坏性变更已在标题加 `!` 并在脚注写 `BREAKING CHANGE:`
[ ] 相关 Issue 已在脚注用 `Closes #n` / `Refs #n` 关联
```

---

_本规范由主理人制定，随项目演进迭代；如需调整类型表或 scope 表，改本文件并同步更新 `.githooks/commit-msg` 中的 `TYPES` 白名单。_
