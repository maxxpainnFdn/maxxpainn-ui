import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact from '@bugsnag/plugin-react'
import BugsnagPerformance from '@bugsnag/browser-performance'

Bugsnag.start({
  apiKey: '734c1846938d0ca78c21ad33646a7de3',
  plugins: [new BugsnagPluginReact()]
})

BugsnagPerformance.start({ apiKey: '734c1846938d0ca78c21ad33646a7de3' })

const ErrorBoundary = Bugsnag.getPlugin('react')
  .createErrorBoundary(React)

// Polyfill Buffer for browser

const root = createRoot(document.getElementById("root")!)

root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
)
