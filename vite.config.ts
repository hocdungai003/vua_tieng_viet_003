import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base:'/vua_tieng_viet_003/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
