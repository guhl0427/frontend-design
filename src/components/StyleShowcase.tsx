import type { CSSProperties, JSX } from 'react';
import type { StyleItem, StylePalette } from '../types';
import { stylePanel, stylePrimaryButton, styleSecondaryButton } from './stylePrimitives';

interface StyleShowcaseProps {
  item: StyleItem;
}

/*
  展示区内的文案固定，不随风格变化：
  35 个详情页共用同一套页面骨架（导航 → 主视觉 → 数据条 → 特性卡片 → 行动号召 → 页脚），
  只有色板、字体、圆角、描边与按钮/卡片变体来自该风格的数据。
  这样「结构统一」是代码层面成立的，而不是靠人工对齐。
*/
const NAV_LINKS = ['产品', '方案', '定价', '文档'];
const HERO_CHECKS = ['纯 CSS 渲染', '无位图', '提示词可复制'];
const STATS = [
  { value: '12ms', label: '首屏渲染' },
  { value: '99.9%', label: '服务可用性' },
  { value: '4.5:1', label: '最低文字对比度' },
];
const FEATURES = [
  { title: '组件优先', body: '按钮、卡片、徽章先定规则，页面再组装，避免每页重新发明样式。' },
  { title: '节奏一致', body: '间距与圆角取自同一套刻度，跨页面、跨模块都不漂移。' },
  { title: '可访问', body: '正文对比度不低于 4.5:1，焦点态始终可见，字号不小于 12px。' },
];
const GLYPHS = ['square', 'circle', 'diamond'] as const;
/** 柱状图高度百分比：固定值，保证 35 个详情页的样张形态一致 */
const BAR_HEIGHTS = [42, 66, 38, 82, 55, 94, 70];
const BAR_LABELS = ['一', '二', '三', '四', '五', '六', '日'];

/** 特性卡片的图标位：用几何形而非图标字体，避免引入额外字体 */
function glyphStyle(kind: (typeof GLYPHS)[number], p: StylePalette, radius: string): CSSProperties {
  const base: CSSProperties = { display: 'block', width: '16px', height: '16px', backgroundColor: p.accent, borderRadius: radius };
  if (kind === 'circle') return { ...base, borderRadius: '999px' };
  if (kind === 'diamond') return { ...base, borderRadius: '2px', transform: 'rotate(45deg)' };
  return base;
}

/**
 * 完整页面风格展示区：一个「落地页样张」，用它自己的视觉规则渲染整页。
 * 语义上整体视作一张图片（role=img + aria-label）：内部是模拟文案与模拟控件，
 * 逐字朗读只会产生噪声，真实信息由详情页的标题、提示词与规格表承担。
 */
export default function StyleShowcase({ item }: StyleShowcaseProps): JSX.Element {
  const cfg = item.preview;
  const p = cfg.palette;
  const radius = cfg.radius;
  const borderWidth = cfg.borderWidth === '0px' ? '1px' : cfg.borderWidth;
  const title = cfg.uppercaseTitle ? item.nameEn.toUpperCase() : item.nameEn;

  const primary = { ...stylePrimaryButton(cfg.buttonVariant, p, radius, borderWidth), display: 'inline-block' };
  const secondary = { ...styleSecondaryButton(cfg.buttonVariant, p, radius, borderWidth), display: 'inline-block' };
  const headingStyle: CSSProperties = {
    fontFamily: cfg.headingFont,
    fontWeight: cfg.titleWeight,
    letterSpacing: cfg.titleLetterSpacing,
    color: p.text,
  };

  return (
    <div
      role="img"
      data-showcase
      aria-label={`「${item.nameZh}」完整页面风格展示：顶部导航、主视觉、数据条、三张特性卡片、行动号召与页脚，全部由该风格的色板、字体与组件规则纯 CSS 渲染。`}
      style={{
        backgroundColor: p.bg,
        backgroundImage: cfg.backgroundImage,
        color: p.text,
        fontFamily: cfg.bodyFont,
        overflow: 'hidden',
      }}
    >
      {/* 1 顶部导航 */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8"
        style={{ borderBottom: `1px solid ${p.border}` }}
      >
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="grid place-items-center"
            style={{
              width: '22px',
              height: '22px',
              flex: '0 0 auto',
              backgroundColor: p.accent,
              color: p.accentText,
              borderRadius: radius === '0px' ? '0px' : '999px',
              fontSize: '11px',
              fontWeight: 700,
            }}
          >
            {item.nameZh.slice(0, 1)}
          </span>
          <span
            style={{
              ...headingStyle,
              fontSize: '15px',
              lineHeight: 1.2,
              textTransform: cfg.uppercaseTitle ? 'uppercase' : 'none',
            }}
          >
            {title}
          </span>
        </div>
        <div className="flex items-center gap-5">
          <div className="hidden items-center gap-5 sm:flex" style={{ fontSize: '12px', color: p.textMuted }}>
            {NAV_LINKS.map((link) => (
              <span key={link}>{link}</span>
            ))}
          </div>
          <span style={primary}>开始使用</span>
        </div>
      </div>

      {/* 2 主视觉 */}
      <div className="grid gap-8 px-5 py-8 sm:px-8 sm:py-12 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-10">
        <div className="min-w-0">
          <span
            style={{
              display: 'inline-block',
              fontSize: '9.5px',
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              padding: '4px 9px',
              borderRadius: radius === '0px' ? '0px' : '999px',
              backgroundColor: p.accent,
              color: p.accentText,
            }}
          >
            {item.category} · 风格样张
          </span>
          <div
            style={{
              ...headingStyle,
              marginTop: '16px',
              fontSize: 'clamp(26px, 3.4vw, 40px)',
              lineHeight: 1.08,
              textTransform: cfg.uppercaseTitle ? 'uppercase' : 'none',
            }}
          >
            {title}
          </div>
          <p style={{ margin: '14px 0 0', maxWidth: '46ch', fontSize: '13px', lineHeight: 1.8, color: p.textMuted }}>
            {item.summary}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span style={primary}>立即开始</span>
            <span style={secondary}>查看规范</span>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-1.5" style={{ fontSize: '11px', color: p.textMuted }}>
            {HERO_CHECKS.map((check) => (
              <span key={check}>✓ {check}</span>
            ))}
          </div>
        </div>

        {/* 主视觉右侧：一张数据卡片，用真实的面板变体体现圆角 / 阴影 / 描边 */}
        <div className="min-w-0">
          <div style={{ ...stylePanel(cfg.cardVariant, cfg), padding: '16px 18px' }}>
            <div className="flex items-baseline justify-between gap-3">
              <span style={{ fontSize: '11px', letterSpacing: '0.08em', color: p.textMuted }}>本周访问</span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: p.text }}>+18.2%</span>
            </div>
            <div style={{ ...headingStyle, marginTop: '8px', fontSize: '26px', lineHeight: 1 }}>24,806</div>
            <div className="mt-4 flex items-end gap-1.5" style={{ height: '62px' }} aria-hidden="true">
              {BAR_HEIGHTS.map((height, index) => (
                <span
                  key={BAR_LABELS[index]}
                  style={{
                    flex: '1 1 0',
                    height: `${height}%`,
                    backgroundColor: p.accent,
                    borderRadius: radius === '0px' ? '0px' : '2px',
                  }}
                />
              ))}
            </div>
            <div className="mt-2 flex gap-1.5" style={{ fontSize: '10px', color: p.textMuted }} aria-hidden="true">
              {BAR_LABELS.map((label) => (
                <span key={label} style={{ flex: '1 1 0', textAlign: 'center' }}>
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1" style={{ fontSize: '10.5px', color: p.textMuted }}>
            <span>圆角 {cfg.radius}</span>
            <span aria-hidden="true">·</span>
            <span>描边 {cfg.borderWidth}</span>
            <span aria-hidden="true">·</span>
            <span>字重 {cfg.titleWeight}</span>
          </div>
        </div>
      </div>

      {/* 3 数据条 */}
      <div
        className="grid grid-cols-1 sm:grid-cols-3"
        style={{ borderTop: `1px solid ${p.border}`, borderBottom: `1px solid ${p.border}` }}
      >
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="border-t border-solid px-5 py-4 first:border-t-0 sm:border-t-0 sm:border-l sm:px-8 sm:first:border-l-0"
            style={{ borderColor: p.border }}
          >
            <div style={{ ...headingStyle, fontSize: '19px', lineHeight: 1.2 }}>{stat.value}</div>
            <div style={{ marginTop: '4px', fontSize: '11px', color: p.textMuted }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 4 特性卡片 */}
      <div className="px-5 py-8 sm:px-8 sm:py-12">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div style={{ ...headingStyle, fontSize: '18px', lineHeight: 1.3 }}>组件与规则</div>
          <span style={{ fontSize: '11px', color: p.textMuted }}>03 项</span>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <div key={feature.title} style={{ ...stylePanel(cfg.cardVariant, cfg), padding: '16px' }}>
              <span aria-hidden="true" style={glyphStyle(GLYPHS[index], p, radius)} />
              <div style={{ ...headingStyle, marginTop: '12px', fontSize: '13px', lineHeight: 1.4 }}>{feature.title}</div>
              <p style={{ margin: '6px 0 0', fontSize: '11.5px', lineHeight: 1.7, color: p.textMuted }}>{feature.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5 行动号召 */}
      <div className="px-5 pb-8 sm:px-8 sm:pb-12">
        <div
          className="flex flex-wrap items-center justify-between gap-4"
          style={{ ...stylePanel(cfg.cardVariant, cfg), padding: '20px 22px' }}
        >
          <div className="min-w-0">
            <div style={{ ...headingStyle, fontSize: '17px', lineHeight: 1.35 }}>把这套风格写进你的项目</div>
            <p style={{ margin: '6px 0 0', fontSize: '12px', lineHeight: 1.7, color: p.textMuted }}>
              7 段提示词可直接粘贴至 Claude / Cursor / v0。
            </p>
          </div>
          <span style={primary}>复制提示词</span>
        </div>
      </div>

      {/* 6 页脚 */}
      <div
        className="flex flex-wrap items-center justify-between gap-2 px-5 py-4 sm:px-8"
        style={{ borderTop: `1px solid ${p.border}`, fontSize: '10.5px', color: p.textMuted }}
      >
        <span>
          {item.nameEn} · {item.category}
        </span>
        <span>Style Gallery · 2026</span>
      </div>
    </div>
  );
}
