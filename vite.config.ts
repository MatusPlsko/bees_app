import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  base: "/bees/",
  
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      ".ngrok-free.app",
      ".ngrok-free.dev"
    ]
  }
});