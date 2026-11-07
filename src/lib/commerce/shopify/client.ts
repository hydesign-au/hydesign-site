import { createStorefrontApiClient } from "@shopify/storefront-api-client";
import type { ClientResponse } from "@shopify/storefront-api-client";

import type { StorefrontCommerceConfig } from "../config";
import type { Cart, CommerceClient } from "../types";
import { assertNoShopifyUserErrors, mapCart, mapProduct, mapStorefront } from "./map";
import type { ShopifyCart, ShopifyProduct, ShopifyShop, ShopifyUserError } from "./map";
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  GET_CART_QUERY,
  GET_PRODUCT_QUERY,
  GET_STOREFRONT_QUERY,
  LIST_PRODUCTS_QUERY,
} from "./queries";

type GetStorefrontData = {
  shop: ShopifyShop;
};

type ListProductsData = {
  products: {
    nodes: ShopifyProduct[];
  };
};

type GetProductData = {
  product: ShopifyProduct | null;
};

type GetCartData = {
  cart: ShopifyCart | null;
};

type CartPayload = {
  cart: ShopifyCart | null;
  userErrors: ShopifyUserError[];
};

type CartCreateData = {
  cartCreate: CartPayload;
};

type CartLinesAddData = {
  cartLinesAdd: CartPayload;
};

type CartLinesUpdateData = {
  cartLinesUpdate: CartPayload;
};

type CartLinesRemoveData = {
  cartLinesRemove: CartPayload;
};

export function createShopifyCommerceClient(config: StorefrontCommerceConfig): CommerceClient {
  const client = createStorefrontApiClient({
    storeDomain: config.storeDomain,
    apiVersion: "2026-07",
    publicAccessToken: config.storefrontAccessToken,
    clientName: "hydesign-web",
  });

  async function request<TData>(operation: string, variables?: Record<string, unknown>) {
    const response = await client.request<TData>(operation, { variables });
    assertGraphQlResponse(response);
    return response.data;
  }

  return {
    async getStorefront() {
      const data = await request<GetStorefrontData>(GET_STOREFRONT_QUERY);
      return mapStorefront(data.shop);
    },
    async listProducts() {
      const data = await request<ListProductsData>(LIST_PRODUCTS_QUERY);
      return data.products.nodes.map(mapProduct);
    },
    async getProduct(handle) {
      const data = await request<GetProductData>(GET_PRODUCT_QUERY, { handle });
      return data.product ? mapProduct(data.product) : null;
    },
    async getCart(cartId) {
      const data = await request<GetCartData>(GET_CART_QUERY, { cartId });
      return mapCart(data.cart);
    },
    async createCart(line) {
      return cartFromPayload(
        await request<CartCreateData>(CART_CREATE_MUTATION, {
          lines: line ? [line] : null,
        }),
        "cartCreate",
      );
    },
    async addLine(cartId, line) {
      return cartFromPayload(
        await request<CartLinesAddData>(CART_LINES_ADD_MUTATION, {
          cartId,
          lines: [line],
        }),
        "cartLinesAdd",
      );
    },
    async updateLine(cartId, lineId, quantity) {
      return cartFromPayload(
        await request<CartLinesUpdateData>(CART_LINES_UPDATE_MUTATION, {
          cartId,
          lines: [{ id: lineId, quantity }],
        }),
        "cartLinesUpdate",
      );
    },
    async removeLine(cartId, lineId) {
      return cartFromPayload(
        await request<CartLinesRemoveData>(CART_LINES_REMOVE_MUTATION, {
          cartId,
          lineIds: [lineId],
        }),
        "cartLinesRemove",
      );
    },
  };
}

function assertGraphQlResponse<TData>(
  response: ClientResponse<TData>,
): asserts response is ClientResponse<TData> & { data: TData } {
  if (response.errors) {
    throw new Error(response.errors.message ?? "Shopify Storefront API request failed.");
  }

  if (!response.data) {
    throw new Error("Shopify Storefront API returned no data.");
  }
}

function cartFromPayload<TData extends Record<TKey, CartPayload>, TKey extends keyof TData>(
  data: TData,
  key: TKey,
): Cart {
  const payload = data[key];
  assertNoShopifyUserErrors(payload.userErrors);

  const cart = mapCart(payload.cart);
  if (!cart) throw new Error("Shopify did not return a cart.");

  return cart;
}
