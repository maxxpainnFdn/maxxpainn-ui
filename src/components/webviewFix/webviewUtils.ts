const META_TAG_NAME = 'viewport';
export const WEBVIEW_CLASS = 'is-webview';

export type WebViewType = 'android-wv' | 'android-legacy' | 'react-native' | 'android-unknown' | null;

export interface WebViewFixOptions {
  /** Force correct viewport meta tag (default: true) */
  fixViewport?: boolean;
  /** Add .is-webview to <html> for Tailwind CSS targeting (default: true) */
  applyHtmlClass?: boolean;
}

/**
 * Detects if the current browser is an Android WebView.
 * Checks multiple signals for higher accuracy.
 */
export function isAndroidWebView(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;

  const isAndroid = /Android/.test(ua);
  if (!isAndroid) return false;

  const hasWvFlag = /wv/.test(ua);
  const isOldWebView = /Version\/\d/.test(ua) && !/Chrome\//.test(ua);
  const noChrome = !/Chrome/.test(ua);
  const hasWebViewBridge =
    typeof window !== 'undefined' &&
    ((window as any).Android !== undefined ||
      (window as any).ReactNativeWebView !== undefined);

  return hasWvFlag || isOldWebView || noChrome || hasWebViewBridge;
}

/**
 * Returns the detected WebView type for debugging.
 */
export function getWebViewType(): WebViewType {
  if (typeof navigator === 'undefined') return null;
  if (!isAndroidWebView()) return null;

  const ua = navigator.userAgent;
  if (typeof window !== 'undefined' && (window as any).ReactNativeWebView) return 'react-native';
  if (/wv/.test(ua)) return 'android-wv';
  if (/Version\/\d/.test(ua)) return 'android-legacy';
  return 'android-unknown';
}

function fixViewportMeta(): void {
  let meta = document.querySelector<HTMLMetaElement>(`meta[name="${META_TAG_NAME}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = META_TAG_NAME;
    document.head.appendChild(meta);
  }
  if (!meta.content.includes('width=device-width')) {
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0';
  }
}

/**
 * Apply all WebView fixes.
 * CSS fixes live in globals.css via Tailwind @layer base.
 * This only manages the viewport meta and the html class toggle.
 */
export function applyWebViewFixes({
  fixViewport = true,
  applyHtmlClass = true,
}: WebViewFixOptions = {}): void {
  if (fixViewport) fixViewportMeta();
  if (applyHtmlClass) {
    document.documentElement.classList.add(WEBVIEW_CLASS);
  }
}

/**
 * Remove the .is-webview class from <html>.
 */
export function removeWebViewFixes(): void {
  document.documentElement.classList.remove(WEBVIEW_CLASS);
}
