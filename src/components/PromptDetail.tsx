import { useEffect, useMemo } from 'react';
import type { StyleItem, StylePalette } from '../types';
import { useCopy } from '../hooks/useCopy';
import { useFocusTrap } from '../hooks/useFocusTrap';
import {
  buildDesignMd,
  buildSingleMarkdown,
  designMdFilename,
  downloadText,
  singleFilename,
} from '../utils/export';
import { buildShareLink } from '../utils/viewState';

interface PromptDetailProps {
  item: StyleItem;
  onClose: () => void;
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

/** 弹窗内次级动作的统一写法：无边框文字按钮，靠明度而非描边区分层级 */
const detailActionClass =
  'cursor-pointer px-1.5 py-1 text-[12.5px] text-ink-faint transition-colors hover:text-ink';

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

/** 提示词详情弹窗：完整正文 + 色板可视化 + 复制 / 分享 / 下载 / 定制 / 收藏 / 对比 / DESIGN.md 导出 */
export default function PromptDetail({
  item,
  onClose,
  onCustomize,
  isFavorite,
  onToggleFavorite,
  inCompare,
  onToggleCompare,
}: PromptDetailProps): JSX.Element {
  const panelRef = useFocusTrap<HTMLDivElement>();
  const { copied, copy } = useCopy();
  const { copied: linkCopied, copy: copyLink } = useCopy();

  // Esc 关闭
  useEffect(() => {
    const onKeydown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  }, [onClose]);

  // 弹窗打开时锁定页面滚动
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const swatches = useMemo(() => extractSwatches(item.preview.palette), [item]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`「${item.nameZh}」提示词详情`}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="flex max-h-[86vh] w-full max-w-[660px] flex-col overflow-hidden border border-line-strong bg-surface-raised outline-none"
        onClick={(event) => event.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div>
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="text-[21px] font-semibold tracking-[-0.015em] text-ink">{item.nameZh}</h2>
              <span className="font-mono text-[10.5px] tracking-[0.12em] text-ink-faint">{item.category}</span>
            </div>
            <p className="mt-0.5 font-mono text-[11px] text-ink-faint">{item.nameEn}</p>
          </div>
          {/* 八个动作里只有「复制提示词」是实心块，其余压成同一级的文字按钮 */}
          <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2">
            <button
              type="button"
              onClick={() => void copy(item.prompt)}
              className={`cursor-pointer px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                copied ? 'bg-brand text-surface' : 'bg-ink text-surface hover:bg-brand'
              }`}
            >
              {copied ? '已复制 ✓' : '复制提示词'}
            </button>
            <button type="button" onClick={() => onCustomize(item)} className={detailActionClass}>
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
            <button
              type="button"
              onClick={() => downloadText(designMdFilename(item), buildDesignMd(item))}
              className={detailActionClass}
            >
              导出 DESIGN.md
            </button>
            <button type="button" onClick={() => void copyLink(buildShareLink(item.id))} className={detailActionClass}>
              {linkCopied ? '链接已复制 ✓' : '分享'}
            </button>
            <button
              type="button"
              onClick={() => downloadText(singleFilename(item), buildSingleMarkdown(item))}
              className={detailActionClass}
            >
              下载
            </button>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-1.5 py-1 text-[13px] leading-none text-ink-faint transition-colors hover:text-ink"
              aria-label="关闭详情"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 内容 */}
        <div className="overflow-y-auto px-5 py-5 sm:px-6">
          {/* 色板可视化 */}
          <section className="mb-5">
            <h3 className="mb-3 font-mono text-[10.5px] tracking-[0.16em] text-ink-faint">预览色板</h3>
            {/*
              规格列表而非色块矩阵：色值是这一屏的主要数据，必须完整可读；
              深色色块在深色底上没有边界，靠 1px 边框和并排的名称把它界定出来。
            */}
            <div className="divide-y divide-line border border-line">
              {swatches.map((swatch) => (
                <div key={swatch.name} className="flex items-center gap-3 px-3 py-2" data-swatch={swatch.name}>
                  {/*
                    棋盘格打底、真实色值覆盖其上：
                    半透明色值（玻璃拟态等风格）才能被正确解读，
                    不透明色值则完整遮住棋盘格，呈现它本来的颜色。
                  */}
                  <div
                    className="h-7 w-7 shrink-0 border border-line-strong"
                    style={{
                      backgroundImage:
                        'repeating-conic-gradient(hsl(0 0% 62%) 0% 25%, hsl(0 0% 42%) 0% 50%)',
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
          <section className="mb-5">
            <h3 className="mb-3 font-mono text-[10.5px] tracking-[0.16em] text-ink-faint">预览字体</h3>
            <div className="flex flex-wrap gap-2">
              <span
                className="border border-line px-3 py-1.5 text-[13px] text-ink"
                style={{ fontFamily: item.preview.headingFont }}
              >
                标题：{item.preview.headingFont.replace(/"/g, '').split(',')[0]}
              </span>
              <span className="border border-line px-3 py-1.5 text-[13px] text-ink" style={{ fontFamily: item.preview.bodyFont }}>
                正文：{item.preview.bodyFont.replace(/"/g, '').split(',')[0]}
              </span>
            </div>
          </section>

          {/* 完整提示词 */}
          <section>
            <h3 className="mb-3 font-mono text-[10.5px] tracking-[0.16em] text-ink-faint">完整提示词</h3>
            <div className="prompt-body border border-line bg-surface p-5">
              {renderPromptBody(item.prompt)}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
