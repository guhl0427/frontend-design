/**
 * 提示词正文结构解析（F5 对比模式 / F9 DESIGN.md 导出共用）。
 *
 * 全部风格提示词结构完全一致：首行为一级标题 `# 角色定位`，
 * 随后依次是 6 个二级标题段（设计理念 / 字体方案 / HSL 色板 / 间距与圆角 / 组件规则 / 反模式禁令），
 * 合计 7 段。切分同时支持 `#` 与 `##` 两种标题层级，并严格保留段落先后顺序。
 */

export interface PromptSection {
  /** 段落标题（已去掉 # 前缀与首尾空白） */
  title: string;
  /** 段落正文（已去掉首尾空行，段内换行原样保留） */
  body: string;
}

/** 标题行：以 `# ` 或 `## ` 开头（本项目数据只用到这两个层级） */
const HEADING_PATTERN = /^(#{1,2})\s+(.+)$/;

/**
 * 按标题行把提示词切分为有序段落。
 * 标题行之前的散落文本会被忽略（当前数据中不存在该情况）。
 */
export function splitPrompt(prompt: string): PromptSection[] {
  const sections: PromptSection[] = [];
  let title: string | null = null;
  let buffer: string[] = [];

  /** 收尾当前段落并推入结果 */
  const flush = (): void => {
    if (title === null) return;
    sections.push({ title, body: buffer.join('\n').trim() });
    buffer = [];
  };

  for (const rawLine of prompt.split('\n')) {
    // 去掉行尾空白，避免 CRLF 或尾随空格干扰首尾裁剪
    const line = rawLine.replace(/\s+$/, '');
    const match = HEADING_PATTERN.exec(line);
    if (match) {
      flush();
      title = match[2].trim();
      continue;
    }
    if (title !== null) buffer.push(line);
  }
  flush();

  return sections;
}
