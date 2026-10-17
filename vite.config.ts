import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
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
});
