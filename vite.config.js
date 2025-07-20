import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { execSync } from 'node:child_process'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import legacy from '@vitejs/plugin-legacy'
import externalGlobals from "rollup-plugin-external-globals";
import { visualizer } from "rollup-plugin-visualizer";
import { VitePWA } from 'vite-plugin-pwa'

// --- 自動版本控制 ---
// 嘗試取得 Git commit hash 作為版本號，如果失敗則使用時間戳
let appVersion;
try {
  appVersion = execSync('git rev-parse --short HEAD').toString().trim();
} catch (e) {
  console.warn('Could not get git hash, using timestamp as version.');
  appVersion = Date.now().toString();
}
console.log(`[PWA] Using version (cache key): ${appVersion}`);
// --------------------

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    allowedHosts: true
  },
  plugins: [
    vue(), 
    vueDevTools(),
    legacy({
      targets: ['defaults']
    }),
    mode === 'analyze' && visualizer({
      emitFile: true,
      filename: "stats.html",
    }),
    VitePWA({ 
      registerType: 'prompt',
      workbox: {
        clientsClaim: true,
        // --- 策略核心：移除離線，專注更新 ---
        
        // 1. 不預快取任何東西。所有資源都在需要時從網路獲取。
        globPatterns: [],

        // 2. 簡化執行階段快取
        runtimeCaching: [
          {
            // 對 JS/CSS 請求，永遠走網路。
            // Service Worker 不會快取這些資源，避免版本錯亂。
            urlPattern: /\.(?:js|css)$/,
            handler: 'NetworkOnly'
          },
          {
            // 對圖片/字體等靜態資源，使用 CacheFirst 提升效能。
            // 快取名稱必須版本化，確保更新後舊資源被清除。
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|woff|woff2|eot|ttf|otf)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: `static-assets-v${appVersion}`,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30天
              }
            }
          }
        ],
        
        // 3. 導覽回退，讓 SPA 路由正常工作
        navigateFallback: '/index.html',
        navigateFallbackAllowlist: [/.*/],

        // 4. 每次更新後，清理所有帶舊版本號的快取
        cleanupOutdatedCaches: true
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      external: ['vue'],
      output: {
        manualChunks(id) {
          const extensions = ['.js', '.ts', '.mjs'];
          if (id.includes('node_modules') && extensions.some(ext => id.endsWith(ext))) {
            return 'packages';
          }
        }
      },
      plugins: [ 
        externalGlobals({
          vue: "Vue",
        })
      ],
    },
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    }
  }
}))