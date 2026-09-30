import { getCommerceConfig } from "./commerce.functions";
import type { CommerceConfig } from "./config";
import type { CommerceClient } from "./types";

let clientPromise: Promise<CommerceClient> | null = null;

export async function getCommerceClient(config?: CommerceConfig) {
  const resolvedConfig = config ?? (await getCommerceConfig());
  if (!resolvedConfig.shopEnabled) {
    throw new Error("Commerce client requested while the shop is disabled.");
  }

  clientPromise ??= createCommerceClient(resolvedConfig);
  return clientPromise;
}

async function createCommerceClient(config: CommerceConfig & { shopEnabled: true }) {
  const { createShopifyCommerceClient } = await import("./shopify/client");
  return createShopifyCommerceClient(config);
}

export type { CommerceClient } from "./types";
