import path from "node:path";

import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const root = import.meta.dirname;
const repoRoot = path.resolve(root, "../..");
// The photo library lives at the repo root, owned by the media manager; the web
// app imports its canonical sources as Worker static assets through this alias.
const mediaLibrary = path.resolve(repoRoot, "media");

export default defineConfig(({ command }) => {
  // Cloudflare only transforms images on hosts in the hydesign.com.au zone. Workers
  // Builds previews of branches other than main run on workers.dev, where
  // /cdn-cgi/image/ URLs fail, so those builds keep the canonical photo URLs.
  const workersPreviewBuild =
    process.env.WORKERS_CI === "1" && process.env.WORKERS_CI_BRANCH !== "main";

  return {
    define: {
      "import.meta.env.CLOUDFLARE_IMAGES": JSON.stringify(
        command === "build" && !workersPreviewBuild,
      ),
    },
    plugins: [
      tailwindcss(),
      VitePWA({
        injectRegister: false,
        manifestFilename: "manifest.json",
        includeAssets: ["favicon.svg", "favicon-16.png", "favicon-32.png", "apple-touch-icon.png"],
        workbox: {
          globPatterns: [],
        },
        manifest: {
          name: "HyDesign",
          short_name: "HyDesign",
          description: "Printing and signwriting in Langwarrin, Melbourne.",
          start_url: "/",
          display: "browser",
          background_color: "#efe7db",
          theme_color: "#efe7db",
          icons: [
            { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
            { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
          ],
        },
      }),
      cloudflare({ viteEnvironment: { name: "ssr" } }),
      tanstackStart({
        prerender: {
          enabled: true,
          crawlLinks: true,
          filter: ({ path: pathname }) =>
            pathname !== "/" &&
            pathname !== "/cart" &&
            pathname !== "/robots.txt" &&
            !pathname.endsWith("/") &&
            !pathname.startsWith("/contact") &&
            !pathname.startsWith("/shop"),
        },
      }),
      react(),
    ],
    optimizeDeps: {
      include: ["embla-carousel-autoplay", "embla-carousel-react"],
    },
    server: {
      port: 3000,
      strictPort: true,
    },
    resolve: {
      alias: {
        "@": path.resolve(root, "./src"),
        "@media": mediaLibrary,
      },
    },
  };
});
