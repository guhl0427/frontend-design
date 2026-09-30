import { useEffect, useMemo } from 'react';
import type { StyleItem, StylePalette } from '../types';
import { useCopy } from '../hooks/useCopy';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { buildSingleMarkdown, downloadText, singleFilename } from '../utils/export';
import { buildShareLink } from '../utils/viewState';

interface PromptDetailProps {
  item: StyleItem;
  onClose: () => void;
  /** 打开定制抽屉 */
  onCustomize: (item: StyleItem) => void;
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

/** 提示词详情弹窗：完整正文 + 色板可视化 + 复制 / 分享 / 下载 / 定制 */
export default function PromptDetail({ item, onClose, onCustomize }: PromptDetailProps): JSX.Element {
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
        className="flex max-h-[86vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface-raised outline-none"
        onClick={(event) => event.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/5 p-5 sm:p-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-ink">{item.nameZh}</h2>
              <span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs text-brand">{item.category}</span>
            </div>
            <p className="mt-1 font-mono text-sm text-ink-faint">{item.nameEn}</p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void copy(item.prompt)}
              className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                copied ? 'bg-brand text-surface' : 'bg-brand/90 text-surface hover:bg-brand'
              }`}
            >
              {copied ? '已复制 ✓' : '复制提示词'}
            </button>
            <button
              type="button"
              onClick={() => onCustomize(item)}
              className="cursor-pointer rounded-lg border border-brand/40 px-3 py-2 text-sm text-brand transition-colors hover:bg-brand-soft"
            >
              定制
            </button>
            <button
              type="button"
              onClick={() => void copyLink(buildShareLink(item.id))}
              className="cursor-pointer rounded-lg border border-white/10 px-3 py-2 text-sm text-ink-muted transition-colors hover:text-ink"
            >
              {linkCopied ? '链接已复制 ✓' : '分享'}
            </button>
            <button
              type="button"
              onClick={() => downloadText(singleFilename(item), buildSingleMarkdown(item))}
              className="cursor-pointer rounded-lg border border-white/10 px-3 py-2 text-sm text-ink-muted transition-colors hover:text-ink"
            >
              下载
            </button>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg border border-white/10 px-3 py-2 text-sm text-ink-muted transition-colors hover:text-ink"
              aria-label="关闭详情"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 内容 */}
        <div className="overflow-y-auto p-5 sm:p-6">
          {/* 色板可视化 */}
          <section className="mb-6">
            <h3 className="mb-3 text-xs font-semibold tracking-[0.18em] text-ink-faint uppercase">预览色板</h3>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {swatches.map((swatch) => (
                <div key={swatch.name} className="overflow-hidden rounded-lg border border-white/5">
                  {/* 棋盘格打底：半透明色值（玻璃拟态等风格）才能被正确解读 */}
                  <div
                    className="h-10 w-full"
                    style={{
                      backgroundColor: swatch.value,
                      backgroundImage:
                        'repeating-conic-gradient(hsl(0 0% 62%) 0% 25%, hsl(0 0% 42%) 0% 50%)',
                      backgroundSize: '10px 10px',
                    }}
                  />
                  <div className="px-2 py-1.5">
                    <div className="text-xs text-ink">{swatch.name}</div>
                    <div className="truncate font-mono text-[10px] text-ink-faint" title={swatch.value}>
                      {swatch.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 字体信息 */}
          <section className="mb-6">
            <h3 className="mb-3 text-xs font-semibold tracking-[0.18em] text-ink-faint uppercase">预览字体</h3>
            <div className="flex flex-wrap gap-2">
              <span
                className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-ink"
                style={{ fontFamily: item.preview.headingFont }}
              >
                标题：{item.preview.headingFont.replace(/"/g, '').split(',')[0]}
              </span>
              <span
                className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-ink"
                style={{ fontFamily: item.preview.bodyFont }}
              >
                正文：{item.preview.bodyFont.replace(/"/g, '').split(',')[0]}
              </span>
            </div>
          </section>

          {/* 完整提示词 */}
          <section>
            <h3 className="mb-3 text-xs font-semibold tracking-[0.18em] text-ink-faint uppercase">完整提示词</h3>
            <div className="prompt-body rounded-xl border border-white/5 bg-surface p-5">
              {renderPromptBody(item.prompt)}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
