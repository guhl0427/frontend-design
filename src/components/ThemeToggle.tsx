import type { JSX } from 'react';
import type { ThemeMode } from '@/hooks/useTheme';

interface ThemeToggleProps {
  theme: ThemeMode;
  onToggle: () => void;
}

/** 显示点击后将启用的模式；图标与文字并列，不依赖颜色传达当前状态。 */
export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps): JSX.Element {
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  const label = nextTheme === 'light' ? '浅色' : '深色';

  return (
    <button
      type="button"
      data-theme-toggle
      data-theme={theme}
      onClick={onToggle}
      aria-label={`切换到${label}模式`}
      title={`切换到${label}模式`}
      className="flex min-h-7 shrink-0 cursor-pointer items-center gap-1.5 px-2 py-1 font-mono text-[11px] text-ink-faint transition-colors hover:bg-surface-hover hover:text-ink"
    >
      <span aria-hidden="true" className="text-[15px] leading-none">
        {theme === 'dark' ? '☼' : '☾'}
      </span>
      <span>{label}</span>
    </button>
  );
}
