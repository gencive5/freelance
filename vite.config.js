import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({


    build:
    {
        outDir: 'dist', // Output in the dist/ folder
        emptyOutDir: true, // Empty the folder first
        sourcemap: true // Add sourcemap
    },

  server: {
    host: '0.0.0.0',
    port: 3000,
    hmr: {
      overlay: true, // Shows error overlays
      protocol: 'ws', // WebSocket protocol
      host: '172.17.172.108',
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
  plugins: [
    react()
  ]
})


