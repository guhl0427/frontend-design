/** 风格分类（与筛选 chip 一一对应） */
export type StyleCategory =
  | '现代'
  | '极简'
  | '复古'
  | '工业'
  | '柔和'
  | '未来'
  | '艺术'
  | '国风'
  | '企业';

/** 预览区色板（全部为 HSL / rgba 字符串，可直接用于 CSS） */
export interface StylePalette {
  /** 预览区背景色 */
  bg: string;
  /** 卡片 / 面板表面色 */
  surface: string;
  /** 主文字色 */
  text: string;
  /** 次级文字色 */
  textMuted: string;
  /** 强调色（CTA / 焦点态专用） */
  accent: string;
  /** 强调色上的文字色 */
  accentText: string;
  /** 边框色 */
  border: string;
  /** 硬阴影 / 发光阴影色 */
  shadowColor: string;
}

export type ButtonVariant =
  | 'solid'
  | 'outline'
  | 'hard'
  | 'glass'
  | 'gradient'
  | 'terminal'
  | 'pixel'
  | 'clay'
  | 'liquid'
  | 'riso';
export type CardVariant =
  | 'flat'
  | 'hard'
  | 'glass'
  | 'inset'
  | 'outline'
  | 'pixel'
  | 'sketch'
  | 'acrylic'
  | 'clay'
  | 'liquid'
  | 'riso';

/** 预览渲染配置：Preview 组件据此用该风格自身的规则渲染一个 mini hero */
export interface PreviewConfig {
  palette: StylePalette;
  /** 标题字体（Google Fonts 已引入的真实字体） */
  headingFont: string;
  /** 正文字体 */
  bodyFont: string;
  /** 圆角（CSS 值） */
  radius: string;
  /** 边框宽度（CSS 值） */
  borderWidth: string;
  /** 卡片阴影 */
  shadow: string;
  /** 标题字重 */
  titleWeight: number;
  /** 标题字距 */
  titleLetterSpacing: string;
  /** 标题是否全大写 */
  uppercaseTitle: boolean;
  buttonVariant: ButtonVariant;
  cardVariant: CardVariant;
  /** 可选背景图层（CSS background-image，如渐变 / 网格） */
  backgroundImage?: string;
}

/** 一条风格提示词的完整数据 */
export interface StyleItem {
  id: string;
  /** 中文名 */
  nameZh: string;
  /** 英文名 */
  nameEn: string;
  category: StyleCategory;
  /** 检索用标签 */
  tags: string[];
  /** 一句话摘要（卡片展示） */
  summary: string;
  /** 预览渲染配置 */
  preview: PreviewConfig;
  /** 完整提示词正文（Markdown 风格纯文本，供复制与详情渲染） */
  prompt: string;
}

/* ------------------------------ 定制器（抽屉参数面板） ------------------------------ */

/** 三档参数，全部为 1-10 刻度 */
export interface CustomizeTuning {
  /** 布局实验度：1 对称保守 → 10 艺术化不对称 */
  variance: number;
  /** 动效强度：1 静态 → 10 电影级（仅作用于生成的提示词文本） */
  motion: number;
  /** 信息密度：1 画廊级留白 → 10 仪表盘级密度 */
  density: number;
}

/** 品牌占位符：留空则沿用风格自身的推荐值 */
export interface CustomizeBrand {
  /** 产品或品牌名，用于替换提示词中的占位表述 */
  productName: string;
  /** 品牌主色（hex，如 #22c55e） */
  accentColor: string;
  /** 标题字体（留空沿用风格推荐） */
  headingFont: string;
  /** 正文字体（留空沿用风格推荐） */
  bodyFont: string;
}

/** 段落开关：关闭后该章节不会出现在生成的提示词中 */
export interface CustomizeSections {
  palette: boolean;
  components: boolean;
  bans: boolean;
}

/** 定制器完整选项 */
export interface CustomizeOptions {
  tuning: CustomizeTuning;
  brand: CustomizeBrand;
  sections: CustomizeSections;
}
