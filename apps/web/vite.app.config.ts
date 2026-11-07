import { readFile } from "node:fs/promises";
import path from "node:path";

import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { imageSize } from "image-size";
import { defineConfig, type Plugin } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const root = import.meta.dirname;

// `photo.jpeg?photo` resolves to the file's URL and its displayed size, so layouts know a photo's
// shape without a metadata file.
function photoSize(): Plugin {
  return {
    name: "photo-size",
    enforce: "pre",
    async load(id) {
      const [file = "", query = ""] = id.split("?");
      if (!new URLSearchParams(query).has("photo")) return;
      const { width, height, orientation = 1 } = imageSize(await readFile(file));
      const [displayWidth, displayHeight] = orientation >= 5 ? [height, width] : [width, height];
      return `import src from ${JSON.stringify(`${file}?url`)};\nexport default { src, width: ${displayWidth}, height: ${displayHeight} };`;
    },
  };
}

export default defineConfig(({ command }) => {
  return {
    define: {
      // Cloudflare resizes photos on hydesign.com.au hosts, previews included. The dev server
      // serves the files as they are.
      "import.meta.env.CLOUDFLARE_IMAGES": JSON.stringify(command === "build"),
    },
    plugins: [
      photoSize(),
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
      },
    },
  };
});
