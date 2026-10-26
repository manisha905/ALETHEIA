import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Custom fallback plugin to rewrite legacy .html URLs to SPA index.html
function spaFallbackPlugin() {
  return {
    name: 'spa-fallback',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && (req.url.endsWith('.html') || req.url.includes('glass_'))) {
          const urlLower = req.url.toLowerCase();
          if (urlLower.includes('login')) {
            req.url = '/?page=login';
          } else if (urlLower.includes('register')) {
            req.url = '/?page=register';
          } else {
            req.url = '/';
          }
        }
        next();
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), spaFallbackPlugin()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5080',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
