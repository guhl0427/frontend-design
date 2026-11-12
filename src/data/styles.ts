import type { StyleCategory, StyleItem } from '../types';

/** 全部分类（固定顺序，供筛选 chip 使用） */
export const CATEGORIES: StyleCategory[] = [
  '现代',
  '极简',
  '复古',
  '工业',
  '柔和',
  '未来',
  '艺术',
  '国风',
  '企业',
];

export const STYLES: StyleItem[] = [
  {
    id: 'neo-brutalism',
    nameZh: '新粗野主义',
    nameEn: 'Neo-brutalism',
    category: '现代',
    tags: ['粗野', '撞色', '硬阴影', '描边'],
    summary: '粗黑描边、高饱和撞色与零模糊硬阴影，信息层级靠边框与色块区分。',
    preview: {
      palette: {
        bg: 'hsl(48 100% 92%)',
        surface: 'hsl(0 0% 100%)',
        text: 'hsl(0 0% 8%)',
        textMuted: 'hsl(0 0% 25%)',
        accent: 'hsl(275 100% 47%)',
        accentText: 'hsl(0 0% 100%)',
        border: 'hsl(0 0% 8%)',
        shadowColor: 'hsl(0 0% 8%)',
      },
      headingFont: '"Archivo Black", sans-serif',
      bodyFont: '"Space Grotesk", sans-serif',
      radius: '2px',
      borderWidth: '2px',
      shadow: '4px 4px 0 hsl(0 0% 8%)',
      titleWeight: 400,
      titleLetterSpacing: '-0.01em',
      uppercaseTitle: true,
      buttonVariant: 'hard',
      cardVariant: 'hard',
    },
    prompt: `# 角色定位
你是精通 Neo-brutalism（新粗野主义）的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
以「粗野、直给、反精致」为核心：粗黑描边、高饱和撞色、硬阴影、无渐变无模糊。信息层级靠边框粗细与色块面积区分，不靠灰度过渡。

## 字体方案
- 标题：Archivo Black（仅 400 字重，靠字号差制造层级），全大写，字距 -0.01em
- 正文：Space Grotesk 400 / 700，行高 1.6
- 禁用 Inter / Roboto / Arial 等系统默认字体；全站字族不超过 2 个

## HSL 色板
- 页面背景 hsl(48 100% 92%)（奶油黄），卡片背景 hsl(0 0% 100%)
- 主色 hsl(275 100% 47%)（电紫），仅用于 CTA、徽章与强调色块
- 辅助色 hsl(3 100% 62%)（橙红）、hsl(164 95% 43%)（青绿）用于次级标签
- 文字 hsl(0 0% 8%)，禁用纯黑 #000，禁用与背景对比度低于 4.5:1 的灰字

## 间距与圆角
- 全部圆角 0～2px，禁用任何 8px 以上圆角
- 间距体系 4 / 8 / 16 / 24 / 48px，卡片内边距不小于 24px
- 边框统一 2～3px 实线 hsl(0 0% 8%)

## 组件规则
- 按钮：2px 黑描边 + 4px 4px 0 hsl(0 0% 8%) 硬阴影；hover 时按钮位移 2px、阴影缩为 2px 2px 0
- 卡片：白底 + 3px 黑边 + 6px 6px 0 硬阴影；阴影模糊值必须为 0
- 徽章：高饱和纯色块 + 黑字或白字，不透明度 100%，禁用半透明

## 反模式禁令
- 禁用任何渐变、backdrop-filter 玻璃效果、模糊投影
- 禁用三等宽卡片布局，主要内容区改用不对称 2+1 网格
- 禁用低于 4.5:1 的文字对比度与 12px 以下字号`,
  },
  {
    id: 'glassmorphism',
    nameZh: '玻璃拟态',
    nameEn: 'Glassmorphism',
    category: '现代',
    tags: ['毛玻璃', '半透明', '渐变背景', '模糊'],
    summary: '磨砂玻璃面板悬浮在饱和渐变背景之上，靠半透明与背景模糊营造纵深。',
    preview: {
      palette: {
        bg: 'hsl(258 70% 18%)',
        surface: 'rgba(255, 255, 255, 0.10)',
        text: 'hsl(0 0% 100%)',
        textMuted: 'rgba(255, 255, 255, 0.72)',
        accent: 'hsl(190 95% 60%)',
        accentText: 'hsl(200 80% 10%)',
        border: 'rgba(255, 255, 255, 0.20)',
        shadowColor: 'rgba(0, 0, 0, 0.30)',
      },
      headingFont: '"Outfit", sans-serif',
      bodyFont: '"Outfit", sans-serif',
      radius: '18px',
      borderWidth: '1px',
      shadow: '0 8px 32px rgba(0, 0, 0, 0.30)',
      titleWeight: 600,
      titleLetterSpacing: '0',
      uppercaseTitle: false,
      buttonVariant: 'solid',
      cardVariant: 'glass',
      backgroundImage:
        'linear-gradient(135deg, hsl(258 70% 18%), hsl(300 60% 22%) 50%, hsl(200 70% 25%))',
    },
    prompt: `# 角色定位
你是精通 Glassmorphism（玻璃拟态）的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
磨砂玻璃面板悬浮在饱和渐变背景之上，纵深来自「半透明表面 + 背景模糊 + 细亮描边」三件套，背景必须足够鲜艳，否则玻璃感不成立。

## 字体方案
- 标题：Outfit 600，字号差至少 1.5 倍
- 正文：Outfit 300 / 400，行高 1.7
- 禁用衬线字体与系统默认字体；字族不超过 2 个

## HSL 色板
- 背景渐变：hsl(258 70% 18%) → hsl(300 60% 22%) → hsl(200 70% 25%)，135° 方向
- 玻璃表面：rgba(255, 255, 255, 0.10)，描边 rgba(255, 255, 255, 0.20)
- 强调色 hsl(190 95% 60%)，仅用于主 CTA 与焦点环
- 文字 hsl(0 0% 100%)，次级文字不低于 70% 不透明度

## 间距与圆角
- 圆角统一 16～24px，卡片内边距不小于 24px
- 玻璃层之间留白至少 16px，禁用贴边堆叠

## 组件规则
- 卡片：backdrop-filter: blur(16px) saturate(140%)，1px 半透明白描边，阴影仅允许 0 8px 32px rgba(0,0,0,0.30) 这类大而柔的投影
- 按钮：主 CTA 用强调色实心，次级用玻璃样式；焦点环 2px 强调色
- 输入框：玻璃底 + 半透明描边，聚焦时描边切换为强调色

## 反模式禁令
- 禁用 100% 不透明的纯白面板（会杀死玻璃感）
- 禁止在浅色 / 低饱和背景上使用玻璃效果
- 禁止三层以上嵌套玻璃；文字对比度不得低于 4.5:1
- 禁用小阴影、硬阴影与任何描边发光以外的特效`,
  },
  {
    id: 'swiss-international',
    nameZh: '瑞士国际主义',
    nameEn: 'Swiss / International',
    category: '极简',
    tags: ['网格', '无衬线', '大留白', '左对齐'],
    summary: '严格网格 + 无衬线大标题 + 大面积留白，客观、克制、信息优先。',
    preview: {
      palette: {
        bg: 'hsl(0 0% 96%)',
        surface: 'hsl(0 0% 100%)',
        text: 'hsl(0 0% 10%)',
        textMuted: 'hsl(0 0% 42%)',
        accent: 'hsl(357 82% 56%)',
        accentText: 'hsl(0 0% 100%)',
        border: 'hsl(0 0% 88%)',
        shadowColor: 'hsl(0 0% 80%)',
      },
      headingFont: '"Inter Tight", sans-serif',
      bodyFont: '"Inter Tight", sans-serif',
      radius: '0px',
      borderWidth: '1px',
      shadow: 'none',
      titleWeight: 800,
      titleLetterSpacing: '-0.03em',
      uppercaseTitle: false,
      buttonVariant: 'solid',
      cardVariant: 'outline',
    },
    prompt: `# 角色定位
你是精通 Swiss / International Typographic Style（瑞士国际主义）的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
客观、克制、信息优先：一切排版服从 12 列网格，靠字号阶梯与留白建立层级，装饰让位于可读性。

## 字体方案
- 标题：Inter Tight 800，字距 -0.03em，落地页主标题不小于 48px
- 正文：Inter Tight 400，行高 1.6，最大行宽 68ch
- 禁用衬线字体、手写体；字族严格限定 1 个

## HSL 色板
- 页面背景 hsl(0 0% 96%)，卡片背景 hsl(0 0% 100%)
- 文字 hsl(0 0% 10%)，说明文字 hsl(0 0% 42%)
- 强调色 hsl(357 82% 56%)（瑞士红），仅用于关键数字、链接与单一主 CTA，全屏出现不超过 3 处

## 间距与圆角
- 圆角一律 0px
- 12 列网格，列间距 24px，版心左右留白不小于 48px
- 间距体系 8 / 16 / 24 / 48 / 96px，仅用这五档

## 组件规则
- 按钮：纯黑底白字（主）或 2px 黑描边（次），hover 反色，无圆角无阴影
- 卡片：1px hsl(0 0% 88%) 描边或仅用上方 1px 分割线，禁用阴影
- 图片：直角裁切，宽度对齐网格列

## 反模式禁令
- 禁用圆角、投影、渐变与任何装饰性图形
- 禁用大段居中排版，正文一律左对齐
- 禁用两种以上强调色；禁用居中错落的瀑布流布局`,
  },
  {
    id: 'editorial-minimal',
    nameZh: '极简编辑风',
    nameEn: 'Editorial Minimal',
    category: '极简',
    tags: ['衬线', '杂志排版', '细线', '留白'],
    summary: '衬线大标题 + 杂志式栏线排版，像一本安静的纸刊。',
    preview: {
      palette: {
        bg: 'hsl(40 30% 97%)',
        surface: 'hsl(40 30% 99%)',
        text: 'hsl(30 10% 14%)',
        textMuted: 'hsl(30 8% 42%)',
        accent: 'hsl(15 65% 42%)',
        accentText: 'hsl(40 30% 97%)',
        border: 'hsl(30 15% 85%)',
        shadowColor: 'hsl(30 20% 80%)',
      },
      headingFont: '"Fraunces", serif',
      bodyFont: '"Noto Serif SC", serif',
      radius: '0px',
      borderWidth: '1px',
      shadow: 'none',
      titleWeight: 600,
      titleLetterSpacing: '0',
      uppercaseTitle: false,
      buttonVariant: 'outline',
      cardVariant: 'outline',
    },
    prompt: `# 角色定位
你是精通 Editorial Minimal（极简编辑风）的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
像一本安静的纸刊：衬线大标题、细分栏线、克制的暖白纸面，层级完全由字号、字重与留白承担。

## 字体方案
- 标题：Fraunces（衬线）600，落地页主标题不小于 44px
- 正文：Noto Serif SC 400，行高 1.8，段间距 1em
- 辅助标签可用无衬线小号大写字母，字距 0.14em；全站字族不超过 2 个

## HSL 色板
- 纸面背景 hsl(40 30% 97%)，卡片 hsl(40 30% 99%)
- 正文 hsl(30 10% 14%)，次级 hsl(30 8% 42%)
- 强调色 hsl(15 65% 42%)（赭红），仅用于栏首字、链接与下划线，不用于大面积色块

## 间距与圆角
- 圆角一律 0px，一切分割靠 1px hsl(30 15% 85%) 细线
- 栏间距 32px，版心最大宽度 72ch，上下留白不小于 64px

## 组件规则
- 按钮：1px 文字色描边的幽灵按钮，hover 时填充强调色并切换文字色
- 卡片：仅上边线或整框细线，无阴影，内边距 32px
- 引用块：左侧 2px 强调色竖线 + 缩进 24px

## 反模式禁令
- 禁用阴影、渐变、圆角与彩色大色块
- 禁用三等宽卡片，使用不对称的 2+1 或 1 长文 + 2 短栏布局
- 禁用低于 4.5:1 对比度的浅灰文字；禁用两种以上强调色`,
  },
  {
    id: 'cyberpunk',
    nameZh: '赛博朋克',
    nameEn: 'Cyberpunk',
    category: '未来',
    tags: ['霓虹', '发光', '暗黑', '故障'],
    summary: '深空底色上的霓虹洋红与青色发光边缘，科技感拉满。',
    preview: {
      palette: {
        bg: 'hsl(265 80% 6%)',
        surface: 'hsl(265 60% 10%)',
        text: 'hsl(190 30% 90%)',
        textMuted: 'hsl(260 15% 62%)',
        accent: 'hsl(315 100% 58%)',
        accentText: 'hsl(280 60% 6%)',
        border: 'hsl(170 100% 45%)',
        shadowColor: 'hsl(315 100% 58%)',
      },
      headingFont: '"Orbitron", sans-serif',
      bodyFont: '"Chakra Petch", sans-serif',
      radius: '2px',
      borderWidth: '1px',
      shadow: '0 0 18px hsl(315 100% 58% / 0.55)',
      titleWeight: 700,
      titleLetterSpacing: '0.08em',
      uppercaseTitle: true,
      buttonVariant: 'outline',
      cardVariant: 'outline',
      backgroundImage:
        'repeating-linear-gradient(0deg, rgba(0,255,209,0.05) 0 1px, transparent 1px 28px), repeating-linear-gradient(90deg, rgba(0,255,209,0.05) 0 1px, transparent 1px 28px)',
    },
    prompt: `# 角色定位
你是精通 Cyberpunk（赛博朋克）视觉的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
深空底色 + 霓虹双色（洋红 / 青）发光边缘，营造高对比的未来废墟感；动效克制在发光与扫掠，不做无意义的粒子堆砌。

## 字体方案
- 标题：Orbitron 700，全大写，字距 0.08em
- 正文：Chakra Petch 400 / 600，行高 1.6
- 代码与数据：IBM Plex Mono；全站字族不超过 3 个

## HSL 色板
- 页面背景 hsl(265 80% 6%)，面板 hsl(265 60% 10%)
- 主强调 hsl(315 100% 58%)（霓虹洋红），仅用于 CTA、焦点与发光边
- 次强调 hsl(170 100% 50%)（霓虹青），用于边框、数据与状态
- 文字 hsl(190 30% 90%)，次级 hsl(260 15% 62%)

## 间距与圆角
- 圆角 0～2px，多用 45° 斜切角（clip-path: polygon）替代圆角
- 间距体系 8 / 16 / 32 / 64px，面板内边距不小于 24px

## 组件规则
- 按钮：1px 霓虹青描边 + 同色 box-shadow 外发光；主 CTA 洋红填充
- 卡片：1px 霓虹描边，标题栏带 45° 切角，hover 时发光强度提升
- 背景可加 1px 霓虹青网格线（repeating-linear-gradient，透明度低于 8%）

## 反模式禁令
- 禁用浅色背景与暖色系配色
- 禁止超过两种霓虹发光色同时高亮，避免视觉噪声
- 禁用大圆角、柔和阴影；文字对比度不低于 4.5:1
- 禁用大面积闪烁动画（可访问性风险），动效仅限 hover 发光与一次性扫掠`,
  },
  {
    id: 'vaporwave',
    nameZh: '蒸汽波',
    nameEn: 'Vaporwave',
    category: '复古',
    tags: ['渐变', '落日', '霓虹粉', '80年代'],
    summary: '粉紫落日渐变与地平线，80 年代复古未来主义的数字黄昏。',
    preview: {
      palette: {
        bg: 'hsl(290 60% 22%)',
        surface: 'rgba(255, 255, 255, 0.12)',
        text: 'hsl(315 100% 92%)',
        textMuted: 'hsl(300 50% 78%)',
        accent: 'hsl(320 100% 70%)',
        accentText: 'hsl(300 60% 12%)',
        border: 'hsl(190 100% 70%)',
        shadowColor: 'hsl(320 100% 70%)',
      },
      headingFont: '"Unbounded", sans-serif',
      bodyFont: '"Rubik", sans-serif',
      radius: '8px',
      borderWidth: '1px',
      shadow: '0 0 16px hsl(320 100% 70% / 0.6)',
      titleWeight: 600,
      titleLetterSpacing: '0.06em',
      uppercaseTitle: true,
      buttonVariant: 'gradient',
      cardVariant: 'glass',
      backgroundImage:
        'linear-gradient(180deg, hsl(280 70% 22%) 0%, hsl(320 80% 32%) 54%, hsl(195 90% 58%) 54.5%, hsl(195 95% 62%) 100%)',
    },
    prompt: `# 角色定位
你是精通 Vaporwave（蒸汽波）美学的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
80 年代复古未来主义：粉紫落日渐变、青色地平线、霓虹描边，整体像一盘被阳光晒化的 VHS 磁带。

## 字体方案
- 标题：Unbounded 600，全大写，字距 0.06em
- 正文：Rubik 400 / 500，行高 1.7
- 禁用衬线字体与系统默认字体；字族不超过 2 个

## HSL 色板
- 背景落日渐变：hsl(280 70% 22%) → hsl(320 80% 32%)（上半）→ hsl(195 90% 58%)（地平线以下），180° 方向
- 主强调 hsl(320 100% 70%)（霓虹粉），用于 CTA 与发光
- 次强调 hsl(190 100% 70%)（青），用于描边与次级按钮
- 文字 hsl(315 100% 92%)，次级 hsl(300 50% 78%)

## 间距与圆角
- 圆角 6～10px；卡片内边距不小于 20px
- 间距体系 8 / 16 / 32 / 64px

## 组件规则
- 按钮：粉→青 对角渐变填充，或 1px 青色描边 + 粉色外发光
- 卡片：半透明白（12%）+ backdrop-filter: blur(12px)，1px 青色描边
- 标题可加 text-shadow: 0 0 16px hsl(320 100% 70%) 霓虹光晕

## 反模式禁令
- 禁用暖黄色与棕色系；禁用 100% 不透明深色面板
- 禁用灰色系中性配色，所有中性色必须带粉 / 紫色相
- 禁用直角与硬阴影；文字对比度不低于 4.5:1
- 禁用持续闪烁的霓虹动画`,
  },
  {
    id: 'artdeco',
    nameZh: '装饰艺术',
    nameEn: 'Art Deco',
    category: '复古',
    tags: ['金色', '几何', '对称', '线条'],
    summary: '深邃底色上的金色几何线条与对称构图，1920 年代的奢华秩序。',
    preview: {
      palette: {
        bg: 'hsl(230 35% 9%)',
        surface: 'hsl(230 30% 13%)',
        text: 'hsl(43 60% 88%)',
        textMuted: 'hsl(43 25% 62%)',
        accent: 'hsl(43 90% 58%)',
        accentText: 'hsl(230 35% 9%)',
        border: 'hsl(43 70% 50%)',
        shadowColor: 'hsl(43 90% 58%)',
      },
      headingFont: '"Poiret One", sans-serif',
      bodyFont: '"Cormorant Garamond", serif',
      radius: '0px',
      borderWidth: '1px',
      shadow: '0 0 24px hsl(43 90% 58% / 0.25)',
      titleWeight: 400,
      titleLetterSpacing: '0.22em',
      uppercaseTitle: true,
      buttonVariant: 'outline',
      cardVariant: 'outline',
    },
    prompt: `# 角色定位
你是精通 Art Deco（装饰艺术）风格的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
1920 年代的机械美学：严格对称、金色细线几何框架、放射状装饰，奢华但克制——金色永远只是线条，不做大面积填充。

## 字体方案
- 标题：Poiret One 400，全大写，字距 0.22em
- 正文：Cormorant Garamond 400 / 600，行高 1.8
- 禁用粗黑无衬线字体；全站字族不超过 2 个

## HSL 色板
- 页面背景 hsl(230 35% 9%)（午夜蓝黑），面板 hsl(230 30% 13%)
- 金色 hsl(43 90% 58%)，仅用于线条、描边、图标与分割装饰
- 正文 hsl(43 60% 88%)，次级 hsl(43 25% 62%)
- 禁用纯白与纯黑

## 间距与圆角
- 圆角一律 0px，几何感靠 1px 金线边框与菱形 / 放射装饰
- 版式严格左右对称，间距体系 8 / 16 / 32 / 64px

## 组件规则
- 按钮：1px 金色描边 + 金字，hover 时金底黑字，无圆角
- 卡片：金色细线整框，顶部中央放菱形装饰符号（◆），内边距 32px
- 分割线：中心对称的双线 + 菱形节点

## 反模式禁令
- 禁用圆角、渐变、玻璃模糊与彩色投影
- 禁用不对称布局与非居中排版（本风格例外：允许居中）
- 禁止金色大面积填充（超过表面 15% 即违规）；文字对比度不低于 4.5:1`,
  },
  {
    id: 'terminal-cli',
    nameZh: '终端风',
    nameEn: 'Terminal / CLI',
    category: '工业',
    tags: ['等宽', '命令行', '绿字', '工程感'],
    summary: '等宽字体 + 提示符 + 语法高亮，把界面做成一个可信的终端会话。',
    preview: {
      palette: {
        bg: 'hsl(150 20% 5%)',
        surface: 'hsl(150 18% 8%)',
        text: 'hsl(135 60% 72%)',
        textMuted: 'hsl(150 12% 48%)',
        accent: 'hsl(135 70% 55%)',
        accentText: 'hsl(150 20% 5%)',
        border: 'hsl(135 30% 28%)',
        shadowColor: 'hsl(135 70% 55%)',
      },
      headingFont: '"IBM Plex Mono", monospace',
      bodyFont: '"IBM Plex Mono", monospace',
      radius: '0px',
      borderWidth: '1px',
      shadow: 'none',
      titleWeight: 600,
      titleLetterSpacing: '0',
      uppercaseTitle: false,
      buttonVariant: 'terminal',
      cardVariant: 'outline',
    },
    prompt: `# 角色定位
你是精通 Terminal / CLI（终端风）界面的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
把网页做成一个可信的终端会话：等宽字体、行号与提示符、语法高亮式的有限配色，工程感来自精确而非装饰。

## 字体方案
- 全站唯一字体：IBM Plex Mono 400 / 600，行高 1.5
- 标题不放大字号超过正文的 1.3 倍，层级靠前缀符号（## / $ / >）表达
- 禁用任何非等宽字体

## HSL 色板
- 背景 hsl(150 20% 5%)，面板 hsl(150 18% 8%)
- 前景绿 hsl(135 60% 72%)（正文），命令绿 hsl(135 70% 55%)（强调与 CTA）
- 注释灰 hsl(150 12% 48%)，错误红 hsl(0 70% 60%)，仅用于错误态
- 禁用 4 种以上前景色

## 间距与圆角
- 圆角一律 0px
- 间距以行为单位：1 行 = 1.5em，段落间空一行；面板内边距 16px

## 组件规则
- 按钮：方括号包裹的文本按钮 [ run ]，hover 时反色为绿底黑字
- 卡片：1px hsl(135 30% 28%) 描边面板，顶部标题栏用 ● ● ● 三色点或路径栏（~/path）
- 状态徽章：$ success / ! warning / x error 三种前缀，禁止彩色底徽章

## 反模式禁令
- 禁用圆角、阴影、渐变与任何彩色装饰
- 禁用非等宽字体与图片型装饰
- 禁用大面积高饱和色块；文字对比度不低于 4.5:1
- 禁用居中排版，一切左对齐`,
  },
  {
    id: 'neumorphism',
    nameZh: '柔和新拟态',
    nameEn: 'Soft / Neumorphism',
    category: '柔和',
    tags: ['软阴影', '浮雕', '低对比', '圆润'],
    summary: '同色系浮雕：双向柔光阴影让控件从背景中温和地鼓起或凹陷。',
    preview: {
      palette: {
        bg: 'hsl(225 20% 90%)',
        surface: 'hsl(225 20% 90%)',
        text: 'hsl(225 15% 28%)',
        textMuted: 'hsl(225 12% 38%)',
        accent: 'hsl(255 70% 60%)',
        accentText: 'hsl(0 0% 100%)',
        border: 'hsl(225 20% 82%)',
        shadowColor: 'hsl(225 25% 72%)',
      },
      headingFont: '"Nunito", sans-serif',
      bodyFont: '"Nunito", sans-serif',
      radius: '20px',
      borderWidth: '0px',
      shadow: '6px 6px 12px hsl(225 25% 78%), -6px -6px 12px hsl(0 0% 100%)',
      titleWeight: 800,
      titleLetterSpacing: '0',
      uppercaseTitle: false,
      buttonVariant: 'solid',
      cardVariant: 'inset',
    },
    prompt: `# 角色定位
你是精通 Soft UI / Neumorphism（柔和新拟态）的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
控件与背景同色，靠「右下深色柔影 + 左上高光」双向阴影制造浮雕感；按压态反转为内凹。整体温和、无棱角。

## 字体方案
- 标题：Nunito 800，圆润笔画
- 正文：Nunito 400 / 600，行高 1.7
- 禁用锐利的几何无衬线（如 Archivo Black）与衬线体；字族不超过 2 个

## HSL 色板
- 背景与控件同色：hsl(225 20% 90%)（唯一的表面色）
- 文字 hsl(225 15% 28%)，次级 hsl(225 12% 45%)
- 强调色 hsl(255 70% 60%)，仅用于主 CTA、开关激活态与焦点
- 阴影色 hsl(225 25% 78%)（暗）与 hsl(0 0% 100%)（高光）

## 间距与圆角
- 圆角不小于 16px，按钮 999px 胶囊形
- 控件之间留白不小于 24px（浮雕需要呼吸空间）
- 间距体系 8 / 16 / 24 / 48px

## 组件规则
- 凸起：box-shadow: 6px 6px 12px hsl(225 25% 78%), -6px -6px 12px hsl(0 0% 100%)
- 按压 / 输入框：内凹 box-shadow: inset 4px 4px 8px hsl(225 25% 78%), inset -4px -4px 8px hsl(0 0% 100%)
- 禁用描边（border 全部为 0），层级只靠阴影方向表达

## 反模式禁令
- 禁用边框、硬阴影与渐变背景
- 禁用在深色背景上做新拟态（该风格仅适用于浅色低饱和底）
- 禁用小尺寸图标按钮（< 40px，浮雕无法辨认）
- 文字对比度必须不低于 4.5:1——次级文字不得低于 hsl(225 12% 40%)`,
  },
  {
    id: 'japanese-zen',
    nameZh: '日式侘寂',
    nameEn: 'Japanese Zen',
    category: '极简',
    tags: ['侘寂', '留白', '衬线', '朱红'],
    summary: '和纸底色、宋体标题与一点朱红，留白即设计。',
    preview: {
      palette: {
        bg: 'hsl(35 25% 95%)',
        surface: 'hsl(35 30% 98%)',
        text: 'hsl(30 12% 18%)',
        textMuted: 'hsl(30 10% 42%)',
        accent: 'hsl(0 38% 46%)',
        accentText: 'hsl(35 25% 96%)',
        border: 'hsl(30 15% 84%)',
        shadowColor: 'hsl(30 20% 82%)',
      },
      headingFont: '"Noto Serif SC", serif',
      bodyFont: '"Noto Sans SC", sans-serif',
      radius: '2px',
      borderWidth: '1px',
      shadow: 'none',
      titleWeight: 600,
      titleLetterSpacing: '0.12em',
      uppercaseTitle: false,
      buttonVariant: 'outline',
      cardVariant: 'outline',
    },
    prompt: `# 角色定位
你是精通 Japanese Zen（日式侘寂）美学的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
留白即设计：和纸质感的暖白底、细衬线标题、几乎不存在的线条，全部装饰只是印章式的一点朱红。

## 字体方案
- 标题：Noto Serif SC 600，字距 0.12em，禁用加粗到 700 以上
- 正文：Noto Sans SC 400，行高 2.0，段间距 1.5em
- 数字与日期可用 IBM Plex Mono 点缀；全站字族不超过 3 个

## HSL 色板
- 纸面 hsl(35 25% 95%)，卡片 hsl(35 30% 98%)
- 正文 hsl(30 12% 18%)，次级 hsl(30 10% 42%)
- 朱红 hsl(0 38% 46%)，仅用于一枚印章式徽标、一个 CTA 与悬停态，全页不超过 3 处

## 间距与圆角
- 圆角 0～2px；一切边框 1px hsl(30 15% 84%)
- 留白极度慷慨：区块上下间距不小于 96px，版心最大宽度 38em
- 间距体系 16 / 32 / 64 / 96px

## 组件规则
- 按钮：1px 墨色描边幽灵按钮，hover 时朱红描边 + 朱红文字
- 卡片：仅细线边框或无线框，内边距 40px，无阴影
- 图片：统一留 8px 纸白边，如装裱

## 反模式禁令
- 禁用阴影、渐变、圆角卡片与彩色底色块
- 禁用紧凑排版（行高低于 1.8、区块间距低于 64px 均违规）
- 禁用两种以上强调色；禁用高饱和霓虹色
- 文字对比度不低于 4.5:1`,
  },
  {
    id: 'bento-grid',
    nameZh: '便当盒布局',
    nameEn: 'Bento Grid',
    category: '现代',
    tags: ['网格', '大圆角', '模块化', '卡片'],
    summary: '大小不一的圆角卡片拼成紧凑网格，像一份精心搭配的便当。',
    preview: {
      palette: {
        bg: 'hsl(220 20% 95%)',
        surface: 'hsl(0 0% 100%)',
        text: 'hsl(220 25% 16%)',
        textMuted: 'hsl(220 12% 45%)',
        accent: 'hsl(250 80% 58%)',
        accentText: 'hsl(0 0% 100%)',
        border: 'hsl(220 20% 88%)',
        shadowColor: 'hsl(220 30% 80%)',
      },
      headingFont: '"Sora", sans-serif',
      bodyFont: '"Sora", sans-serif',
      radius: '24px',
      borderWidth: '0px',
      shadow: '0 2px 8px hsl(220 30% 85%)',
      titleWeight: 600,
      titleLetterSpacing: '-0.01em',
      uppercaseTitle: false,
      buttonVariant: 'solid',
      cardVariant: 'flat',
    },
    prompt: `# 角色定位
你是精通 Bento Grid（便当盒布局）的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
用大小不一的圆角卡片把信息切成一口大小，拼成紧凑而有节奏的网格；卡片尺寸必须有差异（2x2 / 2x1 / 1x1 混排），拒绝均匀平铺。

## 字体方案
- 标题：Sora 600，卡片标题不超过 20px
- 正文：Sora 400，行高 1.6；数字可用 IBM Plex Mono 突出
- 禁用衬线字体；全站字族不超过 2 个

## HSL 色板
- 页面背景 hsl(220 20% 95%)，卡片 hsl(0 0% 100%)
- 文字 hsl(220 25% 16%)，次级 hsl(220 12% 45%)
- 强调色 hsl(250 80% 58%)，仅用于主 CTA、图标与焦点
- 允许 1 张特色卡片使用强调色或其 10% 透明度底色，其余一律白底

## 间距与圆角
- 卡片圆角 24px，网格 gap 12～16px
- 间距体系 8 / 12 / 16 / 24px，卡片内边距 24px
- 桌面端 4 列、平板 2 列、手机 1 列，关键卡片跨 2 列

## 组件规则
- 卡片：白底 + 0 2px 8px hsl(220 30% 85%) 轻阴影，无描边
- 按钮：强调色实心胶囊（999px 圆角），或白底灰字次级
- 图标：线性图标 1.5px 描边，色相与强调色一致

## 反模式禁令
- 禁用三等宽 / 全等大的均匀网格，卡片尺寸必须有 2 种以上
- 禁用超过 1 张彩色卡片；禁用硬阴影与描边卡片
- 禁用低于 4.5:1 的文字对比度；禁用 12px 以下字号`,
  },
  {
    id: 'dark-luxury',
    nameZh: '暗黑高级',
    nameEn: 'Dark Luxury',
    category: '现代',
    tags: ['暗黑', '金色', '衬线', '高奢'],
    summary: '近黑底色配香槟金细线与衬线标题，安静而昂贵。',
    preview: {
      palette: {
        bg: 'hsl(260 15% 7%)',
        surface: 'hsl(260 12% 11%)',
        text: 'hsl(40 35% 92%)',
        textMuted: 'hsl(40 15% 62%)',
        accent: 'hsl(42 70% 60%)',
        accentText: 'hsl(260 15% 7%)',
        border: 'hsl(42 50% 38%)',
        shadowColor: 'hsl(42 70% 60%)',
      },
      headingFont: '"Cormorant Garamond", serif',
      bodyFont: '"Jost", sans-serif',
      radius: '0px',
      borderWidth: '1px',
      shadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
      titleWeight: 600,
      titleLetterSpacing: '0.14em',
      uppercaseTitle: true,
      buttonVariant: 'outline',
      cardVariant: 'outline',
    },
    prompt: `# 角色定位
你是精通 Dark Luxury（暗黑高奢）风格的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
近黑底 + 香槟金细节 + 优雅衬线：昂贵感来自极少的金色与极大的留白，而不是金色的堆砌。

## 字体方案
- 标题：Cormorant Garamond 600，全大写时字距 0.14em，主标题不小于 40px
- 正文：Jost 400 / 500，行高 1.8
- 禁用粗黑几何字体；全站字族不超过 2 个

## HSL 色板
- 页面背景 hsl(260 15% 7%)，面板 hsl(260 12% 11%)
- 香槟金 hsl(42 70% 60%)，仅用于细线描边、图标与小号 CTA 文字
- 正文 hsl(40 35% 92%)，次级 hsl(40 15% 62%)
- 禁用纯黑 #000 与高饱和金色 hsl(43 100% 70%) 以上亮度

## 间距与圆角
- 圆角 0px；一切装饰靠 1px hsl(42 50% 38%) 金线
- 留白慷慨：区块间距不小于 80px，版心最大宽度 64em

## 组件规则
- 按钮：1px 金线描边 + 金字幽灵按钮，hover 时填充金色并切换为深底文字
- 卡片：金线细框，内边距 40px，阴影仅允许 rgba(0,0,0,0.5) 的深投影
- 图片：低饱和处理（saturate(0.8)），配金色细线装裱

## 反模式禁令
- 禁用渐变金、大面积金色填充（金色占比超过 10% 即违规）
- 禁用圆角卡片、彩色阴影与霓虹发光
- 禁用高饱和彩色（蓝 / 绿 / 粉一律不用）；文字对比度不低于 4.5:1`,
  },
  {
    id: 'y2k',
    nameZh: '千禧风',
    nameEn: 'Y2K',
    category: '复古',
    tags: ['Y2K', '泡泡', '金属渐变', '天蓝'],
    summary: '天蓝与亮粉的泡泡质感，2000 年代之初的乐观金属光泽。',
    preview: {
      palette: {
        bg: 'hsl(200 100% 95%)',
        surface: 'hsl(0 0% 100%)',
        text: 'hsl(255 60% 30%)',
        textMuted: 'hsl(255 30% 50%)',
        accent: 'hsl(320 100% 62%)',
        accentText: 'hsl(0 0% 100%)',
        border: 'hsl(200 100% 70%)',
        shadowColor: 'hsl(320 100% 62%)',
      },
      headingFont: '"Comfortaa", sans-serif',
      bodyFont: '"Rubik", sans-serif',
      radius: '16px',
      borderWidth: '2px',
      shadow: '0 6px 0 hsl(200 100% 78%)',
      titleWeight: 600,
      titleLetterSpacing: '0',
      uppercaseTitle: false,
      buttonVariant: 'gradient',
      cardVariant: 'flat',
      backgroundImage:
        'radial-gradient(circle at 15% 15%, hsl(300 100% 94%), transparent 45%), radial-gradient(circle at 85% 0%, hsl(190 100% 90%), transparent 40%)',
    },
    prompt: `# 角色定位
你是精通 Y2K（千禧风）美学的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
2000 年代之初的乐观科技感：天蓝 × 亮粉 × 银色金属渐变，泡泡形圆角与厚底投影，像一台 iMac G3 上的网页。

## 字体方案
- 标题：Comfortaa 600，圆润连笔感
- 正文：Rubik 400 / 500，行高 1.6
- 禁用衬线与等宽字体；全站字族不超过 2 个

## HSL 色板
- 背景天蓝 hsl(200 100% 95%)，卡片纯白
- 主强调 hsl(320 100% 62%)（亮粉），用于 CTA 与徽章
- 次强调 hsl(200 100% 55%)（Y2K 蓝），用于链接与描边
- 文字 hsl(255 60% 30%)（深紫蓝），次级 hsl(255 30% 50%)

## 间距与圆角
- 圆角 16px 以上，按钮 999px 胶囊
- 间距体系 8 / 16 / 24 / 48px，卡片内边距 24px

## 组件规则
- 按钮：粉→蓝 对角线性渐变，白字，底部 4px 同色系实色投影（0 4px 0）
- 卡片：白底 + 2px 天蓝描边 + 0 6px 0 hsl(200 100% 78%) 厚投影
- 徽章：银色金属渐变（hsl(210 40% 90%) → hsl(210 30% 75%)）胶囊形

## 反模式禁令
- 禁用深黑背景与暗黑系配色
- 禁用锐利直角与细线极简风；禁用单色扁平按钮（必须有渐变或厚投影）
- 禁用超过 3 种色相；文字对比度不低于 4.5:1
- 禁用持续旋转 / 闪烁的 GIF 式动画`,
  },
  {
    id: 'corporate-professional',
    nameZh: '商务专业',
    nameEn: 'Corporate Professional',
    category: '现代',
    tags: ['商务', '信任感', '蓝色', '稳重'],
    summary: '克制的商务蓝与清晰的层级，为信任与转化服务的中性专业感。',
    preview: {
      palette: {
        bg: 'hsl(210 25% 98%)',
        surface: 'hsl(0 0% 100%)',
        text: 'hsl(215 25% 22%)',
        textMuted: 'hsl(215 12% 42%)',
        accent: 'hsl(215 90% 48%)',
        accentText: 'hsl(0 0% 100%)',
        border: 'hsl(210 20% 88%)',
        shadowColor: 'hsl(215 30% 82%)',
      },
      headingFont: '"IBM Plex Sans", sans-serif',
      bodyFont: '"IBM Plex Sans", sans-serif',
      radius: '8px',
      borderWidth: '1px',
      shadow: '0 1px 3px hsl(215 30% 85%)',
      titleWeight: 600,
      titleLetterSpacing: '-0.01em',
      uppercaseTitle: false,
      buttonVariant: 'solid',
      cardVariant: 'flat',
    },
    prompt: `# 角色定位
你是精通 Corporate Professional（商务专业）风格的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
一切为信任与转化服务：克制的商务蓝、清晰的信息层级、稳定的中性灰，拒绝花哨但绝不廉价。

## 字体方案
- 标题：IBM Plex Sans 600，落地页主标题 40～56px
- 正文：IBM Plex Sans 400，行高 1.65，最大行宽 68ch
- 禁用装饰性字体（手写体 / 展示体）；字族严格 1 个

## HSL 色板
- 页面背景 hsl(210 25% 98%)，卡片纯白
- 品牌蓝 hsl(215 90% 48%)，仅用于主 CTA、链接与焦点环
- 深蓝 hsl(215 60% 24%) 用于页脚与深色区块
- 文字 hsl(215 25% 22%)，次级 hsl(215 12% 48%)

## 间距与圆角
- 圆角统一 8px，输入框 6px
- 间距体系 8 / 16 / 24 / 40 / 64px，卡片内边距 32px
- 12 列网格，列间距 24px

## 组件规则
- 按钮：品牌蓝实心（主）/ 1px 描边（次），hover 深化 10% 亮度，焦点环 2px hsl(215 90% 48% / 0.4)
- 卡片：白底 + 1px hsl(210 20% 88%) 描边 + 0 1px 3px 极轻阴影
- 表格：斑马纹 hsl(210 30% 96%)，表头 12px 大写字母字距 0.05em

## 反模式禁令
- 禁用渐变按钮、霓虹色与玻璃拟态
- 禁用超过 1 种品牌色相；禁用大面积高饱和色块
- 禁用居中长文本；文字对比度不低于 4.5:1
- 禁用三等宽特性卡片，改用 2+1 或 1 大 2 小布局`,
  },
  {
    id: 'playful-geometric',
    nameZh: '童趣几何',
    nameEn: 'Playful Geometric',
    category: '柔和',
    tags: ['童趣', '几何', '贴纸', '活泼'],
    summary: '圆胖字体、糖果色块与贴纸式徽章，友好到可以拍一拍。',
    preview: {
      palette: {
        bg: 'hsl(45 100% 92%)',
        surface: 'hsl(0 0% 100%)',
        text: 'hsl(340 60% 22%)',
        textMuted: 'hsl(340 25% 45%)',
        accent: 'hsl(345 80% 56%)',
        accentText: 'hsl(0 0% 100%)',
        border: 'hsl(260 60% 45%)',
        shadowColor: 'hsl(260 60% 45%)',
      },
      headingFont: '"Fredoka", sans-serif',
      bodyFont: '"Nunito", sans-serif',
      radius: '16px',
      borderWidth: '3px',
      shadow: '4px 4px 0 hsl(260 60% 45%)',
      titleWeight: 600,
      titleLetterSpacing: '0',
      uppercaseTitle: false,
      buttonVariant: 'hard',
      cardVariant: 'hard',
    },
    prompt: `# 角色定位
你是精通 Playful Geometric（童趣几何）风格的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
友好、圆胖、可以拍一拍：糖果色块、贴纸式徽章、轻微旋转的元素，用几何形状制造亲切感而不是幼稚感。

## 字体方案
- 标题：Fredoka 600，禁用全大写（破坏圆润感）
- 正文：Nunito 400 / 700，行高 1.7
- 禁用锐利几何字体与衬线体；全站字族不超过 2 个

## HSL 色板
- 页面背景 hsl(45 100% 92%)（奶油黄），卡片纯白
- 主强调 hsl(345 80% 56%)（糖果红），用于 CTA 与贴纸
- 辅助色 hsl(260 80% 60%)（葡萄紫）、hsl(150 60% 45%)（叶绿）用于徽章与插画
- 描边统一 hsl(260 60% 45%)；文字 hsl(340 60% 22%)

## 间距与圆角
- 圆角 16～24px，按钮 999px
- 间距体系 8 / 16 / 24 / 40px，卡片内边距 24px
- 徽章与贴纸允许 rotate(-3deg ~ 3deg) 微旋转

## 组件规则
- 按钮：3px 紫色描边 + 4px 4px 0 硬投影，hover 时上浮 2px
- 卡片：白底 + 3px 描边 + 6px 6px 0 硬投影，圆角 20px
- 徽章：糖果色胶囊 + 白字，或白色贴纸 + 虚线描边

## 反模式禁令
- 禁用暗黑系配色、玻璃拟态与渐变阴影
- 禁用全大写标题与锐利直角
- 禁用超过 4 种色相；文字对比度不低于 4.5:1
- 禁用持续弹跳动画（仅允许 hover 一次性反馈）`,
  },
  {
    id: 'bauhaus',
    nameZh: '包豪斯',
    nameEn: 'Bauhaus',
    category: '艺术',
    tags: ['几何', '三原色', '功能主义', '构成'],
    summary: '圆、方、三角三种基本形 + 红黄蓝三原色，用几何构成与网格秩序说话。',
    preview: {
      palette: {
        bg: 'hsl(45 24% 96%)',
        surface: 'hsl(0 0% 100%)',
        text: 'hsl(0 0% 10%)',
        textMuted: 'hsl(0 0% 32%)',
        accent: 'hsl(0 84% 52%)',
        accentText: 'hsl(0 0% 100%)',
        border: 'hsl(0 0% 10%)',
        shadowColor: 'hsl(0 0% 10%)',
      },
      headingFont: '"Josefin Sans", sans-serif',
      bodyFont: '"Jost", sans-serif',
      radius: '0px',
      borderWidth: '3px',
      shadow: 'none',
      titleWeight: 700,
      titleLetterSpacing: '0.02em',
      uppercaseTitle: false,
      buttonVariant: 'solid',
      cardVariant: 'outline',
      backgroundImage:
        'radial-gradient(circle at 88% 20%, hsl(45 95% 55%) 0 32px, transparent 32px), linear-gradient(90deg, hsl(0 84% 52%) 0 6px, hsl(220 90% 50%) 6px 12px, hsl(45 95% 55%) 12px 18px, transparent 18px)',
    },
    prompt: `# 角色定位
你是精通 Bauhaus（包豪斯）风格的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
形式追随功能。只用圆、方、三角三种基本形与红黄蓝三原色（加黑与米白），靠几何构成与网格秩序建立视觉冲击，禁止一切装饰性渐变与拟物质感。

## 字体方案
- 标题：Josefin Sans 700，字距 0.02em，强调几何骨架
- 正文：Jost 400，行高 1.65
- 禁用衬线字体、手写体与花体；字族不超过 2 个

## HSL 色板
- 背景 hsl(45 24% 96%)（米白），面板 hsl(0 0% 100%)
- 三原色仅此三支：红 hsl(0 84% 52%)、蓝 hsl(220 90% 50%)、黄 hsl(45 95% 55%)
- 文字与描边统一 hsl(0 0% 10%)，禁用纯黑 #000
- 单页三原色面积比建议 6 : 3 : 1，禁止三色等量平铺

## 间距与圆角
- 圆角 0px：禁止任何圆角
- 间距体系 8 / 16 / 24 / 40 / 64px，遵循 8px 基准网格
- 所有元素必须与至少一条网格线对齐，禁止随意浮放

## 组件规则
- 按钮：实心矩形 + 3px 黑描边，无圆角无阴影；hover 时仅填充色在三原色间轮换
- 卡片：白底 + 3px 黑描边，标题左侧配一个 24px 的基本形色块（圆/方/三角）
- 图形：仅允许正圆、正方形、等边三角形，禁止自由曲线

## 反模式禁令
- 禁用渐变、玻璃拟态、圆角与模糊阴影
- 禁用超过 3 种基本几何形与 3 种色相
- 禁用居中套娃式卡片堆叠；文字对比度不低于 4.5:1`,
  },
  {
    id: 'maximalism',
    nameZh: '极繁主义',
    nameEn: 'Maximalism',
    category: '艺术',
    tags: ['高饱和', '层叠', '高密度', '撞色'],
    summary: '高饱和撞色 + 多层装饰 + 高信息密度，用堆叠与对比制造视觉张力。',
    preview: {
      palette: {
        bg: 'hsl(48 70% 93%)',
        surface: 'hsl(300 40% 97%)',
        text: 'hsl(285 60% 12%)',
        textMuted: 'hsl(285 25% 32%)',
        accent: 'hsl(330 90% 52%)',
        accentText: 'hsl(0 0% 100%)',
        border: 'hsl(285 60% 20%)',
        shadowColor: 'hsl(190 90% 45%)',
      },
      headingFont: '"Bricolage Grotesque", sans-serif',
      bodyFont: '"IBM Plex Sans", sans-serif',
      radius: '14px',
      borderWidth: '3px',
      shadow: '8px 8px 0 hsl(190 90% 45%)',
      titleWeight: 700,
      titleLetterSpacing: '-0.02em',
      uppercaseTitle: false,
      buttonVariant: 'hard',
      cardVariant: 'flat',
      backgroundImage:
        'radial-gradient(circle at 12% 85%, hsl(45 95% 58%) 0 56px, transparent 56px), radial-gradient(circle at 92% 12%, hsl(190 90% 45%) 0 44px, transparent 44px), linear-gradient(135deg, hsl(48 70% 93%), hsl(330 85% 92%))',
    },
    prompt: `# 角色定位
你是精通 Maximalism（极繁主义）的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
反极简：更多颜色、更多层次、更多装饰。前提是「有秩序的繁」——所有元素必须落在明确的层级与网格上，禁止变成视觉噪音。繁是信息密度与装饰密度，不是混乱。

## 字体方案
- 标题：Bricolage Grotesque 700，字距 -0.02em，字号可直接拉到 64px 以上
- 正文：IBM Plex Sans 400 / 600，行高 1.6
- 允许一处手写体或变体字作为强调（限一个词），其余保持统一

## HSL 色板
- 背景 hsl(48 70% 93%)（暖白），面板 hsl(300 40% 97%)，冲击力靠高饱和色块与深描边制造，而非压暗底色
- 主色 hsl(330 90% 52%)，撞色辅助 hsl(190 90% 45%)、hsl(45 95% 58%)
- 允许 5～7 种色相同时出现，但主色占比必须最高
- 文字 hsl(285 60% 12%)，禁止低对比灰字

## 间距与圆角
- 圆角 14px 统一，禁止混用多种圆角
- 间距体系 8 / 16 / 24 / 32 / 56px，密度高于常规 30% 左右
- 装饰要素可溢出卡片边界，但不得遮挡文字

## 组件规则
- 卡片：亮底 + 3px 深描边 + 8px 8px 0 撞色硬阴影；卡片内可再嵌一层色块
- 按钮：硬阴影 + 撞色描边，hover 时阴影反向偏移制造「抖动」感
- 装饰：允许贴纸、星形、波浪线、色块角标，单屏不超过 6 处

## 反模式禁令
- 禁用大面积留白与单一灰阶配色（会退化成极简）
- 禁用无障碍纯装饰动画；动效只允许 hover / 入场各一次
- 禁用超过 3 层嵌套卡片；文字对比度不低于 4.5:1`,
  },
  {
    id: 'memphis',
    nameZh: '孟菲斯',
    nameEn: 'Memphis',
    category: '复古',
    tags: ['波普', '80s', '几何装饰', '撞色描边'],
    summary: '80 年代波普几何、波点锯齿与撞色描边，俏皮且高辨识度。',
    preview: {
      palette: {
        bg: 'hsl(50 90% 92%)',
        surface: 'hsl(0 0% 100%)',
        text: 'hsl(260 40% 14%)',
        textMuted: 'hsl(260 25% 34%)',
        accent: 'hsl(285 85% 58%)',
        accentText: 'hsl(0 0% 100%)',
        border: 'hsl(260 60% 16%)',
        shadowColor: 'hsl(195 95% 45%)',
      },
      headingFont: '"Righteous", sans-serif',
      bodyFont: '"Space Grotesk", sans-serif',
      radius: '16px',
      borderWidth: '3px',
      shadow: '6px 6px 0 hsl(195 95% 45%)',
      titleWeight: 400,
      titleLetterSpacing: '0.02em',
      uppercaseTitle: false,
      buttonVariant: 'hard',
      cardVariant: 'hard',
      backgroundImage:
        'repeating-linear-gradient(45deg, hsl(330 90% 62%) 0 10px, transparent 10px 22px), radial-gradient(circle at 90% 82%, hsl(45 95% 55%) 0 38px, transparent 38px)',
    },
    prompt: `# 角色定位
你是精通 Memphis Design（孟菲斯）风格的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
1981 年孟菲斯小组的反功能主义遗产：把波点、锯齿、波浪、几何碎片随意但刻意地拼在一起。关键词是「俏皮的混乱」——元素本身夸张，但每个形状都有清晰的描边，绝不糊在一起。

## 字体方案
- 标题：Righteous 400，字距 0.02em，字母圆润饱满
- 正文：Space Grotesk 400 / 500，行高 1.6
- 禁用衬线字体；禁用 12px 以下字号

## HSL 色板
- 背景 hsl(50 90% 92%)（浅黄），面板纯白
- 主色 hsl(285 85% 58%)（紫），配 hsl(330 90% 62%) 粉、hsl(195 95% 45%) 青、hsl(45 95% 55%) 黄
- 所有形状统一 3px 深描边 hsl(260 60% 16%)
- 单屏色相不超过 4 种，避免变成彩虹噪音

## 间距与圆角
- 圆角 16px，或胶囊 999px，二选一禁止混用
- 间距体系 8 / 16 / 24 / 32px
- 装饰图形允许 rotate(-6deg ~ 6deg) 倾斜，正文与按钮禁止倾斜

## 组件规则
- 卡片：白底 + 3px 描边 + 6px 6px 0 青色硬阴影，角落可挂一个波点或锯齿三角
- 按钮：胶囊或 16px 圆角 + 3px 描边 + 硬阴影，hover 上浮 2px
- 背景：允许波点、锯齿、波浪三种纹理之一，透明度不超过 25%

## 反模式禁令
- 禁用渐变、玻璃拟态、柔和模糊阴影
- 禁用暗黑系配色与极简留白布局
- 禁用超过 3 种纹理同屏；文字对比度不低于 4.5:1`,
  },
  {
    id: 'hand-drawn',
    nameZh: '手绘素描',
    nameEn: 'Hand-drawn',
    category: '艺术',
    tags: ['手写体', '纸感', '歪斜描边', '涂鸦'],
    summary: '手写字体 + 纸张肌理 + 歪斜描边，像笔记本上的草稿而非成品界面。',
    preview: {
      palette: {
        bg: 'hsl(40 35% 96%)',
        surface: 'hsl(0 0% 100%)',
        text: 'hsl(220 20% 16%)',
        textMuted: 'hsl(220 15% 36%)',
        accent: 'hsl(215 75% 45%)',
        accentText: 'hsl(0 0% 100%)',
        border: 'hsl(220 25% 25%)',
        shadowColor: 'hsl(220 25% 25%)',
      },
      headingFont: '"Caveat", cursive',
      bodyFont: '"Nunito", sans-serif',
      radius: '16px 6px 18px 8px',
      borderWidth: '2px',
      shadow: 'none',
      titleWeight: 600,
      titleLetterSpacing: '0',
      uppercaseTitle: false,
      buttonVariant: 'outline',
      cardVariant: 'sketch',
      backgroundImage:
        'repeating-linear-gradient(0deg, hsla(220 20% 30% / 0.07) 0 1px, transparent 1px 22px), repeating-linear-gradient(90deg, hsla(220 20% 30% / 0.05) 0 1px, transparent 1px 22px)',
    },
    prompt: `# 角色定位
你是精通 Hand-drawn / Sketch（手绘素描）风格的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
刻意保留「手作痕迹」：线条不笔直、圆角不对称、有纸纹与涂鸦。目标是让人看出这是有人画出来的，而不是机器生成的完美矩形。但可读性优先——正文必须清晰，只有容器与装饰允许粗糙。

## 字体方案
- 标题：Caveat 600（手写体），字号不小于 28px 保证识别度
- 正文：Nunito 400 / 600（圆润无衬线），行高 1.7，禁止正文用手写体
- 中文标题回退 Noto Serif SC，保证字形不塌

## HSL 色板
- 背景 hsl(40 35% 96%)（纸色），卡片纯白
- 钢笔主色 hsl(215 75% 45%)，仅用于链接、下划线与主按钮描边
- 铅笔辅助 hsla(220 25% 25% / 0.55) 用于注释性元素
- 文字 hsl(220 20% 16%)，禁止纯黑与低对比灰

## 间距与圆角
- 圆角使用不对称值（如 16px 6px 18px 8px），制造手绘感
- 间距体系 8 / 12 / 20 / 32px，允许 ±2px 的不规则偏移
- 描边统一 2px，允许轻微不规则（用不规则圆角模拟，禁止真实抖动动画）

## 组件规则
- 卡片：白底 + 2px 虚线描边 + 不规则圆角，允许 rotate(-0.6deg) 微倾斜
- 按钮：描边式，hover 时描边变实线并轻微放大 1.02
- 装饰：允许手绘箭头、圈注、下划波浪线，单屏不超过 5 处

## 反模式禁令
- 禁用渐变、玻璃拟态、强阴影与霓虹发光
- 禁止正文使用手写体、禁止整站歪斜超过 1deg
- 禁用对称完美的直角矩形；文字对比度不低于 4.5:1`,
  },
  {
    id: 'newsprint',
    nameZh: '报纸印刷',
    nameEn: 'Newsprint',
    category: '复古',
    tags: ['衬线大字', '多栏', '网点', '细分隔线'],
    summary: '衬线大标题 + 多栏排版 + 细分隔线，像一份排印讲究的纸质报刊。',
    preview: {
      palette: {
        bg: 'hsl(42 25% 94%)',
        surface: 'hsl(40 22% 97%)',
        text: 'hsl(0 0% 10%)',
        textMuted: 'hsl(0 0% 30%)',
        accent: 'hsl(0 70% 38%)',
        accentText: 'hsl(0 0% 100%)',
        border: 'hsl(0 0% 22%)',
        shadowColor: 'hsla(0 0% 0% / 0.15)',
      },
      headingFont: '"Playfair Display", serif',
      bodyFont: '"IBM Plex Sans", sans-serif',
      radius: '0px',
      borderWidth: '1px',
      shadow: 'none',
      titleWeight: 700,
      titleLetterSpacing: '-0.01em',
      uppercaseTitle: false,
      buttonVariant: 'outline',
      cardVariant: 'outline',
      backgroundImage:
        'repeating-linear-gradient(180deg, hsla(0 0% 20% / 0.05) 0 1px, transparent 1px 26px)',
    },
    prompt: `# 角色定位
你是精通 Newsprint / Editorial（报纸印刷）风格的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
以纸质报刊的排印逻辑组织界面：衬线大字标题 + 多栏正文 + 细分隔线 + 报头式导航。信息密度高但不拥挤，靠字号层级与栏宽节奏建立秩序。

## 字体方案
- 标题：Playfair Display 700（高对比衬线），字号 40px 起
- 正文：IBM Plex Sans 400，行高 1.7，栏宽控制在 60～75 字符
- 中文回退 Noto Serif SC；禁用圆体与手写体

## HSL 色板
- 背景 hsl(42 25% 94%)（纸色），面板 hsl(40 22% 97%)
- 主色 印刷红 hsl(0 70% 38%)，仅用于报头、栏目题与链接
- 文字 hsl(0 0% 10%)，次级 hsl(0 0% 30%)
- 禁用高饱和色与渐变；全站色彩不超过 3 支

## 间距与圆角
- 圆角 0px，全部直角
- 间距体系 8 / 16 / 24 / 40px，栏间距不小于 24px
- 分隔线统一 1px hsl(0 0% 22%)，禁止粗线与彩色线

## 组件规则
- 卡片：无阴影无圆角，靠 1px 上下分隔线与细边框区分层次
- 按钮：描边式直角，文字全大写 + 0.08em 字距，模仿报刊标签
- 版式：正文可两栏或三栏；标题可跨栏，首字下沉用于长文开篇

## 反模式禁令
- 禁用阴影、圆角、玻璃与渐变（纸张没有这些）
- 禁用超过 3 种字号跳级；禁用彩色分隔线
- 禁用暗色模式以外的反色块占大面积；文字对比度不低于 4.5:1`,
  },
  {
    id: 'aurora-mesh',
    nameZh: '极光渐变',
    nameEn: 'Aurora Mesh',
    category: '未来',
    tags: ['Mesh 渐变', '发光', '玻璃叠加', '柔光'],
    summary: '大面积极光 mesh 渐变底色，玻璃卡片轻叠其上，柔光弥漫。',
    preview: {
      palette: {
        bg: 'hsl(230 45% 8%)',
        surface: 'rgba(255, 255, 255, 0.08)',
        text: 'hsl(0 0% 100%)',
        textMuted: 'rgba(255, 255, 255, 0.72)',
        accent: 'hsl(160 90% 55%)',
        accentText: 'hsl(200 80% 8%)',
        border: 'rgba(255, 255, 255, 0.18)',
        shadowColor: 'hsla(160 90% 45% / 0.35)',
      },
      headingFont: '"Sora", sans-serif',
      bodyFont: '"Outfit", sans-serif',
      radius: '20px',
      borderWidth: '1px',
      shadow: '0 20px 60px hsla(160 90% 45% / 0.18)',
      titleWeight: 600,
      titleLetterSpacing: '-0.02em',
      uppercaseTitle: false,
      buttonVariant: 'gradient',
      cardVariant: 'glass',
      backgroundImage:
        'radial-gradient(at 20% 25%, hsla(275 85% 55% / 0.55) 0px, transparent 55%), radial-gradient(at 78% 18%, hsla(190 90% 55% / 0.50) 0px, transparent 50%), radial-gradient(at 65% 88%, hsla(320 85% 60% / 0.45) 0px, transparent 55%), linear-gradient(160deg, hsl(230 45% 8%), hsl(255 45% 12%))',
    },
    prompt: `# 角色定位
你是精通 Aurora / Mesh Gradient（极光渐变）风格的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
底色是一整片弥散的极光：3～4 个高饱和径向渐变在深色底上自然交融，边缘必须软到看不出边界。内容以半透明玻璃卡片轻叠其上，靠发光与模糊建立纵深，而非靠阴影。

## 字体方案
- 标题：Sora 600，字距 -0.02em，字号 36px 起
- 正文：Outfit 300 / 400，行高 1.7，浅色文字保证大字号
- 禁用衬线与等宽字体；字族不超过 2 个

## HSL 色板
- 底色 hsl(230 45% 8%)，渐变层 hsl(275 85% 55% / 0.55)、hsl(190 90% 55% / 0.50)、hsl(320 85% 60% / 0.45)
- 玻璃表面 rgba(255, 255, 255, 0.08)，描边 rgba(255, 255, 255, 0.18)
- 强调色 hsl(160 90% 55%)，仅用于主 CTA 与关键数字
- 文字纯白，次级不低于 70% 不透明度

## 间距与圆角
- 圆角 20～24px，卡片内边距不小于 28px
- 间距体系 8 / 16 / 32 / 48 / 80px，大区块间距不小于 80px
- 渐变层与内容之间至少保留 48px 呼吸区

## 组件规则
- 卡片：backdrop-filter: blur(20px)，1px 半透明描边，允许一层柔光外发光
- 按钮：渐变填充（强调色 → 辅助色，120°），hover 时亮度提升 6%
- 装饰光斑：允许 1～2 处 blur(80px) 的色斑，禁止可辨识形状

## 反模式禁令
- 禁用纯黑 #000 背景与硬阴影（会割裂极光的连续性）
- 禁用两种以上互斥渐变方向；禁用高对比描边
- 禁用三层以上玻璃嵌套；文字对比度不低于 4.5:1`,
  },
  {
    id: 'pixel-art',
    nameZh: '像素复古',
    nameEn: 'Pixel Art',
    category: '复古',
    tags: ['8-bit', '硬边', '像素字体', '深底'],
    summary: '像素字体 + 零圆角硬边 + 8-bit 配色，像从老主机屏幕上长出来。',
    preview: {
      palette: {
        bg: 'hsl(230 35% 12%)',
        surface: 'hsl(230 30% 20%)',
        text: 'hsl(60 20% 94%)',
        textMuted: 'hsl(60 12% 72%)',
        accent: 'hsl(90 75% 55%)',
        accentText: 'hsl(230 40% 8%)',
        border: 'hsl(230 30% 6%)',
        shadowColor: 'hsl(230 35% 5%)',
      },
      headingFont: '"Press Start 2P", monospace',
      bodyFont: '"IBM Plex Mono", monospace',
      radius: '0px',
      borderWidth: '3px',
      shadow: 'none',
      titleWeight: 400,
      titleLetterSpacing: '-0.02em',
      uppercaseTitle: true,
      buttonVariant: 'pixel',
      cardVariant: 'pixel',
      backgroundImage:
        'repeating-linear-gradient(45deg, hsla(0 0% 100% / 0.03) 0 6px, transparent 6px 12px), repeating-linear-gradient(-45deg, hsla(0 0% 100% / 0.03) 0 6px, transparent 6px 12px)',
    },
    prompt: `# 角色定位
你是精通 Pixel Art / 8-bit（像素复古）风格的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
一切对齐到像素网格：零圆角、零模糊、零渐变，边缘必须是硬边。层次靠 2～3px 硬偏移阴影与色块明度差建立，整体像 8-bit 主机界面。

## 字体方案
- 标题：Press Start 2P（像素字体），必须全大写，字号不小于 16px
- 正文：IBM Plex Mono 400，行高 1.6（像素风禁用比例字体）
- 中文回退 Noto Sans SC；禁用衬线、手写与圆体

## HSL 色板
- 深底 hsl(230 35% 12%)，面板 hsl(230 30% 20%)
- 主色 荧光绿 hsl(90 75% 55%)，危险色 hsl(0 80% 60%)，警告色 hsl(45 90% 58%)
- 描边与硬阴影统一用最深色 hsl(230 35% 5%)
- 单屏色相不超过 4 支，保持调色板受限感

## 间距与圆角
- 圆角 0px：任何圆角都破坏像素感
- 所有间距为 4px 的整数倍：4 / 8 / 12 / 16 / 24 / 32px
- 边框 3px 实线，禁止 1px（会被渲染成模糊的亚像素线）

## 组件规则
- 按钮：2px 描边 + 2px 2px 0 硬阴影，hover 时整体下移 2px 模拟按下
- 卡片：3px 描边 + 3px 3px 0 硬阴影，标题栏可用独立色条区分
- 图标：必须使用像素图标（禁止矢量描边图标），尺寸为 8 / 16 / 32 的整数倍

## 反模式禁令
- 禁用渐变、模糊、圆角、玻璃拟态与抗锯齿柔化
- 禁用比例字体与超过 2 级字号跳变
- 禁用 1px 边框与半透明色块；文字对比度不低于 4.5:1`,
  },
  {
    id: 'guochao',
    nameZh: '新中式国风',
    nameEn: 'Guochao / Neo-Chinese',
    category: '国风',
    tags: ['朱红', '宣纸', '留白', '印章'],
    summary: '宣纸底 + 朱红点缀 + 宋体贴字，用留白与印章营造东方气韵。',
    preview: {
      palette: {
        bg: 'hsl(38 30% 94%)',
        surface: 'hsl(40 35% 97%)',
        text: 'hsl(220 25% 16%)',
        textMuted: 'hsl(220 18% 34%)',
        accent: 'hsl(8 70% 45%)',
        accentText: 'hsl(40 35% 97%)',
        border: 'hsl(220 20% 24%)',
        shadowColor: 'hsla(220 25% 16% / 0.18)',
      },
      headingFont: '"Ma Shan Zheng", "Noto Serif SC", serif',
      bodyFont: '"Noto Sans SC", sans-serif',
      radius: '4px',
      borderWidth: '1px',
      shadow: '0 10px 30px hsla(220 25% 16% / 0.10)',
      titleWeight: 400,
      titleLetterSpacing: '0.04em',
      uppercaseTitle: false,
      buttonVariant: 'solid',
      cardVariant: 'flat',
      backgroundImage:
        'radial-gradient(circle at 85% 15%, hsla(8 70% 45% / 0.10) 0 90px, transparent 90px), repeating-linear-gradient(135deg, hsla(220 25% 16% / 0.03) 0 2px, transparent 2px 8px)',
    },
    prompt: `# 角色定位
你是精通新中式国风（Guochao）的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
以东方美学为骨：宣纸底色、墨色文字、朱红点睛，大量留白承担呼吸，细线框与印章承担秩序。忌堆砌传统纹样，一件界面只用一处「重音」（朱红），其余保持克制。

## 字体方案
- 标题：Ma Shan Zheng（毛笔）或 Noto Serif SC 600，字距 0.04em 起
- 正文：Noto Sans SC 400 / 500，行高 1.8（中文正文需更大行高）
- 禁止标题与正文同字体；毛笔体只用于短标题，长度不超过 8 字

## HSL 色板
- 背景 hsl(38 30% 94%)（宣纸），面板 hsl(40 35% 97%)
- 朱红 hsl(8 70% 45%)：仅用于印章、主 CTA 与一处强调，面积占比不超过 5%
- 墨色 hsl(220 25% 16%)，次级 hsl(220 18% 34%)
- 辅助可用黛青 hsl(200 25% 35%)、月白 hsl(40 20% 92%)；禁用高饱和霓虹色

## 间距与圆角
- 圆角 4px 统一，禁止大圆角与胶囊
- 间距体系 8 / 16 / 24 / 40 / 64px，留白面积不少于版面的 40%
- 细边框统一 1px，禁止粗描边

## 组件规则
- 卡片：宣纸底 + 1px 细边框或纯留白区隔，阴影极淡（不透明度 ≤ 0.12）
- 按钮：朱红实心 + 白字，或墨色细框描边；禁止胶囊按钮
- 装饰：允许竖排文字、印章方块、山水留白色块，单屏不超过 2 处

## 反模式禁令
- 禁用渐变色块、玻璃拟态、卡通插画与西式几何装饰
- 禁止朱红大面积铺底（会沦为「红配金」俗套）
- 禁用超过 2 种传统纹样同屏；文字对比度不低于 4.5:1`,
  },
  {
    id: 'data-dashboard',
    nameZh: '数据仪表盘',
    nameEn: 'Data Dashboard',
    category: '企业',
    tags: ['网格线', '等宽数字', '指标卡', '低饱和'],
    summary: '网格底纹 + 等宽数字 + 低饱和配色，为高密度数据与表格而生。',
    preview: {
      palette: {
        bg: 'hsl(210 25% 96%)',
        surface: 'hsl(0 0% 100%)',
        text: 'hsl(215 30% 14%)',
        textMuted: 'hsl(215 15% 38%)',
        accent: 'hsl(212 85% 48%)',
        accentText: 'hsl(0 0% 100%)',
        border: 'hsl(215 20% 88%)',
        shadowColor: 'hsla(215 25% 20% / 0.10)',
      },
      headingFont: '"Inter Tight", sans-serif',
      bodyFont: '"IBM Plex Sans", sans-serif',
      radius: '8px',
      borderWidth: '1px',
      shadow: '0 1px 3px hsla(215 25% 20% / 0.10)',
      titleWeight: 600,
      titleLetterSpacing: '-0.01em',
      uppercaseTitle: false,
      buttonVariant: 'solid',
      cardVariant: 'outline',
      backgroundImage:
        'repeating-linear-gradient(0deg, hsla(215 30% 40% / 0.07) 0 1px, transparent 1px 28px), repeating-linear-gradient(90deg, hsla(215 30% 40% / 0.07) 0 1px, transparent 1px 28px)',
    },
    prompt: `# 角色定位
你是精通 Data Dashboard（数据仪表盘）风格的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
为「被反复扫描的数字」设计：先保证一屏能装下多少有效信息，再谈美感。层级靠字号、字重与对齐建立，不靠颜色；颜色只为状态服务。所有数字必须可横向对比。

## 字体方案
- 标题：Inter Tight 600，字距 -0.01em
- 正文与标签：IBM Plex Sans 400 / 500，行高 1.5
- 数字：IBM Plex Mono 400 / 600，启用 tabular-nums 保证等宽对齐
- 禁用装饰性字体；全站字族不超过 2 个

## HSL 色板
- 背景 hsl(210 25% 96%)，卡片纯白
- 主色 hsl(212 85% 48%)，仅用于主操作与选中态
- 语义色：成功 hsl(150 60% 38%)、警告 hsl(35 85% 45%)、错误 hsl(0 70% 48%)，仅用于状态，禁止用于装饰
- 文字 hsl(215 30% 14%)，次级 hsl(215 15% 38%)，边框 hsl(215 20% 88%)

## 间距与圆角
- 圆角 8px，表格与图表容器 8px，禁止胶囊
- 表格行高固定 40px，单元格左右内边距 12px
- 间距体系 4 / 8 / 12 / 16 / 24 / 32px，卡片内边距 20～24px

## 组件规则
- 卡片：1px 浅边框 + 极淡投影，标题行右侧放时间范围切换
- 指标卡：标签 12px 次级色 + 数值 28px 等宽字体 + 环比标签（上下箭头 + 语义色）
- 图表：去除多余网格线，仅保留横向参考线；坐标轴文字 11～12px 次级色

## 反模式禁令
- 禁用高饱和撞色、渐变背景与玻璃拟态（干扰数据判读）
- 禁止用颜色表达非状态信息；禁止 3D 图表与阴影柱体
- 禁用小于 11px 的表格文字；文字对比度不低于 4.5:1`,
  },
  {
    id: 'fluent-2',
    nameZh: 'Fluent 2 企业级',
    nameEn: 'Fluent 2',
    category: '企业',
    tags: ['亚克力', '分层', '克制', '设计系统'],
    summary: '微软 Fluent 2 气质：亚克力材质 + 4/8px 圆角 + 强调色分层，克制耐用的企业级观感。',
    preview: {
      palette: {
        bg: 'hsl(210 20% 97%)',
        surface: 'rgba(255, 255, 255, 0.55)',
        text: 'hsl(215 25% 12%)',
        textMuted: 'hsl(215 12% 38%)',
        accent: 'hsl(205 90% 42%)',
        accentText: 'hsl(0 0% 100%)',
        border: 'hsla(215 20% 20% / 0.12)',
        shadowColor: 'hsla(215 30% 20% / 0.14)',
      },
      headingFont: '"Inter Tight", sans-serif',
      bodyFont: '"IBM Plex Sans", sans-serif',
      radius: '8px',
      borderWidth: '1px',
      shadow: '0 8px 20px hsla(215 30% 20% / 0.10)',
      titleWeight: 600,
      titleLetterSpacing: '-0.01em',
      uppercaseTitle: false,
      buttonVariant: 'solid',
      cardVariant: 'acrylic',
      backgroundImage:
        'radial-gradient(at 12% 0%, hsla(205 90% 60% / 0.22) 0px, transparent 45%), radial-gradient(at 88% 100%, hsla(275 80% 60% / 0.18) 0px, transparent 45%), linear-gradient(180deg, hsl(210 20% 97%), hsl(210 25% 94%))',
    },
    prompt: `# 角色定位
你是遵循 Fluent 2 规范的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
系统化、克制、耐看：一切遵循 4/8px 网格与固定圆角阶梯，层次靠「材质 + 阴影 + 强调色」三层递进表达。不为炫技，为长期使用的稳定性服务——同一套 token 在官网、后台、移动端表现一致。

## 字体方案
- 标题：Inter Tight 600，字距 -0.01em，字号阶梯 20 / 24 / 32 / 40px
- 正文：IBM Plex Sans 400，行高 1.5，最小字号 12px
- 数字使用 tabular-nums；全站字族不超过 2 个

## HSL 色板
- 背景 hsl(210 20% 97%)，亚克力表面 rgba(255, 255, 255, 0.55) + blur(30px)
- 品牌强调色 hsl(205 90% 42%)，hover 降低 8% 亮度，pressed 降低 12%
- 文字 hsl(215 25% 12%)，次级 hsl(215 12% 38%)，描边 hsla(215 20% 20% / 0.12)
- 语义色沿用 Fluent 约定：成功绿、警告黄、错误红，仅用于状态

## 间距与圆角
- 圆角阶梯固定为 4px（小控件）/ 8px（卡片）/ 12px（对话框），禁止自创值
- 间距体系 4 / 8 / 12 / 16 / 24 / 32px，容器最大宽度 1280px
- 阴影阶梯浅/中/深三档，不透明度不超过 0.20

## 组件规则
- 卡片：亚克力材质（半透明白 + backdrop-blur），1px 淡描边 + 浅阴影
- 按钮：实心强调色（主）/ 描边（次），圆角 4px，hover 只改变填充，不做位移
- 交互反馈：聚焦态用 2px 强调色外环；禁用态整体不透明度 40%

## 反模式禁令
- 禁用硬阴影、厚描边、撞色与超大字号（破坏系统一致性）
- 禁止自创圆角与阴影值，必须从上述阶梯中取值
- 禁用只有颜色区分状态的设计（需配图标或文案）；对比度不低于 4.5:1`,
  },
  {
    id: 'claymorphism',
    nameZh: '黏土拟态',
    nameEn: 'Claymorphism',
    category: '柔和',
    tags: ['黏土', '柔影', '胶囊', '体积感'],
    summary: '大圆角与三层柔影捏出塑料黏土的厚度，层级靠体积而非描边。',
    preview: {
      palette: {
        bg: 'hsl(30 40% 96%)',
        surface: 'hsl(26 55% 90%)',
        text: 'hsl(20 25% 16%)',
        textMuted: 'hsl(20 14% 32%)',
        accent: 'hsl(12 82% 56%)',
        accentText: 'hsl(0 0% 100%)',
        border: 'hsl(26 40% 84%)',
        shadowColor: 'hsl(20 30% 62% / 0.55)',
      },
      headingFont: '"Fredoka", sans-serif',
      bodyFont: '"Nunito", sans-serif',
      radius: '26px',
      borderWidth: '1px',
      shadow:
        '0 12px 22px hsl(20 30% 62% / 0.42), inset 0 -5px 10px hsl(20 35% 72% / 0.55), inset 0 5px 10px hsl(0 0% 100% / 0.9)',
      titleWeight: 700,
      titleLetterSpacing: '-0.02em',
      uppercaseTitle: false,
      buttonVariant: 'clay',
      cardVariant: 'clay',
    },
    prompt: `# 角色定位
你是精通 Claymorphism（黏土拟态）的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
把界面做成「捏出来的橡皮泥」：大圆角、饱满体积、双层柔影（外投影 + 内高光），每个元素都像有厚度的实体。层级靠体积而非描边表达；比新拟态更饱和、更童趣，但同一屏只允许一个视觉主角。

## 字体方案
- 标题：Fredoka 700，字距 -0.02em，字号阶梯 20 / 28 / 40px
- 正文：Nunito 400 / 700，行高 1.65，最小字号 13px
- 全站字族不超过 2 个；禁用 300 以下细体（笔画会被体积感吞掉）

## HSL 色板
- 页面背景 hsl(30 40% 96%)（米白），表面 hsl(26 55% 90%)（黏土体）
- 主色 hsl(12 82% 56%)（陶土珊瑚），仅用于主按钮、徽章与选中态
- 辅助色 hsl(174 55% 42%)（薄荷）做次级标记，面积不超过主色的三分之一
- 文字 hsl(20 25% 16%)，次级 hsl(20 14% 32%)；禁用纯黑与 55% 以下灰字

## 间距与圆角
- 圆角 20～28px：卡片 26px、按钮 999px（胶囊）、输入框 18px
- 间距体系 6 / 12 / 20 / 32 / 48px，卡片内边距不小于 20px
- 阴影三段叠加：外投影 8px 10px 18px、底部内阴影、顶部白色高光；模糊值不得为 0

## 组件规则
- 卡片：无描边，靠三段阴影塑形；hover 上浮 2px、外投影扩散 4px
- 按钮：胶囊形 + 内高光 + 底部内阴影；按下位移 2px 并收窄内阴影
- 图标与插画统一 2px 圆头描边，端点全圆角，禁用任何尖角

## 反模式禁令
- 禁用硬阴影、1px 细描边、玻璃模糊与金属质感（破坏体积一致性）
- 禁止把柔影用在大面积背景上：每屏最多两个投影层
- 禁用纯黑文字与冷灰阶，中性色必须带暖调；对比度不低于 4.5:1`,
  },
  {
    id: 'frutiger-aero',
    nameZh: '水果航空',
    nameEn: 'Frutiger Aero',
    category: '复古',
    tags: ['亮面高光', '玻璃气泡', '自然渐变', '千禧科技'],
    summary: '玻璃高光与自然渐变叠出的 2000 年代科技乐观主义，亮面塑料质感。',
    preview: {
      palette: {
        bg: 'hsl(196 70% 88%)',
        surface: 'hsl(0 0% 100%)',
        text: 'hsl(200 60% 18%)',
        textMuted: 'hsl(200 22% 36%)',
        accent: 'hsl(192 90% 34%)',
        accentText: 'hsl(0 0% 100%)',
        border: 'hsl(190 55% 76%)',
        shadowColor: 'hsl(195 50% 55% / 0.35)',
      },
      headingFont: '"Comfortaa", sans-serif',
      bodyFont: '"Nunito", sans-serif',
      radius: '18px',
      borderWidth: '1px',
      shadow: '0 10px 18px hsl(195 50% 55% / 0.35), inset 0 1px 0 hsl(0 0% 100% / 0.95)',
      titleWeight: 600,
      titleLetterSpacing: '0.01em',
      uppercaseTitle: false,
      buttonVariant: 'gradient',
      cardVariant: 'flat',
      backgroundImage:
        'radial-gradient(circle at 20% 2%, hsl(0 0% 100% / 0.95), transparent 40%), radial-gradient(circle at 86% 86%, hsl(88 70% 72% / 0.42), transparent 56%), linear-gradient(160deg, hsl(196 85% 93%), hsl(190 75% 86%) 48%, hsl(140 45% 86%))',
    },
    prompt: `# 角色定位
你是精通 Frutiger Aero（水果航空，2004—2009 科技乐观主义）的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
玻璃、水、草与阳光：高光塑料表面 + 透明气泡 + 自然渐变背景，是 Windows Vista 与初代 iPhone 那套「科技让世界变好」的视觉承诺。关键不是复古，而是让高光服从材质物理——亮面来自倒角与反射，而不是贴一层渐变膜。

## 字体方案
- 标题：Comfortaa 600，圆润几何，字距 0.01em，字号阶梯 20 / 26 / 36px
- 正文：Nunito 400 / 700，行高 1.7，最小字号 12px
- 英文标签用 Nunito 800 全大写、字距 0.12em；全站不超过 2 个字体族

## HSL 色板
- 背景 hsl(196 70% 88%)（天光蓝），叠加 160 度渐变至 hsl(140 45% 86%)（草绿）
- 表面 hsl(0 0% 100%)，永远配 1px 亮边 hsl(190 55% 76%) 与顶部白高光
- 主色 hsl(192 90% 34%)（水青），用于主按钮与链接；文字 hsl(200 60% 18%)
- 辅助 hsl(88 70% 55%)（新叶绿）只做点缀，面积不超过 10%

## 间距与圆角
- 圆角 14～20px，按钮 999px 胶囊，图标容器 50% 圆形
- 间距体系 8 / 16 / 24 / 40px，卡片内边距 20px
- 每个亮面元素必须有顶部 1px 白高光 + 底部 2px 暗边，模拟塑料倒角

## 组件规则
- 卡片：白底 + 顶部内高光 + 柔和青灰投影，投影扩散不小于 18px
- 按钮：上亮下暗的双色渐变 + 内高光；hover 只提升亮度 4%，不做位移
- 徽章与图标做成玻璃气泡：径向高光 + 90% 不透明填充，禁用纯平面色块

## 反模式禁令
- 禁用暗色背景、锐利直角与无高光的纯色平面（失去 2000 年代质感）
- 禁用赛博霓虹、故障艺术与冷金属灰（与乐观基调冲突）
- 禁止高饱和纯色铺底，背景必须是自然向渐变；正文对比度不低于 4.5:1`,
  },
  {
    id: 'liquid-glass',
    nameZh: '液态玻璃',
    nameEn: 'Liquid Glass',
    category: '未来',
    tags: ['折射', '镜面高光', '浮层控件', 'Apple'],
    summary: '低模糊透镜材质：边缘折射与镜面高光浮在内容之上，玻璃只做控件。',
    preview: {
      palette: {
        bg: 'hsl(220 30% 96%)',
        surface: 'rgba(255, 255, 255, 0.62)',
        text: 'hsl(220 20% 12%)',
        textMuted: 'hsl(220 12% 34%)',
        accent: 'hsl(211 100% 50%)',
        accentText: 'hsl(0 0% 100%)',
        border: 'rgba(255, 255, 255, 0.90)',
        shadowColor: 'hsl(220 30% 25% / 0.16)',
      },
      headingFont: '"Inter Tight", sans-serif',
      bodyFont: '"Inter Tight", sans-serif',
      radius: '22px',
      borderWidth: '1px',
      shadow: '0 12px 30px hsl(220 30% 25% / 0.16), inset 0 1px 0 hsl(0 0% 100% / 0.95)',
      titleWeight: 600,
      titleLetterSpacing: '-0.015em',
      uppercaseTitle: false,
      buttonVariant: 'liquid',
      cardVariant: 'liquid',
      backgroundImage:
        'radial-gradient(circle at 18% 12%, hsl(205 90% 72% / 0.55), transparent 55%), radial-gradient(circle at 82% 24%, hsl(330 80% 78% / 0.45), transparent 55%), radial-gradient(circle at 60% 92%, hsl(160 60% 72% / 0.45), transparent 60%)',
    },
    prompt: `# 角色定位
你是精通 Liquid Glass（Apple 2025 液态玻璃）的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
玻璃不是磨砂，而是透镜：低模糊（2px）让背后内容清晰可见，靠边缘折射与镜面高光说明「这里有一层玻璃」。控件浮在内容之上，形态随交互流动变形。玻璃只承担导航与控件的材质，内容层永远实心。

## 字体方案
- 标题：Inter Tight 600，字距 -0.015em，字号阶梯 20 / 28 / 34px
- 正文：Inter Tight 400，行高 1.5；数字启用 tabular-nums
- 全站只用 1 个字体族，靠字重 400 / 600 与字号差建立层级

## HSL 色板
- 背景 hsl(220 30% 96%)（系统浅灰），背后铺 2～3 团柔和色斑供折射
- 玻璃表面 rgba(255, 255, 255, 0.62)，边缘 rgba(255, 255, 255, 0.90) 的 1px 亮边
- 主色 hsl(211 100% 50%)（系统蓝），仅用于主操作；文字 hsl(220 20% 12%)
- 次级文字 hsl(220 12% 34%)；禁止白玻璃叠白底而不加色斑（界面会失去边界）

## 间距与圆角
- 圆角连续：按钮 999px、卡片 22px、弹层 28px，同一视图只用两档
- 间距体系 6 / 12 / 20 / 28px，控件最小点击区 44×44px
- 深度只允许两层：内容层 + 控制层；禁止玻璃叠玻璃

## 组件规则
- 卡片：半透明白 + blur(2px) saturate(140%) + 顶部 1px 白内高光 + 极轻投影
- 按钮：主操作实心系统蓝 + 上缘镜面高光；次操作玻璃胶囊，文字用主文字色
- 状态切换 220ms 弹簧曲线；按下亮度提升 6%，不做缩放跳变

## 反模式禁令
- 禁用强模糊磨砂（超过 8px 即退化为玻璃拟态）、彩色渐变边框与重投影
- 禁止玻璃面板直接压在视频或高对比图之上而不加遮罩（对比度会跌破 4.5:1）
- 禁用纯黑文字与 12px 以下字号；必须响应 prefers-reduced-transparency`,
  },
  {
    id: 'solarpunk',
    nameZh: '太阳朋克',
    nameEn: 'Solarpunk',
    category: '未来',
    tags: ['生态', '有机曲线', '暖绿', '日光金'],
    summary: '温室式的乐观未来：苔绿与日光金、有机曲线，拒绝直角的生态科技。',
    preview: {
      palette: {
        bg: 'hsl(45 55% 93%)',
        surface: 'hsl(42 35% 97%)',
        text: 'hsl(150 30% 14%)',
        textMuted: 'hsl(150 12% 30%)',
        accent: 'hsl(140 45% 30%)',
        accentText: 'hsl(45 50% 96%)',
        border: 'hsl(140 20% 78%)',
        shadowColor: 'hsl(150 25% 45% / 0.18)',
      },
      headingFont: '"Fraunces", serif',
      bodyFont: '"Nunito", sans-serif',
      radius: '22px',
      borderWidth: '1px',
      shadow: '0 10px 24px hsl(150 25% 45% / 0.18)',
      titleWeight: 600,
      titleLetterSpacing: '0',
      uppercaseTitle: false,
      buttonVariant: 'solid',
      cardVariant: 'flat',
      backgroundImage:
        'radial-gradient(circle at 88% 6%, hsl(36 85% 55% / 0.30), transparent 52%), linear-gradient(165deg, hsl(45 60% 95%), hsl(95 38% 91%) 62%, hsl(150 30% 90%))',
    },
    prompt: `# 角色定位
你是精通 Solarpunk（太阳朋克）的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
赛博朋克的反面：不是霓虹废土，而是爬满藤蔓的太阳能温室。技术可见、可修、与人共居。视觉靠三件事成立——暖色底、叶绿与日光金的双主色、以及拒绝直角的有机曲线。

## 字体方案
- 标题：Fraunces 600，软衬线带手工笔意，字号阶梯 22 / 30 / 42px
- 正文：Nunito 400，行高 1.75，最小字号 13px
- 标签用 Fraunces 400 小型大写、字距 0.08em；全站不超过 2 个字体族

## HSL 色板
- 背景 hsl(45 55% 93%)（日光米），表面 hsl(42 35% 97%)（骨白）
- 主色 hsl(140 45% 30%)（深苔绿），用于主按钮、标题强调与数据主线
- 辅色 hsl(36 85% 48%)（太阳金），只做细线、图标与高亮，面积不超过 8%
- 文字 hsl(150 30% 14%)，次级 hsl(150 12% 30%)；禁用纯黑与冷灰

## 间距与圆角
- 圆角不对称：卡片 22px 6px 22px 6px、按钮 999px，形成藤蔓式节奏
- 间距体系 8 / 16 / 28 / 44px，卡片内边距 24px，区块留白必须大于间距
- 分隔线 1px hsl(140 20% 84%)；投影极浅，扩散 24px、不透明度 0.16

## 组件规则
- 卡片：骨白底 + 一角收成 6px + 顶部 48px 宽日光金细条（不通栏）
- 按钮：深苔绿实心胶囊 + 骨白文字；次级按钮透明底 + 1px 苔绿描边
- 图表与进度用叶绿到日光金的暖向渐变，禁止冷蓝与紫

## 反模式禁令
- 禁用暗色主题、霓虹发光、尖锐直角与工业冷灰（与乐观生态冲突）
- 禁止赛博朋克元素：故障、扫描线、雨夜、废墟
- 禁用大面积纯绿色块铺底；文字对比度不低于 4.5:1`,
  },
  {
    id: 'risograph',
    nameZh: '孔版印刷',
    nameEn: 'Risograph',
    category: '艺术',
    tags: ['专色', '套印错位', '网点', '纸感'],
    summary: '双荧光专色、2～3px 套印错位与可见网点，复刻限量小册子的手作感。',
    preview: {
      palette: {
        bg: 'hsl(43 47% 91%)',
        surface: 'hsl(43 50% 97%)',
        text: 'hsl(230 45% 16%)',
        textMuted: 'hsl(230 18% 30%)',
        accent: 'hsl(335 80% 55%)',
        accentText: 'hsl(43 50% 97%)',
        border: 'hsl(230 45% 18%)',
        shadowColor: 'hsl(225 70% 42% / 0.90)',
      },
      headingFont: '"Space Grotesk", sans-serif',
      bodyFont: '"IBM Plex Mono", monospace',
      radius: '2px',
      borderWidth: '2px',
      shadow: '3px 3px 0 hsl(225 70% 42% / 0.90)',
      titleWeight: 700,
      titleLetterSpacing: '0.02em',
      uppercaseTitle: true,
      buttonVariant: 'riso',
      cardVariant: 'riso',
    },
    prompt: `# 角色定位
你是精通 Risograph（孔版印刷）视觉语言的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
两种荧光专色、一次一色、故意套印不准。孔版印刷的魅力来自工艺缺陷：错位 2～3px 的双层轮廓、可见网点、纸张纤维。数字端要复刻的是「限量 200 份的小册子」的手作感，而不是印刷精度。

## 字体方案
- 标题：Space Grotesk 700，全大写，字距 0.02em，字号阶梯 22 / 30 / 44px
- 正文：IBM Plex Mono 400，行高 1.6，字号 12～14px
- 标签、日期与页码一律等宽大写；全站不超过 2 个字体族

## HSL 色板
- 背景 hsl(43 47% 91%)（未涂布米黄纸），表面 hsl(43 50% 97%)
- 专色一 hsl(335 80% 55%)（荧光粉），专色二 hsl(225 70% 42%)（印刷蓝）
- 两色重叠处用 multiply 混合出紫，禁止引入第三种墨
- 文字 hsl(230 45% 16%)（偏蓝墨黑），次级 hsl(230 18% 30%)

## 间距与圆角
- 圆角 0～2px，禁止任何圆角装饰；按钮与卡片一律直角
- 间距体系 8 / 16 / 24 / 32px，边距宁紧勿松，保持印刷版面的密度
- 边框 2px 实线；硬阴影偏移 3～4px，模糊值必须为 0

## 组件规则
- 卡片：纸色底 + 2px 墨线 + 3px 3px 0 蓝色错位影，模拟第二色版
- 按钮：荧光粉色块 + 纸色文字 + 无描边 + 右下蓝色错位影，hover 位移 1px
- 图片与色块统一叠 6% 网点噪点；明暗一律用网点表达，禁止平滑渐变

## 反模式禁令
- 禁用渐变、发光、玻璃模糊与 3px 以上圆角
- 禁止第三种专色、四色照片与精细线条（套印会糊成一团）
- 禁用纯白背景与纯黑文字；正文对比度不低于 4.5:1`,
  },
  {
    id: 'blueprint',
    nameZh: '工程蓝图',
    nameEn: 'Blueprint',
    category: '工业',
    tags: ['晒图蓝', '网格', '标注引线', '等宽'],
    summary: '晒图纸式的技术制图：深蓝底、白色测量线与标注引线，零圆角零投影。',
    preview: {
      palette: {
        bg: 'hsl(212 65% 22%)',
        surface: 'rgba(255, 255, 255, 0.06)',
        text: 'hsl(200 40% 97%)',
        textMuted: 'hsl(200 30% 82%)',
        accent: 'hsl(48 100% 62%)',
        accentText: 'hsl(212 65% 18%)',
        border: 'rgba(200, 220, 255, 0.55)',
        shadowColor: 'hsl(200 60% 70% / 0.30)',
      },
      headingFont: '"IBM Plex Mono", monospace',
      bodyFont: '"IBM Plex Sans", sans-serif',
      radius: '0px',
      borderWidth: '1px',
      shadow: 'none',
      titleWeight: 600,
      titleLetterSpacing: '0.08em',
      uppercaseTitle: true,
      buttonVariant: 'outline',
      cardVariant: 'outline',
      backgroundImage:
        'repeating-linear-gradient(0deg, hsl(200 60% 80% / 0.10) 0 1px, transparent 1px 24px), repeating-linear-gradient(90deg, hsl(200 60% 80% / 0.10) 0 1px, transparent 1px 24px)',
    },
    prompt: `# 角色定位
你是精通工程蓝图（Blueprint / 技术制图）的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
把界面当成一张晒图纸：深蓝底、白色细线、坐标网格与标注引线。信息不是被「设计」出来的，而是被「测量」出来的——每个模块都有编号、尺寸与公差。禁用一切装饰性阴影与圆角。

## 字体方案
- 标题：IBM Plex Mono 600，全大写，字距 0.08em，字号阶梯 18 / 24 / 34px
- 正文：IBM Plex Sans 400，行高 1.6，最小字号 12px
- 编号、单位、比例尺一律等宽；数值列右对齐并启用 tabular-nums

## HSL 色板
- 背景 hsl(212 65% 22%)（晒图蓝），网格线 hsl(200 60% 80% / 0.10)
- 表面 rgba(255, 255, 255, 0.06)，描边 rgba(200, 220, 255, 0.55)
- 主色 hsl(48 100% 62%)（标注黄），只用于关键尺寸与 CTA
- 文字 hsl(200 40% 97%)，次级 hsl(200 30% 82%)；禁用纯白与纯黑

## 间距与圆角
- 圆角 0px，全部直角；边框 1px 实线，分区可用 1px 虚线
- 间距对齐 8px 网格；背景每 24px 一条细线，每 120px 一条加粗线
- 无投影；层次只靠线宽（1px / 2px）与透明度区分

## 组件规则
- 卡片：透明底 + 1px 半透明描边 + 左上角编号（MONO 10px，如 FIG.03）
- 按钮：透明底 + 1px 标注黄描边 + 黄色文字；hover 反转为黄底深蓝字
- 图表用白色 1px 线与黄色数据点，标注必须带引线与端点圆点

## 反模式禁令
- 禁用圆角、渐变、投影、玻璃材质与彩色插画
- 禁止装饰性图标与 emoji；图形只允许测量线、标注与网格
- 禁用低对比灰蓝小字；正文对比度不低于 4.5:1`,
  },
  {
    id: 'corporate-memphis',
    nameZh: '企业扁平插画',
    nameEn: 'Corporate Memphis',
    category: '企业',
    tags: ['扁平插画', '几何斑块', '无五官人物', '大留白'],
    summary: '科技公司通用语言：纯平色块与无五官人物，靠留白与色彩比例取胜。',
    preview: {
      palette: {
        bg: 'hsl(210 40% 96%)',
        surface: 'hsl(0 0% 100%)',
        text: 'hsl(222 25% 18%)',
        textMuted: 'hsl(222 14% 34%)',
        accent: 'hsl(232 68% 52%)',
        accentText: 'hsl(0 0% 100%)',
        border: 'hsl(210 25% 88%)',
        shadowColor: 'hsl(222 25% 40% / 0.12)',
      },
      headingFont: '"Jost", sans-serif',
      bodyFont: '"Nunito", sans-serif',
      radius: '10px',
      borderWidth: '1px',
      shadow: '0 6px 16px hsl(222 25% 40% / 0.12)',
      titleWeight: 600,
      titleLetterSpacing: '-0.01em',
      uppercaseTitle: false,
      buttonVariant: 'solid',
      cardVariant: 'flat',
    },
    prompt: `# 角色定位
你是精通 Corporate Memphis（企业扁平插画 / Alegria）风格的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
2017 年后科技公司的通用语言：无五官的拉长四肢人物、纯平色块、几何斑块与大量留白。它安全、友善、可无限延展，代价是个性稀薄——所以必须在色彩比例与排版上做出自己的取舍，而不是照搬紫色小人。

## 字体方案
- 标题：Jost 600，几何无衬线，字距 -0.01em，字号阶梯 20 / 26 / 36px
- 正文：Nunito 400，行高 1.7，最小字号 13px
- 按钮与标签用 Jost 600、字距 0.02em，句首大写而非全大写

## HSL 色板
- 背景 hsl(210 40% 96%)（雾白蓝），表面 hsl(0 0% 100%)
- 主色 hsl(232 68% 52%)（企业蓝），只用于主按钮与链接
- 辅助 hsl(12 85% 62%)（珊瑚）与 hsl(168 55% 45%)（青绿）仅做插画与斑块
- 文字 hsl(222 25% 18%)，次级 hsl(222 14% 34%)；禁用纯黑

## 间距与圆角
- 圆角 10px 统一（按钮、卡片、输入框同值）；插画形状可用 50% 圆与 blob
- 间距体系 8 / 16 / 24 / 40 / 64px，区块留白不少于 40px
- 投影只用一档：0 6px 16px、不透明度 0.12，禁止多层叠加

## 组件规则
- 卡片：白底 + 10px 圆角 + 单档柔影，无描边；hover 上浮 2px
- 按钮：企业蓝实心 + 白字；次按钮白底 + 1px hsl(210 25% 88%) 描边
- 插画：纯平色块、无描边、无渐变、人物不画五官；单屏插画面积不超过 35%

## 反模式禁令
- 禁用手绘纹理、颗粒、玻璃与金属质感（必须保持纯平）
- 禁止紫色渐变与「三个人站一排」的模板构图
- 禁用低于 4.5:1 的浅灰文字；插画不得挤占正文对比度`,
  },
  {
    id: 'm3-expressive',
    nameZh: '表现性 Material',
    nameEn: 'Material 3 Expressive',
    category: '现代',
    tags: ['色调面', '圆角区间', '弹簧动效', '表现性字阶'],
    summary: 'Material 把音量调大：圆角成区间、字号承层级、大块色调面与弹簧动效。',
    preview: {
      palette: {
        bg: 'hsl(250 25% 97%)',
        surface: 'hsl(258 40% 92%)',
        text: 'hsl(255 30% 14%)',
        textMuted: 'hsl(255 14% 30%)',
        accent: 'hsl(258 58% 44%)',
        accentText: 'hsl(0 0% 100%)',
        border: 'hsl(258 25% 84%)',
        shadowColor: 'hsl(258 30% 40% / 0.14)',
      },
      headingFont: '"Rubik", sans-serif',
      bodyFont: '"Rubik", sans-serif',
      radius: '24px',
      borderWidth: '1px',
      shadow: '0 4px 12px hsl(258 30% 40% / 0.14)',
      titleWeight: 700,
      titleLetterSpacing: '-0.01em',
      uppercaseTitle: false,
      buttonVariant: 'solid',
      cardVariant: 'flat',
    },
    prompt: `# 角色定位
你是精通 Material 3 Expressive（2025 表现性设计语言）的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
Material 把音量调大：形状不再只有一个圆角值，而是一个区间；字号承担原本由分隔线与标签分担的层级；颜色以大块色调面出现，而不是中性底上的小点缀；动效改为弹簧而非固定时长曲线。

## 字体方案
- 标题：Rubik 700，字距 -0.01em，字号阶梯 22 / 30 / 40px（重点区再加 4px）
- 正文：Rubik 400，行高 1.55，最小字号 12px
- 标签用 Rubik 500、字距 0.04em；数字启用 tabular-nums

## HSL 色板
- 背景 hsl(250 25% 97%)（色调面最浅档），容器 hsl(258 40% 92%)
- 主色 hsl(258 58% 44%)（主色深档），其上文字用 hsl(0 0% 100%)
- 次色 hsl(190 45% 38%)、第三色 hsl(20 60% 45%) 仅用于分区与强调
- 文字 hsl(255 30% 14%)，次级 hsl(255 14% 30%)；不使用纯黑

## 间距与圆角
- 圆角是区间而非单值：小控件 12px、卡片 24px、大容器 32px、按钮 999px
- 同一视图至少出现两档圆角形成形状对比，禁止全站一个半径
- 间距 4 / 8 / 12 / 16 / 24 / 32px；触摸目标不小于 48×48px

## 组件规则
- 卡片：色调容器底 + 24px 圆角、无描边；重点卡片提升一档色调
- 按钮：主按钮实心胶囊、次按钮色调容器胶囊、第三按钮纯文字
- 状态变化优先改变形状与高度：弹簧 260ms，stiffness 380 / damping 32

## 反模式禁令
- 禁用统一圆角、靠灰色描边分隔线堆叠与四平八稳的等宽三栏
- 禁止紫蓝渐变、玻璃模糊与硬阴影（与色调面体系冲突）
- 禁用小于 12px 的正文；必须响应 prefers-reduced-motion 与用户放大字号`,
  },
  {
    id: 'cassette-futurism',
    nameZh: '磁带未来主义',
    nameEn: 'Cassette Futurism',
    category: '工业',
    tags: ['米色塑料', '琥珀荧光', '丝印标签', '内倒角'],
    summary: '米色塑料机箱与琥珀读数：可拆可修的笨重实体，靠内倒角做层次。',
    preview: {
      palette: {
        bg: 'hsl(38 30% 84%)',
        surface: 'hsl(40 35% 90%)',
        text: 'hsl(30 20% 14%)',
        textMuted: 'hsl(30 12% 32%)',
        accent: 'hsl(35 92% 48%)',
        accentText: 'hsl(30 30% 10%)',
        border: 'hsl(35 18% 62%)',
        shadowColor: 'hsl(32 22% 30%)',
      },
      headingFont: '"Chakra Petch", sans-serif',
      bodyFont: '"IBM Plex Sans", sans-serif',
      radius: '6px',
      borderWidth: '1px',
      shadow:
        'inset 0 2px 0 hsl(0 0% 100% / 0.70), inset 0 -3px 0 hsl(35 15% 55% / 0.50), 0 8px 18px hsl(35 20% 40% / 0.25)',
      titleWeight: 600,
      titleLetterSpacing: '0.06em',
      uppercaseTitle: false,
      buttonVariant: 'hard',
      cardVariant: 'flat',
    },
    prompt: `# 角色定位
你是精通 Cassette Futurism（磁带未来主义）的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
1970—1980 年代人们对未来的想象：米色塑料机箱、琥珀色荧光字符、丝印标签、螺丝与散热格栅。技术是笨重、可拆、可维修的实体。关键在「塑料的老化质感」，而不是叠一层复古滤镜。

## 字体方案
- 标题：Chakra Petch 600，工业方角，字距 0.06em，字号阶梯 18 / 24 / 32px
- 正文：IBM Plex Sans 400，行高 1.6，最小字号 12px
- 面板标签：IBM Plex Mono 500，全大写、字距 0.14em、字号 10px

## HSL 色板
- 背景 hsl(38 30% 84%)（旧米色机箱），表面 hsl(40 35% 90%)（面板浅一档）
- 主色 hsl(35 92% 48%)（琥珀荧光），用于主按钮与读数；其文字 hsl(30 30% 10%)
- 辅助 hsl(150 30% 35%)（指示灯绿）只做状态点，面积小于 3%
- 文字 hsl(30 20% 14%)，次级 hsl(30 12% 32%)；禁用纯黑与纯白

## 间距与圆角
- 圆角 4～8px（注塑件倒角）：按钮 6px、面板 8px
- 间距 6 / 12 / 18 / 24 / 36px；面板内边距 16px，标签与内容间距 4px
- 层次靠 1px 暗边与顶部 1px 高光的内倒角；外投影极克制

## 组件规则
- 卡片：米色面板 + 内倒角（上亮下暗）+ 左上角 10px 等宽丝印标签
- 按钮：琥珀实心 + 深褐文字 + 1px 暗边；按下内凹 1px 并降低亮度 6%
- 读数区用琥珀字符配 hsl(30 20% 12%) 底，模拟段码屏；禁止发光外溢

## 反模式禁令
- 禁用玻璃、镜面金属、霓虹紫与故障效果（那是 cyberpunk 的语汇）
- 禁止纯白背景、0px 锐角与气泡感大圆角
- 禁用彩色渐变；层次必须由倒角高光表达，正文对比度不低于 4.5:1`,
  },
  {
    id: 'dark-academia',
    nameZh: '学院暗调',
    nameEn: 'Dark Academia',
    category: '复古',
    tags: ['深棕', '羊皮纸', '衬线', '书斋'],
    summary: '深胡桃木与羊皮纸的深夜书斋：酒红书脊、黄铜细线与索引式编排。',
    preview: {
      palette: {
        bg: 'hsl(28 18% 12%)',
        surface: 'hsl(30 20% 18%)',
        text: 'hsl(42 30% 90%)',
        textMuted: 'hsl(40 12% 72%)',
        accent: 'hsl(355 45% 38%)',
        accentText: 'hsl(40 35% 94%)',
        border: 'hsl(35 18% 30%)',
        shadowColor: 'hsl(28 25% 6% / 0.50)',
      },
      headingFont: '"Playfair Display", serif',
      bodyFont: '"Noto Serif SC", serif',
      radius: '2px',
      borderWidth: '1px',
      shadow: '0 8px 22px hsl(28 25% 6% / 0.45)',
      titleWeight: 600,
      titleLetterSpacing: '0.02em',
      uppercaseTitle: false,
      buttonVariant: 'solid',
      cardVariant: 'outline',
      backgroundImage:
        'radial-gradient(circle at 50% -12%, hsl(38 35% 30% / 0.85), transparent 62%)',
    },
    prompt: `# 角色定位
你是精通 Dark Academia（学院暗调）视觉语言的前端设计工程师，输出可直接落地的样式规范。

## 设计理念
老图书馆的夜晚：深胡桃木、羊皮纸、皮革书脊与一盏黄铜台灯。质感来自材质与光，而不是装饰；信息像书籍索引一样被编排——小字号、紧行距、明确的层级标签。禁用任何科技感的发光与渐变。

## 字体方案
- 标题：Playfair Display 600，字距 0.02em，字号阶梯 20 / 28 / 38px
- 正文：Noto Serif SC 400，行高 1.75，字号 13～15px（长文可读性优先）
- 编号与引文用 Noto Serif SC 400 斜体；全站不超过 2 个字体族

## HSL 色板
- 背景 hsl(28 18% 12%)（深胡桃），表面 hsl(30 20% 18%)（皮革）
- 主色 hsl(355 45% 38%)（酒红书脊），用于主按钮与关键标记
- 辅色 hsl(38 45% 55%)（黄铜）只做细线、页码与焦点环，面积小于 5%
- 文字 hsl(42 30% 90%)（羊皮纸），次级 hsl(40 12% 72%)；禁用纯白

## 间距与圆角
- 圆角 2px，边框 1px hsl(35 18% 30%)；禁止胶囊与大圆角
- 间距 8 / 16 / 24 / 36 / 56px；正文行宽控制在 68 个汉字以内
- 层次靠 1px 细线与留白；投影只用一档，不透明度不超过 0.45

## 组件规则
- 卡片：皮革底 + 1px 细线、无填充投影；标题下加 24px 宽、1px 高的黄铜短线
- 按钮：酒红实心 + 羊皮纸文字；次按钮透明底 + 1px 细线，hover 只提亮边框
- 数据与引用块用左侧 2px 黄铜竖线标记；图标只用 1.5px 线稿

## 反模式禁令
- 禁用霓虹、玻璃、彩色渐变与高饱和蓝紫（破坏书斋的暗调）
- 禁止大圆角卡片、胶质高光与大面积纯黑背景
- 禁用 12px 以下正文与低于 4.5:1 的对比度；暖调暗色必须保留层次差值`,
  },
];
