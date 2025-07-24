import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { execSync } from 'node:child_process'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import legacy from '@vitejs/plugin-legacy'
import externalGlobals from "rollup-plugin-external-globals";
import { visualizer } from "rollup-plugin-visualizer";
import { VitePWA } from 'vite-plugin-pwa'

// --- Automatic Versioning ---
// Try to get the Git commit hash as the version number, use a timestamp as a fallback.
let appVersion;
try {
  appVersion = execSync('git rev-parse --short HEAD').toString().trim();
} catch {
  console.warn('Could not get git hash, using timestamp as version.');
  appVersion = Date.now().toString();
}
console.log(`[PWA] Using version (cache key): ${appVersion}`);

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
        // --- Core Strategy: Focus on updates, no offline support ---
        
        // Do not precache anything. All resources are fetched from the network when needed.
        globPatterns: [],

        // Simplified runtime caching
        runtimeCaching: [
          {
            // For JS/CSS requests, always go to the network.
            // The Service Worker will not cache these resources to avoid version conflicts.
            urlPattern: /\.(?:js|css)$/,
            handler: 'NetworkOnly'
          },
          {
            // For static assets like images/fonts, use CacheFirst to improve performance.
            // The cache name must be versioned to ensure old assets are cleared after an update.
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|woff|woff2|eot|ttf|otf)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: `static-assets-v${appVersion}`,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ],
        
        // Navigation fallback to allow SPA routing to work correctly.
        navigateFallback: '/index.html',
        navigateFallbackAllowlist: [/.*/],

        // After each update, clean up all caches with old version numbers.
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