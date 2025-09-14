/// <reference types="node" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      port: 5173, // You can change this port if needed
      proxy: {
        // Proxy API requests
        // Any request to /api/... in your frontend code will be forwarded
        // to the target specified in the environment variable
        // For example, /api/books?page=0 becomes http://<VITE_API_PREFIX>/books?page=0
        '/api': {
          target: env.VITE_API_PREFIX, // Use environment variable
          changeOrigin: true, // Recommended for most cases
          rewrite: (path) => path.replace(/^\/api/, ''), // Removes /api prefix before forwarding
        },
      },
    },
  };
});