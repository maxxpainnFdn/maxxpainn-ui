import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Polyfill Buffer for browser

createRoot(document.getElementById("root")!).render(<App />);
