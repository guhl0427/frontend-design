import type { StyleItem } from '../types';

/** 生成用于文件名的日期片段：20260930 */
function dateStamp(): string {
  const now = new Date();
  const pad = (n: number): string => String(n).padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
}

/** 单条风格的 Markdown 导出（元信息 + 提示词正文） */
export function buildSingleMarkdown(item: StyleItem): string {
  return [
    `# ${item.nameZh} · ${item.nameEn}`,
    '',
    `- 分类：${item.category}`,
    `- 标签：${item.tags.join(' / ')}`,
    `- 摘要：${item.summary}`,
    `- 来源：前端风格提示词画廊`,
    '',
    '---',
    '',
    item.prompt.trim(),
    '',
  ].join('\n');
}

/** 多条风格的 Markdown 合集（含目录） */
export function buildBundleMarkdown(items: StyleItem[]): string {
  const toc = items.map((item, index) => `${index + 1}. [${item.nameZh} · ${item.nameEn}](#${index + 1}-${item.id})`);
  const bodies = items.map((item, index) => {
    const body = item.prompt
      .trim()
      .split('\n')
      .map((line) => (line.startsWith('#') ? `#${line}` : line))
      .join('\n');
    return [`## ${index + 1}. ${item.nameZh} · ${item.nameEn}`, '', `> ${item.summary}`, '', body].join('\n');
  });

  return [
    '# 前端风格提示词合集',
    '',
    `- 导出时间：${new Date().toLocaleString('zh-CN')}`,
    `- 风格数量：${items.length}`,
    '',
    '## 目录',
    '',
    ...toc,
    '',
    '---',
    '',
    bodies.join('\n\n---\n\n'),
    '',
  ].join('\n');
}

/** 触发浏览器下载纯文本文件 */
export function downloadText(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function singleFilename(item: StyleItem): string {
  return `style-${item.id}-${dateStamp()}.md`;
}

export function bundleFilename(): string {
  return `style-prompts-collection-${dateStamp()}.md`;
}
