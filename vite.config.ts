import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({
    // Add these babel configs for better HMR
    babel: {
      plugins: [
        ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }],
      ],
    },
  })],
  server: {
    host: 'localhost',
    port: 3000,
    hmr: {
      overlay: true, // Shows error overlays
      protocol: 'ws', // WebSocket protocol
      host: 'localhost',
      port: 3000,
    },
    watch: {
      usePolling: true, // Helps with some file systems
      interval: 1000, // Polling interval
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'], // Ensure these are optimized
  },
})