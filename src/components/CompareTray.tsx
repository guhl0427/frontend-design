import type { StyleItem } from '../types';

interface CompareTrayProps {
  /** 已加入对比集的风格（按加入顺序） */
  items: StyleItem[];
  /** 从对比集移除某款风格 */
  onRemove: (id: string) => void;
  /** 清空对比集 */
  onClear: () => void;
  /** 打开对比视图 */
  onStart: () => void;
}

/** 底部悬浮对比条：展示已选风格 chip，提供开始对比 / 清空 / 单项移除 */
export default function CompareTray({ items, onRemove, onClear, onStart }: CompareTrayProps): JSX.Element {
  // 对比集为空时整条不渲染（返回空片段，DOM 中不产生任何节点）
  if (items.length === 0) return <></>;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-surface-raised/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <span className="text-xs font-semibold tracking-[0.18em] text-ink-faint uppercase">对比集</span>

        <div className="flex min-w-0 flex-1 flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item.id}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 py-1 pr-1.5 pl-3 text-xs text-ink"
            >
              {item.nameZh}
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                aria-label={`从对比集移除「${item.nameZh}」`}
                className="cursor-pointer rounded-full px-1.5 leading-none text-ink-faint transition-colors hover:text-ink"
              >
                ✕
              </button>
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={onStart}
          className="cursor-pointer rounded-full bg-brand px-4 py-2 text-sm font-medium text-surface transition-colors hover:bg-brand/90"
        >
          开始对比（{items.length}）
        </button>
        <button
          type="button"
          onClick={onClear}
          className="cursor-pointer rounded-full border border-white/10 px-3.5 py-2 text-sm text-ink-muted transition-colors hover:border-brand/40 hover:text-ink"
        >
          清空
        </button>
      </div>
    </div>
  );
}
