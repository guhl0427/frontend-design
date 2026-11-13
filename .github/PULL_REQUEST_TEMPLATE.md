## 这个 PR 做了什么

<!-- 一句话说明改动目的，对应提交信息里的 type 与 scope -->

## 改动类型

- [ ] 新增风格（`feat(styles)`）
- [ ] 修复缺陷（`fix`）
- [ ] 视觉 / 样式调整（`style`）
- [ ] 可访问性（`a11y`）
- [ ] 文档（`docs`）
- [ ] 工程配置（`chore` / `build` / `ci`）

## 自检

- [ ] `npm run verify` 通过
- [ ] 若新增风格：`scripts/verify-ui.cjs` 的 `TOTAL_STYLES` 已同步为最新总数
- [ ] 若新增风格：已确认与同类目既有条目在 `palette` 与 `headingFont` 上不重复
- [ ] 若改动数据结构或组件 props：`docs/code-wiki/` 对应篇章已同步
- [ ] 改动 `src/` 时未跳过 `verify:ui`（或说明了为何无法运行）

## 截图 / 验证证据

<!-- 视觉类改动请附前后对比；纯逻辑改动可写验证命令与输出摘要 -->
