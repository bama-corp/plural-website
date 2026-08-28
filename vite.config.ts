import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
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
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          
          // Preserve favicon and icon files in root
          if (/^(favicon|icon-).*\.(ico|png)$/i.test(assetInfo.name)) {
            return `[name][extname]`;
          }
          
          // Move other images to images folder
          if (/\.(png|jpe?g|svg|gif|tiff|bmp)$/i.test(assetInfo.name)) {
            return `images/[name]-[hash][extname]`;
          }
          
          if (/\.css$/i.test(assetInfo.name)) {
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
