import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { cspPlugin } from './build/csp-plugin.ts'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss({ optimize: true }),
    cspPlugin(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      manifest: {
        id: '/',
        name: 'BolehBeli?',
        short_name: 'BolehBeli',
        description: 'Kalkulator keputusan belanja: boleh beli atau tahan dulu?',
        lang: 'id',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#020202',
        background_color: '#020202',
        categories: ['finance', 'productivity'],
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'workbox-window': 'workbox-window/build/workbox-window.prod.mjs',
    },
  },
  define: {
    __VUE_OPTIONS_API__: false,
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
  },

  build: {
    target: 'esnext',
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (
            id.includes('node_modules/vue') ||
            id.includes('node_modules/@vue') ||
            id.includes('node_modules/pinia') ||
            id.includes('node_modules/@vueuse')
          )
            return 'vendor-vue'
          if (id.includes('node_modules/zod')) return 'vendor-ui'
        },
      },
    },
  },
})
