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
        navigateFallbackAllowlist: [/.*/],
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
