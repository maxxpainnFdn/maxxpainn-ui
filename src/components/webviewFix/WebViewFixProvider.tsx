import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  isAndroidWebView,
  getWebViewType,
  applyWebViewFixes,
  WebViewFixOptions,
  WebViewType,
} from './webviewUtils';

export interface WebViewFixContextValue {
  isWebView: boolean;
  webViewType: WebViewType;
}

export interface WebViewFixProviderProps extends WebViewFixOptions {
  children: ReactNode;
  /** Apply fixes even outside WebView, useful for testing (default: false) */
  forceApply?: boolean;
  /** Callback fired when WebView is detected, receives the userAgent string */
  onDetected?: (userAgent: string) => void;
}

const WebViewFixContext = createContext<WebViewFixContextValue>({
  isWebView: false,
  webViewType: null,
});

/**
 * WebViewFixProvider
 *
 * Wrap your app root with this provider. It:
 * - Detects Android WebView
 * - Adds .is-webview to <html> (picked up by your Tailwind globals.css)
 * - Fixes the viewport meta tag
 * - Shares detection state via context
 *
 * @example
 * <WebViewFixProvider>
 *   <App />
 * </WebViewFixProvider>
 */
export function WebViewFixProvider({
  children,
  fixViewport = true,
  applyHtmlClass = true,
  forceApply = false,
  onDetected,
}: WebViewFixProviderProps): JSX.Element {
  const [isWebView] = useState<boolean>(() => isAndroidWebView());
  const [webViewType] = useState<WebViewType>(() => getWebViewType());

  useEffect(() => {
    if (!isWebView && !forceApply) return;

    if (isWebView && onDetected) {
      onDetected(navigator.userAgent);
    }

    applyWebViewFixes({ fixViewport, applyHtmlClass });
  }, [isWebView, fixViewport, applyHtmlClass, forceApply, onDetected]);

  return (
    <WebViewFixContext.Provider value={{ isWebView, webViewType }}>
      {children}
    </WebViewFixContext.Provider>
  );
}

/**
 * useWebViewContext
 *
 * Access WebView detection state anywhere inside the provider tree.
 *
 * @example
 * const { isWebView, webViewType } = useWebViewContext();
 */
export function useWebViewContext(): WebViewFixContextValue {
  return useContext(WebViewFixContext);
}
