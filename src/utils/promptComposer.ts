import type { CustomizeOptions, PreviewConfig, StyleItem } from '../types';

/** 定制器默认值：居中档位 + 空品牌占位，等于「原样使用该风格」 */
export const DEFAULT_CUSTOMIZE: CustomizeOptions = {
  tuning: { variance: 5, motion: 5, density: 5 },
  brand: { productName: '', accentColor: '', headingFont: '', bodyFont: '' },
  sections: { palette: true, components: true, bans: true },
};

/* ------------------------------------ 色彩工具 ------------------------------------ */

function hexToRgb(hex: string): [number, number, number] | null {
  const value = hex.trim().replace(/^#/, '');
  const full = value.length === 3 ? value.split('').map((c) => c + c).join('') : value;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

/** 按相对亮度选择强调色上的文字色，保证 ≥ 4.5:1 的可读起点 */
export function pickAccentText(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return 'hsl(0 0% 100%)';
  const [r, g, b] = rgb.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.35 ? 'hsl(220 25% 10%)' : 'hsl(0 0% 100%)';
}

/** hex → hsl 字符串，供提示词正文中标注可读色值 */
export function hexToHslString(hex: string): string | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const [r, g, b] = rgb.map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return `hsl(0 0% ${Math.round(l * 100)}%)`;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
  else if (max === g) h = ((b - r) / d + 2) * 60;
  else h = ((r - g) / d + 4) * 60;
  return `hsl(${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%)`;
}

/* ---------------------------------- 参数语义描述 ---------------------------------- */

function describeVariance(n: number): string {
  if (n <= 3) return '对称、居中的保守布局；所有模块等宽对齐，不使用错位或偏移';
  if (n <= 6) return '在可读性优先的前提下允许轻度的不对称构图，如左右 6:4 分栏';
  if (n <= 8) return '主动使用不对称网格（2+1、左文右图错位），避免任何居中对称的 Hero';
  return '强艺术化不对称：重叠层叠、对角线流动、刻意打破网格，但正文可读性不得下降';
}

function describeMotion(n: number): string {
  if (n <= 3) return '仅保留 hover / focus 的即时状态切换，不使用入场动画与滚动驱动动画';
  if (n <= 6) return '一次明确的入场动画（如首屏 fade + 上移 12px，400ms ease-out），其余保持静态';
  if (n <= 8) return '滚动驱动的分段揭示（IntersectionObserver），动效只服务于信息节奏，禁止装饰性循环动画';
  return '编排式电影级动效：页面加载与关键交互各保留一个「大时刻」，其余元素保持静止以避免注意力稀释';
}

function describeDensity(n: number): string {
  if (n <= 3) return '画廊级留白：区块间距 80px 起，卡片内边距不小于 32px，一屏信息量刻意压低';
  if (n <= 6) return '平衡密度：区块间距 48～64px，卡片内边距 24px';
  if (n <= 8) return '偏紧凑：区块间距 32px，卡片内边距 16～20px，允许一屏出现两个信息层级';
  return '仪表盘级密度：区块间距 16px，卡片内边距 12～16px，正文 13px，优先保证一屏信息量';
}

/* -------------------------------- 提示词组装（分段） -------------------------------- */

interface PromptSection {
  title: string;
  lines: string[];
}

/** 把提示词按 `## ` 切分为「头部 + 若干章节」 */
function splitSections(prompt: string): { head: string[]; sections: PromptSection[] } {
  const head: string[] = [];
  const sections: PromptSection[] = [];
  let current: PromptSection | null = null;

  for (const line of prompt.split('\n')) {
    if (line.startsWith('## ')) {
      current = { title: line.slice(3).trim(), lines: [] };
      sections.push(current);
      continue;
    }
    if (current === null) head.push(line);
    else current.lines.push(line);
  }
  return { head, sections };
}

function renderSection(section: PromptSection): string {
  return [`## ${section.title}`, ...section.lines].join('\n').replace(/\n+$/, '');
}

/** 判断章节是否被段落开关关闭 */
function isSectionDisabled(title: string, options: CustomizeOptions): boolean {
  const { sections } = options;
  if (!sections.palette && title.includes('色板')) return true;
  if (!sections.components && title.includes('组件规则')) return true;
  if (!sections.bans && title.includes('反模式禁令')) return true;
  return false;
}

/**
 * 以某条风格提示词为基底，叠加三档参数与品牌占位符，生成定制版提示词。
 */
export function composePrompt(item: StyleItem, options: CustomizeOptions): string {
  const { tuning, brand } = options;
  const { head, sections } = splitSections(item.prompt);
  const kept = sections.filter((section) => !isSectionDisabled(section.title, options));

  const blocks: string[] = [head.join('\n').replace(/\n+$/, '')];
  blocks.push(...kept.map(renderSection));

  const brandLines: string[] = [];
  if (brand.productName.trim() !== '') {
    brandLines.push(
      `- 产品 / 品牌名：${brand.productName.trim()}（所有示例文案、标题、假数据都围绕它组织，禁止使用 Lorem ipsum 与 「Acme」这类占位名）`,
    );
  }
  if (brand.accentColor.trim() !== '') {
    const hsl = hexToHslString(brand.accentColor);
    brandLines.push(
      `- 品牌主色：${brand.accentColor.trim()}${hsl ? `（≈ ${hsl}）` : ''}，替换上述强调色，仅用于主 CTA、焦点态与关键数据；次级色从主色派生而非另选色相`,
    );
  }
  if (brand.headingFont.trim() !== '') {
    brandLines.push(`- 标题字体：${brand.headingFont.trim()}，替换上述标题字体方案，字重按需取 600/700`);
  }
  if (brand.bodyFont.trim() !== '') {
    brandLines.push(`- 正文字体：${brand.bodyFont.trim()}，替换上述正文字体方案`);
  }

  const tuningLines = [
    `- 布局实验度 ${tuning.variance}/10：${describeVariance(tuning.variance)}`,
    `- 动效强度 ${tuning.motion}/10：${describeMotion(tuning.motion)}`,
    `- 信息密度 ${tuning.density}/10：${describeDensity(tuning.density)}`,
  ];

  const customBlock = [
    '## 定制参数',
    tuningLines.join('\n'),
    brandLines.length > 0 ? brandLines.join('\n') : '- 品牌占位符：无（沿用该风格的示例文案）',
    '- 优先级声明：若上述定制参数与本提示词前文的默认值冲突，以定制参数为准；无障碍对比度（≥ 4.5:1）不可被任何参数覆盖',
  ].join('\n');

  blocks.push(customBlock);
  return `${blocks.join('\n\n')}\n`;
}

/* --------------------------------- 预览联动（可视化） --------------------------------- */

export interface DerivedPreview {
  config: PreviewConfig;
  /** 预览容器内边距（由信息密度推导） */
  padding: string;
  /** 是否使用不对称的迷你卡片错位（由布局实验度推导） */
  asymmetric: boolean;
}

function scaleRadius(radius: string, variance: number): string {
  const numeric = Number.parseFloat(radius);
  if (Number.isNaN(numeric) || numeric <= 0) return radius;
  if (variance <= 3) return `${Math.min(numeric, 8)}px`;
  if (variance <= 6) return radius;
  return `${Math.min(Math.round(numeric * 1.8), 32)}px`;
}

function paddingByDensity(density: number): string {
  if (density <= 3) return '24px';
  if (density <= 6) return '18px';
  if (density <= 8) return '15px';
  return '12px';
}

/**
 * 由定制参数推导出预览配置，让抽屉里的预览真实反映「强调色 / 圆角 / 密度 / 不对称」四项变化。
 * 说明：动效强度无法在静态预览中体现，仅作用于生成的提示词文本。
 */
export function derivePreview(item: StyleItem, options: CustomizeOptions): DerivedPreview {
  const { tuning, brand } = options;
  const config: PreviewConfig = {
    ...item.preview,
    palette: { ...item.preview.palette },
    radius: scaleRadius(item.preview.radius, tuning.variance),
    titleLetterSpacing: tuning.variance >= 8 ? '-0.03em' : item.preview.titleLetterSpacing,
  };

  if (brand.accentColor.trim() !== '') {
    config.palette.accent = brand.accentColor.trim();
    config.palette.accentText = pickAccentText(brand.accentColor.trim());
  }
  if (brand.headingFont.trim() !== '') {
    config.headingFont = `"${brand.headingFont.trim()}", "Noto Sans SC", sans-serif`;
  }
  if (brand.bodyFont.trim() !== '') {
    config.bodyFont = `"${brand.bodyFont.trim()}", "Noto Sans SC", sans-serif`;
  }

  return {
    config,
    padding: paddingByDensity(tuning.density),
    asymmetric: tuning.variance >= 8,
  };
}
