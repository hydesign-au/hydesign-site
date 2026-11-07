import { readFile } from "node:fs/promises";
import path from "node:path";

import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { imageSize } from "image-size";
import type { Plugin } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite-plus";

const root = import.meta.dirname;

// `photo.jpeg?photo` resolves to the file's URL and its displayed size, so layouts know a photo's
// shape without a metadata file.
function photoSize(): Plugin {
  return {
    name: "photo-size",
    enforce: "pre",
    async load(id) {
      const [file = "", query = ""] = id.split("?");
      if (!new URLSearchParams(query).has("photo")) return null;
      const { width, height, orientation = 1 } = imageSize(await readFile(file));
      const [displayWidth, displayHeight] = orientation >= 5 ? [height, width] : [width, height];
      return `import src from ${JSON.stringify(`${file}?url`)};\nexport default { src, width: ${displayWidth}, height: ${displayHeight} };`;
    },
  };
}

export default defineConfig({
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
  fmt: {
    printWidth: 100,
    sortImports: true,
    ignorePatterns: ["src/routeTree.gen.ts", "**/worker-configuration.d.ts", ".mise/locks/"],
  },
  lint: {
    ignorePatterns: [
      "node_modules/**",
      "dist/**",
      ".output/**",
      ".tanstack/**",
      "src/routeTree.gen.ts",
    ],
    env: {
      builtin: true,
      browser: true,
      node: true,
    },
    plugins: ["eslint", "typescript", "unicorn", "oxc", "import", "react"],
    categories: {
      correctness: "error",
      suspicious: "error",
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
    settings: {
      react: {
        version: "19.2.8",
      },
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-var": "error",
      "prefer-const": "error",
      "no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true },
      ],
      "react/rules-of-hooks": "error",
      "react/jsx-key": "error",
      "react/react-in-jsx-scope": "off",
      // React Compiler is not enabled. Do not reshape application or registry
      // code around diagnostics for an optimiser that is not in the build.
      "react/immutability": "off",
      "react/memo-dependencies": "off",
      "react/preserve-manual-memoization": "off",
      "react/refs": "off",
      "react/set-state-in-effect": "off",
      "react/use-memo": "off",
      "import/no-duplicates": "error",
      "import/no-self-import": "error",
      "import/no-unassigned-import": ["error", { allow: ["**/*.css"] }],
      "unicorn/consistent-function-scoping": "off",
      "typescript/no-deprecated": "warn",
    },
    overrides: [
      {
        files: [
          "src/components/ui/**/*.{ts,tsx}",
          "src/hooks/use-as-ref.ts",
          "src/hooks/use-isomorphic-layout-effect.ts",
          "src/hooks/use-lazy-ref.ts",
          "src/lib/compose-refs.ts",
          "src/lib/utils.ts",
        ],
        rules: {
          "no-shadow": "off",
          eqeqeq: "off",
          "react/display-name": "off",
          "react/jsx-props-no-spreading": "off",
          "react/no-multi-comp": "off",
          "typescript/consistent-return": "off",
          "typescript/no-unsafe-assignment": "off",
          "typescript/no-unsafe-member-access": "off",
          "typescript/no-unsafe-type-assertion": "off",
          // Some primitives extend a library prop type that resolves to `any`.
          "typescript/no-redundant-type-constituents": "off",
        },
      },
      {
        files: ["src/lib/compose-refs.ts"],
        rules: {
          "react/exhaustive-deps": "off",
          "typescript/consistent-return": "off",
        },
      },
      {
        files: ["**/*.d.ts"],
        rules: {
          "no-unused-vars": "off",
          "typescript/no-explicit-any": "off",
          "import/no-duplicates": "off",
        },
      },
      {
        files: ["scripts/**"],
        rules: {
          "no-console": "off",
        },
      },
    ],
  },
});
