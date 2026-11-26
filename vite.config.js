import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.jpeg'],
      manifest: {
        name: 'Piratessafaris',
        short_name: 'Piratessafaris',
        description: 'Safaris, beach holidays and tours across Kenya and beyond.',
        theme_color: '#0c2b2e',
        background_color: '#0c2b2e',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/logo.jpeg', sizes: '192x192', type: 'image/jpeg' },
          { src: '/logo.jpeg', sizes: '512x512', type: 'image/jpeg' },
          { src: '/logo.jpeg', sizes: '512x512', type: 'image/jpeg', purpose: 'maskable' }
        ]
      },
      workbox: {
        navigateFallback: '/index.html',
        runtimeCaching: [{
          urlPattern: ({ url }) => /\.(png|jpe?g|webp|svg)$/.test(url.pathname) || url.hostname.includes('unsplash'),
          handler: 'NetworkFirst',
          options: { cacheName: 'images', expiration: { maxEntries: 80, maxAgeSeconds: 86400 } }
        }]
      }
    })
  ]
})