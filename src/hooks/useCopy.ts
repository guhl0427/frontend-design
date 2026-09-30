import { useCallback, useEffect, useRef, useState } from 'react';
import { copyToClipboard } from '../utils/clipboard';

interface UseCopyResult {
  copied: boolean;
  copy: (text: string) => Promise<void>;
}

/**
 * 复制到剪贴板并维护「已复制」反馈态。
 * 定时器在重复调用与组件卸载时均被清理，避免连点叠加定时器导致的反馈闪回。
 */
export function useCopy(): UseCopyResult {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) {
        window.clearTimeout(timer.current);
      }
    },
    [],
  );

  const copy = useCallback(async (text: string): Promise<void> => {
    const ok = await copyToClipboard(text);
    if (!ok) return;
    setCopied(true);
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
    }
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  }, []);

  return { copied, copy };
}
