import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' });

export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.FRONTEND_PORT,
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.BACKEND_PORT}`, // Proxy to backend server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
