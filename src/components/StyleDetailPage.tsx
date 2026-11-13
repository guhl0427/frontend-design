import { useEffect, useMemo, type JSX } from 'react';
import type { StyleItem, StylePalette } from '../types';
import { useCopy } from '../hooks/useCopy';
import {
  buildDesignMd,
  buildSingleMarkdown,
  designMdFilename,
  downloadText,
  singleFilename,
} from '../utils/export';
import { buildShareLink } from '../utils/viewState';
import StyleShowcase from './StyleShowcase';

/** 相邻风格：按数据源顺序取上一款 / 下一款 */
export interface StyleNeighbor {
  item: StyleItem;
  /** 数据源中的稳定序号（1 起） */
  index: number;
}

interface StyleDetailPageProps {
  item: StyleItem;
  /** 数据源中的稳定序号（1 起），与画廊卡片上的编号一致 */
  index: number;
  /** 返回画廊 */
  onBack: () => void;
  /** 打开定制抽屉 */
  onCustomize: (item: StyleItem) => void;
  /** 是否已收藏 */
  isFavorite: boolean;
  /** 切换收藏态 */
  onToggleFavorite: (id: string) => void;
  /** 是否已在对比集 */
  inCompare: boolean;
  /** 加入 / 移出对比集 */
  onToggleCompare: (item: StyleItem) => void;
  /** 上一款（数据源首款为 null） */
  prev: StyleNeighbor | null;
  /** 下一款（数据源末款为 null） */
  next: StyleNeighbor | null;
  /** 切换到相邻风格（同级替换，不堆叠历史记录） */
  onNavigate: (item: StyleItem) => void;
  /** 对比集非空时为底部对比条留出空间 */
  hasCompare: boolean;
}

interface PaletteSwatch {
  name: string;
  value: string;
}

/** 从色板中提取可展示的色块 */
function extractSwatches(p: StylePalette): PaletteSwatch[] {
  return [
    { name: '背景', value: p.bg },
    { name: '表面', value: p.surface },
    { name: '强调', value: p.accent },
    { name: '文字', value: p.text },
    { name: '次级文字', value: p.textMuted },
    { name: '边框', value: p.border },
  ];
}

/** 渲染提示词正文：# → h3，## → h4，连续的 - 行归组为 ul/li，空行跳过（间距由 CSS 承担） */
function renderPromptBody(prompt: string): JSX.Element[] {
  const nodes: JSX.Element[] = [];
  let listItems: string[] = [];

  const flushList = (key: string): void => {
    if (listItems.length > 0) {
      nodes.push(
        <ul key={key}>
          {listItems.map((text, itemIndex) => (
            <li key={`${key}-${itemIndex}`}>{text}</li>
          ))}
        </ul>,
      );
      listItems = [];
    }
  };

  prompt.split('\n').forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ')) {
      listItems.push(trimmed.slice(2));
      return;
    }
    flushList(`list-${index}`);
    if (trimmed.startsWith('# ')) {
      nodes.push(<h3 key={`h3-${index}`}>{trimmed.slice(2)}</h3>);
    } else if (trimmed.startsWith('## ')) {
      nodes.push(<h4 key={`h4-${index}`}>{trimmed.slice(3)}</h4>);
    } else if (trimmed !== '') {
      nodes.push(<p key={`p-${index}`}>{trimmed}</p>);
    }
  });
  flushList('list-end');
  return nodes;
}

/** 顶部条与侧栏共用的文字按钮 */
const textActionClass =
  'cursor-pointer px-1.5 py-1 text-[12.5px] text-ink-faint transition-colors hover:text-ink';

/**
 * 风格详情页。
 *
 * 结构固定为：顶部操作条 → 标题块 → 带边界的展示框（内嵌 StyleShowcase）
 * → 提示词正文 + 规格侧栏 → 上一款 / 下一款。
 * 35 个风格的详情页只有内容不同，骨架完全一致，交互也一致：
 * 「← 返回」与 Esc 都回到画廊，封面进入的那一款就是这一页。
 */
export default function StyleDetailPage({
  item,
  index,
  onBack,
  onCustomize,
  isFavorite,
  onToggleFavorite,
  inCompare,
  onToggleCompare,
  prev,
  next,
  onNavigate,
  hasCompare,
}: StyleDetailPageProps): JSX.Element {
  const { copied, copy } = useCopy();
  const { copied: linkCopied, copy: copyLink } = useCopy();

  // 浏览器标签页标题跟随当前风格，分享出去的链接更有辨识度
  useEffect(() => {
    const previous = document.title;
    document.title = `${item.nameZh} · 前端风格提示词画廊`;
    return () => {
      document.title = previous;
    };
  }, [item.nameZh]);

  // 进入详情页从顶部开始读
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [item.id]);

  // Esc 返回画廊；抽屉或对比弹窗打开时不拦截（那一层的 Esc 有自己的语义）
  useEffect(() => {
    const onKeydown = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') return;
      if (document.querySelector('[role="dialog"]') !== null) return;
      onBack();
    };
    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  }, [onBack]);

  const swatches = useMemo(() => extractSwatches(item.preview.palette), [item]);

  const specs: Array<{ label: string; value: string }> = [
    { label: '圆角', value: item.preview.radius },
    { label: '描边', value: item.preview.borderWidth },
    { label: '标题字重', value: String(item.preview.titleWeight) },
    { label: '标题字距', value: item.preview.titleLetterSpacing },
    { label: '标题大写', value: item.preview.uppercaseTitle ? '是' : '否' },
    { label: '按钮变体', value: item.preview.buttonVariant },
    { label: '卡片变体', value: item.preview.cardVariant },
  ];

  const indexLabel = String(index).padStart(2, '0');

  return (
    <div data-style-detail data-style-id={item.id} className="min-h-screen">
      {/* 顶部操作条：返回 + 层级路径 + 动作 */}
      <div className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={onBack}
            className="flex cursor-pointer items-center gap-1.5 py-1 text-[13px] text-ink-muted transition-colors hover:text-ink"
          >
            <span aria-hidden="true">←</span>
            返回画廊
          </button>
          <span aria-hidden="true" className="h-3 w-px shrink-0 bg-line-strong" />
          <p className="flex min-w-0 items-baseline gap-2 font-mono text-[11px] tracking-[0.06em] text-ink-faint">
            <span className="hidden sm:inline">风格画廊</span>
            <span aria-hidden="true" className="hidden sm:inline">
              /
            </span>
            <span>{item.category}</span>
            <span aria-hidden="true">/</span>
            <span className="truncate text-ink-muted">{item.nameZh}</span>
          </p>

          <div className="ml-auto flex flex-wrap items-center gap-x-3 gap-y-2">
            <button
              type="button"
              onClick={() => void copy(item.prompt)}
              className={`cursor-pointer px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                copied ? 'bg-brand text-surface' : 'bg-ink text-surface hover:bg-brand'
              }`}
            >
              {copied ? '已复制 ✓' : '复制提示词'}
            </button>
            <button type="button" onClick={() => onCustomize(item)} className={textActionClass}>
              定制
            </button>
            <button
              type="button"
              onClick={() => onToggleFavorite(item.id)}
              aria-pressed={isFavorite}
              aria-label={isFavorite ? `取消收藏「${item.nameZh}」` : `收藏「${item.nameZh}」`}
              className={`cursor-pointer py-1 text-[12.5px] transition-colors ${isFavorite ? 'text-brand' : 'text-ink-faint hover:text-ink'}`}
            >
              {isFavorite ? '★ 已收藏' : '☆ 收藏'}
            </button>
            <button
              type="button"
              onClick={() => onToggleCompare(item)}
              aria-pressed={inCompare}
              aria-label={inCompare ? `将「${item.nameZh}」移出对比集` : `将「${item.nameZh}」加入对比集`}
              className={`cursor-pointer py-1 text-[12.5px] transition-colors ${inCompare ? 'text-brand' : 'text-ink-faint hover:text-ink'}`}
            >
              {inCompare ? '已加入对比' : '对比'}
            </button>
            <button type="button" onClick={() => void copyLink(buildShareLink(item.id))} className={textActionClass}>
              {linkCopied ? '链接已复制 ✓' : '分享'}
            </button>
          </div>
        </div>
      </div>

      <div className={`mx-auto max-w-[1200px] px-4 pt-8 sm:px-6 lg:px-8 ${hasCompare ? 'pb-32' : 'pb-16'}`}>
        {/* 标题块 */}
        <header className="border-b border-line pb-6">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[10.5px] tracking-[0.14em] text-ink-faint">
            <span className="tabular-nums">{indexLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{item.category}</span>
            <span aria-hidden="true">·</span>
            <span>{item.nameEn}</span>
          </div>
          <h1 className="mt-2 text-[28px] leading-tight font-semibold tracking-[-0.015em] text-ink sm:text-[32px]">
            {item.nameZh}
          </h1>
          <p className="mt-3 max-w-[62ch] text-[13.5px] leading-[1.8] text-ink-muted">{item.summary}</p>
          <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
            {item.tags.map((tag) => (
              <span key={tag} className="font-mono text-[10.5px] text-ink-faint">
                #{tag}
              </span>
            ))}
          </div>
        </header>

        {/* 带边界的展示框：框内是该风格的完整页面样张 */}
        <figure className="mt-8">
          <figcaption className="mb-2.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 className="font-mono text-[10.5px] tracking-[0.16em] text-ink-faint">完整页面展示</h2>
            <span className="font-mono text-[10.5px] tracking-[0.08em] text-ink-faint">
              nav / hero / stats / features / cta / footer
            </span>
          </figcaption>
          <div data-showcase-frame className="border border-line bg-surface-raised p-2.5 sm:p-3.5">
            <div className="overflow-hidden border border-line-strong/60">
              <StyleShowcase item={item} />
            </div>
          </div>
          <p className="mt-2.5 max-w-[68ch] text-[12.5px] leading-[1.75] text-ink-faint">
            展示框内的页面与编号 {indexLabel} 的卡片封面共用同一份预览配置（色板 / 字体 / 圆角 / 描边 / 组件变体），
            因此封面、进入的详情页与框内样张始终指向同一款风格。
          </p>
        </figure>

        {/* 提示词 + 规格侧栏 */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12">
          <section aria-labelledby="prompt-heading">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <h2 id="prompt-heading" className="font-mono text-[10.5px] tracking-[0.16em] text-ink-faint">
                完整提示词 · 7 段
              </h2>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <button
                  type="button"
                  onClick={() => downloadText(singleFilename(item), buildSingleMarkdown(item))}
                  className={textActionClass}
                >
                  下载 .md
                </button>
                <button
                  type="button"
                  onClick={() => downloadText(designMdFilename(item), buildDesignMd(item))}
                  className={textActionClass}
                >
                  导出 DESIGN.md
                </button>
              </div>
            </div>
            <div className="prompt-body border border-line bg-surface-raised p-5 sm:p-7">{renderPromptBody(item.prompt)}</div>
          </section>

          <aside className="space-y-8 self-start lg:sticky lg:top-20">
            {/* 色板可视化 */}
            <section aria-labelledby="palette-heading">
              <h2 id="palette-heading" className="mb-3 font-mono text-[10.5px] tracking-[0.16em] text-ink-faint">
                预览色板
              </h2>
              {/*
                规格列表而非色块矩阵：色值是这一屏的主要数据，必须完整可读；
                半透明色值（玻璃拟态等风格）靠棋盘格底衬才能被正确解读。
              */}
              <div className="divide-y divide-line border border-line">
                {swatches.map((swatch) => (
                  <div key={swatch.name} className="flex items-center gap-3 px-3 py-2" data-swatch={swatch.name}>
                    <div
                      className="h-7 w-7 shrink-0 border border-line-strong"
                      style={{
                        backgroundImage: 'repeating-conic-gradient(hsl(0 0% 62%) 0% 25%, hsl(0 0% 42%) 0% 50%)',
                        backgroundSize: '8px 8px',
                      }}
                    >
                      <div className="h-full w-full" style={{ backgroundColor: swatch.value }} />
                    </div>
                    <span className="w-14 shrink-0 text-[12px] text-ink">{swatch.name}</span>
                    <span className="truncate font-mono text-[11px] text-ink-faint" title={swatch.value}>
                      {swatch.value}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* 字体信息 */}
            <section aria-labelledby="font-heading">
              <h2 id="font-heading" className="mb-3 font-mono text-[10.5px] tracking-[0.16em] text-ink-faint">
                预览字体
              </h2>
              <div className="flex flex-wrap gap-2">
                <span
                  className="border border-line px-3 py-1.5 text-[13px] text-ink"
                  style={{ fontFamily: item.preview.headingFont }}
                >
                  标题：{item.preview.headingFont.replace(/"/g, '').split(',')[0]}
                </span>
                <span
                  className="border border-line px-3 py-1.5 text-[13px] text-ink"
                  style={{ fontFamily: item.preview.bodyFont }}
                >
                  正文：{item.preview.bodyFont.replace(/"/g, '').split(',')[0]}
                </span>
              </div>
            </section>

            {/* 组件规格：展示框内每一处形态的取值来源 */}
            <section aria-labelledby="spec-heading">
              <h2 id="spec-heading" className="mb-3 font-mono text-[10.5px] tracking-[0.16em] text-ink-faint">
                组件规格
              </h2>
              <dl className="divide-y divide-line border border-line">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex items-baseline justify-between gap-3 px-3 py-2">
                    <dt className="shrink-0 text-[12px] text-ink-muted">{spec.label}</dt>
                    <dd className="truncate font-mono text-[11px] text-ink-faint" title={spec.value}>
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </aside>
        </div>

        {/* 相邻风格：同级切换，保持“这一款 → 下一款”的浏览节奏 */}
        <nav aria-label="相邻风格" className="mt-12 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
          {prev === null ? (
            <p className="text-[12.5px] text-ink-faint">已经是第一款</p>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate(prev.item)}
              className="group flex cursor-pointer items-baseline justify-between gap-4 border border-line px-4 py-3 text-left transition-colors hover:border-line-strong"
            >
              <span className="font-mono text-[10.5px] tracking-[0.12em] text-ink-faint">
                ← 上一款 {String(prev.index).padStart(2, '0')}
              </span>
              <span className="truncate text-[13px] text-ink-muted transition-colors group-hover:text-ink">
                {prev.item.nameZh}
              </span>
            </button>
          )}
          {next === null ? (
            <p className="text-[12.5px] text-ink-faint sm:text-right">已经是最后一款</p>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate(next.item)}
              className="group flex cursor-pointer items-baseline justify-between gap-4 border border-line px-4 py-3 text-left transition-colors hover:border-line-strong sm:text-right"
            >
              <span className="truncate text-[13px] text-ink-muted transition-colors group-hover:text-ink">
                {next.item.nameZh}
              </span>
              <span className="font-mono text-[10.5px] tracking-[0.12em] text-ink-faint">
                {String(next.index).padStart(2, '0')} 下一款 →
              </span>
            </button>
          )}
        </nav>
      </div>
    </div>
  );
}
