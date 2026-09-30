import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    printWidth: 100,
    sortImports: true,
    ignorePatterns: ["apps/web/src/routeTree.gen.ts", "apps/web/src/content/media.gen.ts"],
  },
  lint: {
    ignorePatterns: [
      "node_modules/**",
      "dist/**",
      ".output/**",
      ".tanstack/**",
      "apps/web/src/routeTree.gen.ts",
      "apps/web/src/content/media.gen.ts",
      "apps/web/vite.app.config.ts",
      "apps/media/vite.app.config.ts",
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
        files: ["packages/ui/src/**/*.{ts,tsx}"],
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
        files: ["packages/ui/src/lib/compose-refs.ts", "packages/ui/src/components/scroll-spy.tsx"],
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
        files: ["apps/media/server/**"],
        rules: {
          "no-console": "off",
          // The Vite middleware short-circuits by returning the response helper's
          // result, then falls through to a bare next() — a mixed return by design.
          "typescript/consistent-return": "off",
        },
      },
    ],
  },
});
