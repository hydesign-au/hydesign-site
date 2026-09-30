import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { mediaApiPlugin } from "./server/http.mjs";

const dir = import.meta.dirname;

export default defineConfig({
  server: {
    port: 4000,
    strictPort: true,
  },
  preview: {
    port: 4000,
    strictPort: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(dir, "./src"),
    },
  },
  plugins: [tailwindcss(), react(), mediaApiPlugin()],
});
