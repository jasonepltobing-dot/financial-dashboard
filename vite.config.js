import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const SHEET_PATH = '/spreadsheets/d/1KKuhEQjb6X2RpvwluT4TeTayDK6ocur51YPWKlSUpN8/gviz/tq?tqx=out:csv&gid=0';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api/sheet': {
        target: 'https://docs.google.com',
        changeOrigin: true,
        rewrite: () => SHEET_PATH,
      },
    },
  },
});
