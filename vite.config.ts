import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const devSecurityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    headers: devSecurityHeaders,
    hmr: {
      overlay: false,
    },
    proxy: {
      '/api/youtube-channel': {
        target: 'https://www.youtube.com',
        changeOrigin: true,
        rewrite: () => '/@ingresso-com',
      },
      '/api/yt-channel': {
        target: 'https://www.youtube.com',
        changeOrigin: true,
        rewrite: (path: string) => {
          const handle = decodeURIComponent(path.replace(/^\/api\/yt-channel\/?/, ''));
          return handle.startsWith('@') ? `/${handle}` : `/@${handle}`;
        },
      },
    },
  },
  preview: {
    headers: devSecurityHeaders,
    proxy: {
      '/api/youtube-channel': {
        target: 'https://www.youtube.com',
        changeOrigin: true,
        rewrite: () => '/@ingresso-com',
      },
      '/api/yt-channel': {
        target: 'https://www.youtube.com',
        changeOrigin: true,
        rewrite: (path: string) => {
          const handle = decodeURIComponent(path.replace(/^\/api\/yt-channel\/?/, ''));
          return handle.startsWith('@') ? `/${handle}` : `/@${handle}`;
        },
      },
    },
  },
  build: {
    assetsDir: 'assets',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        assetFileNames: assetInfo => {
          const name = assetInfo.names?.[0] ?? assetInfo.name ?? '';

          if (/^(favicon|icon-).*\.(ico|png)$/i.test(name)) {
            return `[name][extname]`;
          }

          if (/\.(png|jpe?g|svg|gif|tiff|bmp)$/i.test(name)) {
            return `images/[name]-[hash][extname]`;
          }

          if (/\.css$/i.test(name)) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['framer-motion', 'lucide-react'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'lucide-react'],
  },
});
