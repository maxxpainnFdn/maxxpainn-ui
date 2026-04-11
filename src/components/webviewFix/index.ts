// Types
export type { WebViewType, WebViewFixOptions } from './webviewUtils';
export type { UseWebViewFixOptions, UseWebViewFixResult } from './useWebViewFix';
export type { WebViewFixContextValue, WebViewFixProviderProps } from './WebViewFixProvider';
export type { WebViewRouteWatcherProps } from './WebViewRouteWatcher';

// Core utilities
export { isAndroidWebView, getWebViewType, applyWebViewFixes, removeWebViewFixes, WEBVIEW_CLASS } from './webviewUtils';

// Hook — use in any component
export { useWebViewFix } from './useWebViewFix';

// Provider — wrap your app root
export { WebViewFixProvider, useWebViewContext } from './WebViewFixProvider';

// Route watcher — place inside <Router> for SPA route-change fixes
export { WebViewRouteWatcher } from './WebViewRouteWatcher';
