import { useCallback, useEffect, useState } from 'react';

export type ThemeMode = 'dark' | 'light';

export const THEME_STORAGE_KEY = 'style-gallery:theme';

const THEME_COLORS: Record<ThemeMode, string> = {
  dark: '#0b0b0e',
  light: '#f9f8f6',
};

/** 只接受白名单值；无记录、非法值或存储不可用时都保持原有 dark 外观。 */
function readTheme(): ThemeMode {
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

function applyTheme(theme: ThemeMode): void {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.classList.toggle('light', theme === 'light');
  root.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme]);
}

/** 外观主题：默认 dark，本地持久化并同步其他标签页；不写入分享 URL。 */
export function useTheme(): { theme: ThemeMode; toggleTheme: () => void } {
  const [theme, setTheme] = useState<ThemeMode>(readTheme);

  useEffect(() => {
    applyTheme(theme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // 隐私模式或配额不足时，当前页面仍可正常切换。
    }
  }, [theme]);

  useEffect(() => {
    const onStorage = (event: StorageEvent): void => {
      if (event.key === null || event.key === THEME_STORAGE_KEY) setTheme(readTheme());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleTheme = useCallback((): void => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme };
}
