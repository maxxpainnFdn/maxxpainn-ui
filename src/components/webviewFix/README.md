# webview-fix

A lightweight React + Tailwind CSS library to fix Android WebView rendering issues **automatically** — no extra classes needed in your JSX.

---

## How it works

1. **Detects** Android WebView via user-agent signals
2. **Adds `.is-webview`** to `<html>`
3. **Fixes viewport** meta tag
4. **globals.css** applies all CSS fixes scoped to `.is-webview` automatically

You write Tailwind classes exactly as normal. The fixes apply invisibly on top.

---

## Setup

### 1. Copy the files

Drop the `src/` folder into your project, e.g. `src/lib/webview-fix/`.

### 2. Merge into your globals.css

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* Kill font boosting */
  .is-webview * {
    -webkit-text-size-adjust: 100% !important;
    text-size-adjust: 100% !important;
  }

  /* Disable text autosizer algorithm */
  .is-webview p, .is-webview span, .is-webview div,
  .is-webview li, .is-webview td, .is-webview th,
  .is-webview a, .is-webview label, .is-webview button,
  .is-webview h1, .is-webview h2, .is-webview h3,
  .is-webview h4, .is-webview h5, .is-webview h6 {
    max-height: 999999px;
  }

  /* Remove tap flash on links and buttons */
  .is-webview a, .is-webview button {
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }

  /* Prevent WebView zoom-on-focus for inputs */
  .is-webview input, .is-webview select, .is-webview textarea {
    font-size: 16px;
  }
}
```

### 3. Wrap your app root

```tsx
// main.tsx or App.tsx
import { WebViewFixProvider } from './lib/webview-fix';

export default function App() {
  return (
    <WebViewFixProvider>
      <YourApp />
    </WebViewFixProvider>
  );
}
```

That's it. Everything is automatic from here.

---

## With React Router (re-apply on route change)

```tsx
import { WebViewFixProvider, WebViewRouteWatcher } from './lib/webview-fix';

export default function App() {
  return (
    <WebViewFixProvider>
      <BrowserRouter>
        <WebViewRouteWatcher />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </WebViewFixProvider>
  );
}
```

---

## API

### `WebViewFixProvider` props

| Prop             | Type     | Default | Description                                      |
|------------------|----------|---------|--------------------------------------------------|
| `fixViewport`    | boolean  | `true`  | Inject/fix viewport meta tag                     |
| `applyHtmlClass` | boolean  | `true`  | Add `.is-webview` to `<html>`                    |
| `forceApply`     | boolean  | `false` | Apply even in non-WebView browsers (for testing) |
| `onDetected`     | function | —       | Called with `userAgent` when WebView is found    |

### Hooks & utilities

| Export | Description |
|---|---|
| `useWebViewFix(options)` | Hook version of the provider, for per-page use |
| `useWebViewContext()` | Read `{ isWebView, webViewType }` anywhere in the tree |
| `isAndroidWebView()` | Returns `boolean` — raw detection function |
| `getWebViewType()` | Returns `'android-wv' \| 'android-legacy' \| 'react-native' \| null` |
| `applyWebViewFixes(options)` | Apply fixes manually |
| `removeWebViewFixes()` | Remove `.is-webview` from `<html>` |

---

## Testing on desktop

```tsx
<WebViewFixProvider forceApply={true}>
  <App />
</WebViewFixProvider>
```

Inspect your browser — `<html class="is-webview">` will appear and all CSS fixes will activate so you can verify the layout.
