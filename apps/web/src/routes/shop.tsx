import { Outlet, createFileRoute, notFound } from "@tanstack/react-router";

import { revalidateCacheHeaders } from "@/lib/http-cache";

export const Route = createFileRoute("/shop")({
  headers: () => revalidateCacheHeaders,
  beforeLoad: ({ context }) => {
    if (!context.commerce.shopEnabled) throw notFound();
  },
  component: ShopLayout,
});

function ShopLayout() {
  return <Outlet />;
}
