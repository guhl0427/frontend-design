import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * 模态层焦点管理（WCAG 2.1 键盘可访问性）：
 * 1. 打开时把焦点移入面板内首个可聚焦元素；
 * 2. 按 Tab / Shift+Tab 时在面板内循环（焦点陷阱），不允许逃逸到背景；
 * 3. 关闭时把焦点归还给打开它的触发元素。
 *
 * 用法：`const panelRef = useFocusTrap<HTMLDivElement>();` 再把 ref 挂到面板根节点（建议加 tabIndex={-1}）。
 */
export function useFocusTrap<T extends HTMLElement>(): RefObject<T> {
  const panelRef = useRef<T>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const previous = document.activeElement as HTMLElement | null;

    const getFocusable = (): HTMLElement[] => {
      if (!panel) return [];
      return Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => el.getClientRects().length > 0,
      );
    };

    // 1. 初始聚焦
    const initial = getFocusable();
    (initial[0] ?? panel)?.focus();

    // 2. 焦点陷阱
    const onKeydown = (event: KeyboardEvent): void => {
      if (event.key !== 'Tab') return;
      const list = getFocusable();
      if (list.length === 0) {
        event.preventDefault();
        return;
      }
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement;
      if (!panel?.contains(active)) {
        event.preventDefault();
        first.focus();
        return;
      }
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeydown, true);

    // 3. 焦点归还
    return () => {
      document.removeEventListener('keydown', onKeydown, true);
      if (previous?.isConnected) {
        previous.focus();
      }
    };
  }, []);

  return panelRef;
}
