import { runtimeValue } from "@/server/env";

import type { CommerceConfig } from "./config";

function readCommerceConfig(): CommerceConfig {
  const storeDomain = runtimeValue("SHOPIFY_STOREFRONT_DOMAIN");
  const storefrontAccessToken = runtimeValue("SHOPIFY_STOREFRONT_PUBLIC_ACCESS_TOKEN");

  if (!storeDomain || !storefrontAccessToken) {
    return { shopEnabled: false };
  }

  return {
    shopEnabled: true,
    storeDomain,
    storefrontAccessToken,
  };
}

export { readCommerceConfig };
