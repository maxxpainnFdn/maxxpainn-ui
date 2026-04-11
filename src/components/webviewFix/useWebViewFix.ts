import { useEffect } from 'react';
import { isAndroidWebView, applyWebViewFixes, removeWebViewFixes, WebViewFixOptions } from './webviewUtils';

export interface UseWebViewFixOptions extends WebViewFixOptions {
  /** Apply fixes even outside WebView, useful for testing (default: false) */
  forceApply?: boolean;
  /** Callback fired when WebView is detected, receives the userAgent string */
  onDetected?: (userAgent: string) => void;
}

export interface UseWebViewFixResult {
  isWebView: boolean;
}

/**
 * useWebViewFix
 *
 * Drop-in hook that detects Android WebView, adds .is-webview to <html>,
 * and fixes the viewport meta on every mount / route change.
 *
 * Pair with globals.css for the actual CSS fixes via Tailwind @layer base.
 *
 * @example
 * const { isWebView } = useWebViewFix();
 */
export function useWebViewFix({
  fixViewport = true,
  applyHtmlClass = true,
  forceApply = false,
  onDetected,
}: UseWebViewFixOptions = {}): UseWebViewFixResult {
  const isWebView = isAndroidWebView();

  useEffect(() => {
    if (!isWebView && !forceApply) return;

    if (isWebView && onDetected) {
      onDetected(navigator.userAgent);
    }

    applyWebViewFixes({ fixViewport, applyHtmlClass });

    return () => {
      removeWebViewFixes();
    };
  }, [isWebView, fixViewport, applyHtmlClass, forceApply, onDetected]);

  return { isWebView };
}
