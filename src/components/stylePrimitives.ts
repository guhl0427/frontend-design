import type { CSSProperties } from 'react';
import type { ButtonVariant, CardVariant, PreviewConfig, StylePalette } from '../types';

/*
  风格变体原语：按钮与面板的「外观」只在这里定义一次。
  Preview（卡片封面 / 定制器实时预览）与 StyleShowcase（详情页完整页面展示区）
  都从这里取样式，保证同一款风格在两处长得一致——封面看到什么，详情页就展开什么。
  这些函数只返回视觉属性，尺寸与排版由调用方决定。
*/

/** 主按钮外观（按变体分派） */
export function stylePrimaryButton(
  variant: ButtonVariant,
  p: StylePalette,
  radius: string,
  borderWidth: string,
): CSSProperties {
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

/** 次级按钮外观 */
export function styleSecondaryButton(
  variant: ButtonVariant,
  p: StylePalette,
  radius: string,
  borderWidth: string,
): CSSProperties {
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

/** 面板 / 卡片外观（按变体分派）；不含内边距、尺寸与伸缩，供调用方按场景组合 */
export function stylePanel(variant: CardVariant, cfg: PreviewConfig): CSSProperties {
  const p = cfg.palette;
  switch (variant) {
    case 'flat':
      return { backgroundColor: p.surface, borderRadius: cfg.radius, boxShadow: cfg.shadow };
    case 'hard':
      return {
        backgroundColor: p.surface,
        borderRadius: cfg.radius,
        border: `${cfg.borderWidth} solid ${p.border}`,
        boxShadow: `3px 3px 0 ${p.shadowColor}`,
      };
    case 'glass':
      return {
        backgroundColor: 'rgba(255, 255, 255, 0.10)',
        borderRadius: cfg.radius,
        border: '1px solid rgba(255, 255, 255, 0.22)',
        backdropFilter: 'blur(12px)',
      };
    case 'inset':
      return {
        backgroundColor: p.surface,
        borderRadius: cfg.radius,
        boxShadow: 'inset 3px 3px 6px hsl(225 25% 78%), inset -3px -3px 6px hsl(0 0% 100%)',
      };
    case 'outline':
      return { backgroundColor: 'transparent', borderRadius: cfg.radius, border: `${cfg.borderWidth} solid ${p.border}` };
    case 'pixel':
      return {
        backgroundColor: p.surface,
        borderRadius: '0px',
        border: `3px solid ${p.border}`,
        boxShadow: `3px 3px 0 0 ${p.shadowColor}`,
      };
    case 'sketch':
      return {
        backgroundColor: p.surface,
        borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px',
        border: `2px dashed ${p.border}`,
        transform: 'rotate(-0.6deg)',
      };
    case 'acrylic':
      return {
        backgroundColor: 'rgba(255, 255, 255, 0.55)',
        borderRadius: cfg.radius,
        border: `1px solid ${p.border}`,
        backdropFilter: 'blur(30px) saturate(120%)',
        boxShadow: cfg.shadow,
      };
    /* 黏土：外柔影 + 底部内阴影 + 顶部白色内高光，构成体积 */
    case 'clay':
      return {
        backgroundColor: p.surface,
        borderRadius: cfg.radius,
        border: 'none',
        boxShadow: `7px 9px 16px ${p.shadowColor}, inset 0 -4px 8px ${p.shadowColor}, inset 0 4px 8px rgba(255, 255, 255, 0.9)`,
      };
    /* 液态玻璃：低模糊 + 强白细边 + 顶部内高光（折射而非磨砂） */
    case 'liquid':
      return {
        backgroundColor: p.surface,
        borderRadius: cfg.radius,
        border: `1px solid ${p.border}`,
        backdropFilter: 'blur(2px) saturate(140%)',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.95), 0 8px 20px rgba(30, 45, 70, 0.12)',
      };
    /* 孔版印刷：墨线描边 + 第二色版错位硬影，模拟套印不准 */
    case 'riso':
      return {
        backgroundColor: p.surface,
        borderRadius: '0px',
        border: `2px solid ${p.border}`,
        boxShadow: `3px 3px 0 ${p.shadowColor}`,
      };
    default:
      return { backgroundColor: p.surface, borderRadius: cfg.radius };
  }
}
