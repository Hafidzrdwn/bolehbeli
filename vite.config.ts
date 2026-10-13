import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (
            id.includes('node_modules/vue') ||
            id.includes('node_modules/pinia') ||
            id.includes('node_modules/@vueuse')
          )
            return 'vendor-vue'
          if (id.includes('node_modules/reka-ui') || id.includes('node_modules/zod'))
            return 'vendor-ui'
        },
      },
    },
  },
})
