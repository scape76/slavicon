import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite({}), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        configure: (proxy, options) => {
          // Proxy websocket/SSE connections
          proxy.on("error", (err, req, res) => {
            console.warn("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, res) => {
            proxyReq.setHeader("Connection", "keep-alive");
            proxyReq.setHeader("Cache-Control", "no-cache");
          });
        },
      },
    },
  },
});
