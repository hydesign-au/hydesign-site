import { createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    routeTree,
    defaultViewTransition: {
      types: ({ pathChanged }) =>
        pathChanged && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? ["page"]
          : false,
    },
    scrollRestoration: true,
    trailingSlash: "preserve",
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
