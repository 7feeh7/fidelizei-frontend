import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiProxyTarget =
    env.VITE_API_PROXY_TARGET ?? "http://localhost:3333";

  return {
  plugins: [react(), tsconfigPaths()],
  server: {
    proxy: {
      "/api": {
        target: apiProxyTarget,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        // separa as libs em chunks próprios (evita o aviso de chunk > 500kB)
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("@mui") || id.includes("@emotion")) return "mui";
          return "vendor";
        },
      },
    },
  },
};
});
