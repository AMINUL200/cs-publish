import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  define: {},
  plugins: [react()],
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    }
  } ,
  //  server: {
  //   proxy: {
  //     '/api': {
  //       target: 'https://crm-api.skilledworkerscloud.co.uk',
  //       changeOrigin: true,
  //       secure: false,
  //       rewrite: (path) => path.replace(/^\/api/, '/cs-publication/public/api') // ✅ Correct rewrite
  //     }
  //   }
  // }
})
