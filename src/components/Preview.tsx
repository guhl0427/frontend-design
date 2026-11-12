import type { CSSProperties, JSX } from 'react';
import type { ButtonVariant, CardVariant, PreviewConfig, StyleItem, StylePalette } from '../types';

interface PreviewProps {
  item: StyleItem;
  /** 定制器传入的覆盖配置；缺省时使用该风格自带的预览配置 */
  preview?: PreviewConfig;
  /** 定制器按信息密度推导的容器内边距 */
  padding?: string;
  /** 是否使用不对称的迷你卡片错位（由布局实验度推导） */
  asymmetric?: boolean;
}

/** 主按钮样式（按变体分派） */
function primaryButtonStyle(variant: ButtonVariant, p: StylePalette, radius: string, borderWidth: string): CSSProperties {
  const base: CSSProperties = {
    fontSize: '11px',
    fontWeight: 600,
    padding: '7px 14px',
    lineHeight: 1,
    whiteSpace: 'nowrap',
  };
  switch (variant) {
    case 'solid':
      return { ...base, backgroundColor: p.accent, color: p.accentText, borderRadius: radius, border: 'none' };
    case 'outline':
      return {
        ...base,
        backgroundColor: 'transparent',
        color: p.accent,
        border: `${borderWidth} solid ${p.border}`,
        borderRadius: radius,
      };
    case 'hard':
      return {
        ...base,
        backgroundColor: p.accent,
        color: p.accentText,
        border: `2px solid ${p.shadowColor}`,
        borderRadius: radius,
        boxShadow: `3px 3px 0 ${p.shadowColor}`,
      };
    case 'glass':
      return {
        ...base,
        backgroundColor: 'rgba(255, 255, 255, 0.14)',
        color: p.text,
        border: '1px solid rgba(255, 255, 255, 0.28)',
        borderRadius: radius,
        backdropFilter: 'blur(10px)',
      };
    case 'gradient':
      return {
        ...base,
        backgroundImage: `linear-gradient(120deg, ${p.accent}, ${p.border})`,
        color: p.accentText,
        borderRadius: radius,
        border: 'none',
      };
    case 'terminal':
      return {
        ...base,
        backgroundColor: p.accent,
        color: p.accentText,
        borderRadius: radius,
        border: 'none',
        fontFamily: 'inherit',
      };
    case 'pixel':
      return {
        ...base,
        backgroundColor: p.accent,
        color: p.accentText,
        borderRadius: '0px',
        border: `2px solid ${p.shadowColor}`,
        boxShadow: `2px 2px 0 0 ${p.shadowColor}`,
        letterSpacing: '0.04em',
      };
    /* 黏土：胶囊 + 内高光 + 底部内阴影，体现被捏出的厚度 */
    case 'clay':
      return {
        ...base,
        backgroundColor: p.accent,
        color: p.accentText,
        borderRadius: radius,
        border: 'none',
        boxShadow: `0 6px 12px ${p.shadowColor}, inset 0 -3px 6px ${p.shadowColor}, inset 0 3px 6px rgba(255, 255, 255, 0.55)`,
      };
    /* 液态玻璃：实心主色 + 上缘镜面高光，不叠加背景模糊（控件层需保证可读） */
    case 'liquid':
      return {
        ...base,
        backgroundColor: p.accent,
        color: p.accentText,
        borderRadius: radius,
        border: '1px solid rgba(255, 255, 255, 0.45)',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.55), 0 6px 14px rgba(20, 60, 140, 0.28)',
      };
    /* 孔版印刷：纯色块 + 无描边 + 第二色版错位硬影 */
    case 'riso':
      return {
        ...base,
        backgroundColor: p.accent,
        color: p.accentText,
        borderRadius: '0px',
        border: 'none',
        boxShadow: `3px 3px 0 ${p.shadowColor}`,
        letterSpacing: '0.04em',
      };
    default:
      return { ...base, backgroundColor: p.accent, color: p.accentText, borderRadius: radius };
  }
}

/** 次级按钮样式 */
function secondaryButtonStyle(variant: ButtonVariant, p: StylePalette, radius: string, borderWidth: string): CSSProperties {
  if (variant === 'terminal') {
    return {
      fontSize: '11px',
      padding: '7px 14px',
      backgroundColor: 'transparent',
      color: p.textMuted,
      border: 'none',
      whiteSpace: 'nowrap',
    };
  }
  return {
    fontSize: '11px',
    fontWeight: 500,
    padding: '7px 14px',
    backgroundColor: 'transparent',
    color: p.text,
    border: `${borderWidth} solid ${p.border}`,
    borderRadius: radius,
    whiteSpace: 'nowrap',
  };
}

/** 迷你卡片样式（按变体分派） */
function miniCardStyle(variant: CardVariant, cfg: PreviewConfig): CSSProperties {
  const p = cfg.palette;
  const base: CSSProperties = { padding: '8px 10px', minWidth: 0, flex: '1 1 0' };
  switch (variant) {
    case 'flat':
      return { ...base, backgroundColor: p.surface, borderRadius: cfg.radius, boxShadow: cfg.shadow };
    case 'hard':
      return {
        ...base,
        backgroundColor: p.surface,
        borderRadius: cfg.radius,
        border: `${cfg.borderWidth} solid ${p.border}`,
        boxShadow: `3px 3px 0 ${p.shadowColor}`,
      };
    case 'glass':
      return {
        ...base,
        backgroundColor: 'rgba(255, 255, 255, 0.10)',
        borderRadius: cfg.radius,
        border: '1px solid rgba(255, 255, 255, 0.22)',
        backdropFilter: 'blur(12px)',
      };
    case 'inset':
      return {
        ...base,
        backgroundColor: p.surface,
        borderRadius: cfg.radius,
        boxShadow: 'inset 3px 3px 6px hsl(225 25% 78%), inset -3px -3px 6px hsl(0 0% 100%)',
      };
    case 'outline':
      return { ...base, backgroundColor: 'transparent', borderRadius: cfg.radius, border: `${cfg.borderWidth} solid ${p.border}` };
    case 'pixel':
      return {
        ...base,
        backgroundColor: p.surface,
        borderRadius: '0px',
        border: `3px solid ${p.border}`,
        boxShadow: `3px 3px 0 0 ${p.shadowColor}`,
      };
    case 'sketch':
      return {
        ...base,
        backgroundColor: p.surface,
        borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px',
        border: `2px dashed ${p.border}`,
        transform: 'rotate(-0.6deg)',
      };
    case 'acrylic':
      return {
        ...base,
        backgroundColor: 'rgba(255, 255, 255, 0.55)',
        borderRadius: cfg.radius,
        border: `1px solid ${p.border}`,
        backdropFilter: 'blur(30px) saturate(120%)',
        boxShadow: cfg.shadow,
      };
    /* 黏土：外柔影 + 底部内阴影 + 顶部白色内高光，构成体积 */
    case 'clay':
      return {
        ...base,
        backgroundColor: p.surface,
        borderRadius: cfg.radius,
        border: 'none',
        boxShadow: `7px 9px 16px ${p.shadowColor}, inset 0 -4px 8px ${p.shadowColor}, inset 0 4px 8px rgba(255, 255, 255, 0.9)`,
      };
    /* 液态玻璃：低模糊 + 强白细边 + 顶部内高光（折射而非磨砂） */
    case 'liquid':
      return {
        ...base,
        backgroundColor: p.surface,
        borderRadius: cfg.radius,
        border: `1px solid ${p.border}`,
        backdropFilter: 'blur(2px) saturate(140%)',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.95), 0 8px 20px rgba(30, 45, 70, 0.12)',
      };
    /* 孔版印刷：墨线描边 + 第二色版错位硬影，模拟套印不准 */
    case 'riso':
      return {
        ...base,
        backgroundColor: p.surface,
        borderRadius: '0px',
        border: `2px solid ${p.border}`,
        boxShadow: `3px 3px 0 ${p.shadowColor}`,
      };
    default:
      return { ...base, backgroundColor: p.surface, borderRadius: cfg.radius };
  }
}

/**
 * 风格实时预览：用该风格自身的色板 / 字体 / 圆角 / 组件规则
 * 渲染一个 mini 落地页 hero（标题 + 副标题 + 双按钮 + 三个迷你卡片）。
 * 传入 `preview` / `padding` / `asymmetric` 时按定制参数渲染（定制器抽屉使用）。
 * 预览为纯装饰性内容，对辅助技术隐藏（交互入口由外层按钮的 aria-label 承载）。
 */
export default function Preview({ item, preview, padding, asymmetric = false }: PreviewProps): JSX.Element {
  const cfg = preview ?? item.preview;
  const p = cfg.palette;
  const radius = cfg.radius;
  const borderWidth = cfg.borderWidth === '0px' ? '1px' : cfg.borderWidth;

  const title = cfg.uppercaseTitle ? item.nameEn.toUpperCase() : item.nameEn;

  const miniCards: Array<{ label: string; value: string }> = [
    { label: '色板', value: p.accent },
    { label: '字体', value: cfg.headingFont.replace(/"/g, '').split(',')[0] },
    { label: '圆角', value: cfg.radius === '999px' ? '胶囊' : cfg.radius },
  ];

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'relative',
        height: '216px',
        overflow: 'hidden',
        backgroundColor: p.bg,
        backgroundImage: cfg.backgroundImage,
        color: p.text,
        fontFamily: cfg.bodyFont,
        padding: padding ?? '18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      {/* 顶部品牌行 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            fontSize: '9px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '3px 8px',
            borderRadius: radius === '0px' ? '0px' : '999px',
            backgroundColor: p.accent,
            color: p.accentText,
            border: `1px solid ${p.accent}`,
          }}
        >
          {item.category}
        </span>
        <span style={{ fontSize: '10px', color: p.textMuted }}>{item.tags[0]}</span>
      </div>

      {/* 标题区 */}
      <div style={{ marginTop: '2px' }}>
        <h4
          style={{
            margin: 0,
            fontFamily: cfg.headingFont,
            fontWeight: cfg.titleWeight,
            fontSize: '22px',
            lineHeight: 1.15,
            letterSpacing: cfg.titleLetterSpacing,
            textTransform: cfg.uppercaseTitle ? 'uppercase' : 'none',
            color: p.text,
          }}
        >
          {title}
        </h4>
        <p style={{ margin: '6px 0 0', fontSize: '11px', lineHeight: 1.6, color: p.textMuted, maxWidth: '88%' }}>
          {item.nameZh} · 用当前风格实时渲染的迷你落地页示例
        </p>
      </div>

      {/* 按钮组（span 模拟按钮外观，避免嵌套交互元素） */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ ...primaryButtonStyle(cfg.buttonVariant, p, radius, borderWidth), display: 'inline-block' }}>
          {cfg.buttonVariant === 'terminal' ? '$ 立即开始' : '立即开始'}
        </span>
        <span style={{ ...secondaryButtonStyle(cfg.buttonVariant, p, radius, borderWidth), display: 'inline-block' }}>
          {cfg.buttonVariant === 'terminal' ? '$ 了解更多' : '了解更多'}
        </span>
      </div>

      {/* 迷你卡片行（布局实验度 ≥ 8 时做不对称错位） */}
      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
        {miniCards.map((card, index) => (
          <div
            key={card.label}
            style={{
              ...miniCardStyle(cfg.cardVariant, cfg),
              ...(asymmetric ? { transform: `translateY(${index % 2 === 0 ? 3 : -9}px)` } : {}),
            }}
          >
            <div style={{ fontSize: '8px', letterSpacing: '0.1em', color: p.textMuted, marginBottom: '3px' }}>
              {card.label.toUpperCase()}
            </div>
            <div style={{ fontSize: '10px', fontWeight: 600, color: p.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
