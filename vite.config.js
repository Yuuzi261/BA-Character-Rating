import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import legacy from '@vitejs/plugin-legacy'
import externalGlobals from "rollup-plugin-external-globals";
import { visualizer } from "rollup-plugin-visualizer";
import { VitePWA } from 'vite-plugin-pwa'

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
        skipWaiting: false,
        clientsClaim: false,
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/assets\//, /^\/img\//, /^\/sw\.js$/, /^\/workbox-.*\.js$/],
        
        // 關鍵修復：添加自定義的導航處理
        navigateFallbackAllowlist: [/^(?!\/__).*/],
        
        // 修復重定向問題的運行時快取策略
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          {
            urlPattern: /\.(?:js|css)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources'
            }
          },
          // 新增：處理 SPA 路由的特殊策略
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              networkTimeoutSeconds: 3,
              plugins: [
                {
                  cacheKeyWillBeUsed: async ({ request }) => {
                    // 對於導航請求，統一使用 index.html 作為快取鍵
                    return new URL('/', request.url).href
                  }
                }
              ]
            }
          }
        ],
        
        // Ensure core files are cached
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        // Exclude files that might cause issues
        globIgnores: ['**/node_modules/**/*'],
        // Clean up outdated caches
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
