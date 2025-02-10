import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',  // Ensure build output is in 'dist'
  },
  server: {
    historyApiFallback: true, // Fix refresh issue locally
  },
  preview: {
    historyApiFallback: true, // Fix refresh issue in Vercel preview deployments
  }
});
