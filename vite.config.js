import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Simple Stock App',
        short_name: 'StockApp',
        description: 'Tally-style simple stock taking app',
        theme_color: '#1c4a7e',
        background_color: '#f0f2f5',
        display: 'standalone',
        icons: [
          {
            src: 'https://cdn-icons-png.flaticon.com/512/2904/2904838.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://cdn-icons-png.flaticon.com/512/2904/2904838.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
