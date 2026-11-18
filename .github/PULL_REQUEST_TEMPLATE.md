## 这个 PR 做了什么

<!-- 一句话说明改动目的，对应提交信息里的 type 与 scope -->

## 改动类型

<!-- 与 docs/Git提交规范.md §3 的 12 个 type 一一对应，不缺项；一个 PR 可勾多项 -->

- [ ] `feat` — 新功能、新增风格（`feat(styles)`）
- [ ] `fix` — 修复缺陷
- [ ] `style` — 仅格式与视觉，不改逻辑
- [ ] `a11y` — 无障碍：焦点、键盘、对比度、语义标签、读屏
- [ ] `perf` — 性能优化
- [ ] `refactor` — 重构，外部行为不变
- [ ] `docs` — 文档、注释、Code Wiki
- [ ] `test` — 校验脚本与断言
- [ ] `chore` — 仓库配置、忽略规则、辅助工具
- [ ] `build` — 构建系统与依赖
- [ ] `ci` — 持续集成配置
- [ ] `revert` — 回滚此前的提交

## 自检

- [ ] `npm run verify` 通过（`verify:data` + `tsc -b` + `vite build`）
- [ ] 改动 `src/` 时跑过 `npm run verify:ui`（或说明了为何无法运行）
- [ ] 若新增风格：`scripts/verify-ui.cjs` 的 `TOTAL_STYLES` 已同步为最新总数
- [ ] 若新增风格：已确认与同类目既有条目在 `palette` 与 `headingFont` 上不重复
- [ ] 若改动数据结构、组件 props、页面结构或可见文案：`docs/code-wiki/` 对应篇章已同步
- [ ] 若删改可见文案或 DOM 结构：`verify-ui.cjs` 的断言已改用 `aria-label` / `data-*` 定位，未绑文案与 class

## 截图 / 验证证据

<!-- 视觉类改动请附前后对比，图片直接拖进评论框即可，不必提交进仓库；纯逻辑改动写验证命令与输出摘要 -->
