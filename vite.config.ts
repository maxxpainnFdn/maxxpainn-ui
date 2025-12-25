import { defineConfig, loadEnv, type UserConfig } from "vite"
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs"
import {nodePolyfills} from 'vite-plugin-node-polyfills'


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {

    const env = loadEnv(mode, process.cwd(), "")

    const useHttps = env.VITE_USE_HTTPS === "true"

    const serverConfig: UserConfig["server"] = {
      host: env.VITE_HOST || "::",
      port: parseInt(env.VITE_PORT) || 8080,
    }

    if (useHttps) {
      serverConfig.https = {
        key: fs.readFileSync(path.resolve(__dirname, env.VITE_SSL_KEY)),
        cert: fs.readFileSync(path.resolve(__dirname, env.VITE_SSL_CERT)),
      }
    }

    let config: UserConfig =  {
      server: serverConfig,
      plugins: [
        react(),
        mode === 'development' && componentTagger(),
        nodePolyfills()
      ].filter(Boolean),

      define: {
        'global': 'globalThis',
        'process.env': {},
        'process.version': JSON.stringify('v0.0.0'),
        'process.browser': JSON.stringify(true)
      },
      optimizeDeps: {
        include: ['jotai', 'jotai/utils'],
      },
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src")
        },
      },

  }

  return config;
});
