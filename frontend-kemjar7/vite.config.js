import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'cs7.netlabdte.com', // ⬅️ tambahkan ini
      'localhost'
    ],
    host: '0.0.0.0', 
  }
})
