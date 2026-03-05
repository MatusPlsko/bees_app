import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  base: "/bees/",           
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [".ngrok-free.app", ".ngrok-free.dev"],
    proxy: {
      "/api": {
        target: "http://147.175.150.184",
        changeOrigin: true,
      },
      "/bees/api": {
        target: "http://147.175.150.184",
        changeOrigin: true,
      },
    },
  },
});