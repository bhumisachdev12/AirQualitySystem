import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',         // Bind to all interfaces for Docker
    port: 5173,              // Vite default port
    strictPort: true,        // Fail if port is already in use
    watch: {
      usePolling: true,      // Enable polling for Docker volumes
    },
  }
})