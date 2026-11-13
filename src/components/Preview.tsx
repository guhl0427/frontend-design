import type { CSSProperties, JSX } from 'react';
import type { PreviewConfig, StyleItem } from '../types';
import { stylePanel, stylePrimaryButton, styleSecondaryButton } from './stylePrimitives';

interface PreviewProps {
  item: StyleItem;
  /** 定制器传入的覆盖配置；缺省时使用该风格自带的预览配置 */
  preview?: PreviewConfig;
  /** 定制器按信息密度推导的容器内边距 */
  padding?: string;
  /** 是否使用不对称的迷你卡片错位（由布局实验度推导） */
  asymmetric?: boolean;
}

/** 迷你卡片的固定排版：三张等分卡，视觉变体由 stylePanel 决定 */
const MINI_CARD_LAYOUT: CSSProperties = { padding: '8px 10px', minWidth: 0, flex: '1 1 0' };

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
        <span style={{ ...stylePrimaryButton(cfg.buttonVariant, p, radius, borderWidth), display: 'inline-block' }}>
          {cfg.buttonVariant === 'terminal' ? '$ 立即开始' : '立即开始'}
        </span>
        <span style={{ ...styleSecondaryButton(cfg.buttonVariant, p, radius, borderWidth), display: 'inline-block' }}>
          {cfg.buttonVariant === 'terminal' ? '$ 了解更多' : '了解更多'}
        </span>
      </div>

      {/* 迷你卡片行（布局实验度 ≥ 8 时做不对称错位） */}
      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
        {miniCards.map((card, index) => (
          <div
            key={card.label}
            style={{
              ...MINI_CARD_LAYOUT,
              ...stylePanel(cfg.cardVariant, cfg),
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
