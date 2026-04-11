import { useEffect } from 'react';
import { isAndroidWebView, applyWebViewFixes, WebViewFixOptions } from './webviewUtils';

export interface WebViewRouteWatcherProps extends WebViewFixOptions {
  /** Apply fixes even outside WebView, useful for testing (default: false) */
  forceApply?: boolean;
}

/**
 * WebViewRouteWatcher
 *
 * Place this once inside your <Router> to re-apply WebView fixes
 * on every route change. Works with React Router v5 and v6.
 * Renders nothing — purely a side-effect component.
 *
 * @example
 * <BrowserRouter>
 *   <WebViewRouteWatcher />
 *   <Routes>...</Routes>
 * </BrowserRouter>
 */
export function WebViewRouteWatcher({
  forceApply = false,
  ...fixOptions
}: WebViewRouteWatcherProps): null {
  let pathname: string | undefined;
  let search: string | undefined;

  try {
    // Dynamic require avoids a hard peer dependency on react-router-dom
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { useLocation } = require('react-router-dom');
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const location = useLocation();
    pathname = location.pathname;
    search = location.search;
  } catch {
    // Not inside a Router — silently skip route watching
  }

  useEffect(() => {
    if (!isAndroidWebView() && !forceApply) return;
    applyWebViewFixes(fixOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search]);

  return null;
}
