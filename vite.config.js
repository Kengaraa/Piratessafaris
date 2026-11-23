import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Piratessafaris',
        short_name: 'Piratessafaris',
        description: 'Safaris, beach holidays and tours across Kenya and beyond.',
        theme_color: '#0c2b2e',
        background_color: '#0c2b2e',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        navigateFallback: '/index.html',
        runtimeCaching: [{
          urlPattern: ({ url }) => /\.(png|jpe?g|webp|svg)$/.test(url.pathname) || url.hostname.includes('unsplash'),
          handler: 'StaleWhileRevalidate',
          options: { cacheName: 'images', expiration: { maxEntries: 80, maxAgeSeconds: 2592000 } }
        }]
      }
    })
  ]
})
