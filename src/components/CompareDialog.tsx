import { useEffect, useMemo } from 'react';
import type { StyleItem } from '../types';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { splitPrompt } from '../utils/promptSections';
import Preview from './Preview';

interface CompareDialogProps {
  /** 参与对比的风格（按加入顺序，第一列为对其基准） */
  items: StyleItem[];
  onClose: () => void;
}

/** 对比视图列模板：首列为段落标题，其余每款风格一列 */
function gridTemplate(count: number): string {
  return `minmax(120px, 160px) repeat(${count}, minmax(0, 1fr))`;
}

/** 行标签与列标签共用一套等宽小字，避免每行都出现彩色标题 */
const rowLabelClass = 'font-mono text-[10.5px] tracking-[0.14em] text-ink-faint';

/**
 * 全屏模态对比视图：顶部名称 + 中部并排实时预览 + 下部段落横向对照。
 * 段落顺序以第一款风格为准，某款缺少该段时该列显示「—」。
 */
export default function CompareDialog({ items, onClose }: CompareDialogProps): JSX.Element {
  const panelRef = useFocusTrap<HTMLDivElement>();

  // Esc 关闭 + 锁定背景滚动（与 PromptDetail 的模态实现保持一致）
  useEffect(() => {
    const onKeydown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeydown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeydown);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  // 逐款风格的段落缓存，避免渲染时重复切分
  const sectionLists = useMemo(() => items.map((item) => splitPrompt(item.prompt)), [items]);
  const baseSections = sectionLists[0] ?? [];
  const columns = gridTemplate(items.length);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="风格对比"
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-[1400px] flex-col overflow-hidden border border-line-strong bg-surface-raised outline-none"
      >
        {/* 头部 */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <h2 className="text-[19px] font-semibold tracking-[-0.015em] text-ink">风格对比</h2>
            <p className="mt-0.5 text-[12.5px] text-ink-muted">共 {items.length} 款 · 段落按第一款风格的顺序对齐</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭对比视图"
            className="shrink-0 cursor-pointer px-1.5 py-1 text-[13px] leading-none text-ink-faint transition-colors hover:text-ink"
          >
            ✕
          </button>
        </div>

        {/* 滚动内容 */}
        <div className="overflow-y-auto px-5 py-5">
          {/* 名称 + 分类 */}
          <div className="grid gap-4" style={{ gridTemplateColumns: columns }}>
            <div className={rowLabelClass}>风格</div>
            {items.map((item) => (
              <div key={item.id}>
                <h3 className="text-[15px] font-semibold text-ink">{item.nameZh}</h3>
                <span className="mt-1 inline-block font-mono text-[10px] tracking-[0.12em] text-ink-faint">
                  {item.category}
                </span>
              </div>
            ))}
          </div>

          {/* 实时预览并排（复用既有 Preview 组件） */}
          <div className="mt-4 grid gap-4" style={{ gridTemplateColumns: columns }}>
            <div className={rowLabelClass}>预览</div>
            {items.map((item) => (
              <div key={item.id} className="overflow-hidden border border-line">
                <Preview item={item} />
              </div>
            ))}
          </div>

          {/*
            段落横向对照：行内不再加水平内边距，
            否则正文列会相对上方「预览」列的网格起点整体偏移 16px。
            改用行间细线做分隔，列锚线与上方完全一致。
          */}
          <div className="mt-6">
            {baseSections.map((section) => (
              <div
                key={section.title}
                data-compare-row={section.title}
                className="grid gap-4 border-t border-line py-4 last:border-b"
                style={{ gridTemplateColumns: columns }}
              >
                <div className={`${rowLabelClass} text-ink-muted`}>{section.title}</div>
                {items.map((item, columnIndex) => {
                  const body =
                    sectionLists[columnIndex].find((entry) => entry.title === section.title)?.body ?? '';
                  return (
                    <div key={item.id} className="text-[12.5px] leading-[1.75] whitespace-pre-wrap text-ink-muted">
                      {body === '' ? '—' : body}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
