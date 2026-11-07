import { useSyncExternalStore } from "react";

import { getCommerceClient } from "@/lib/commerce/client";
import type { Cart, CartLineInput } from "@/lib/commerce/types";

export const CART_ID_STORAGE_KEY = "hydesign:shopify-cart-id";

type CartStatus = "idle" | "loading" | "updating" | "error";

type PendingCartAction =
  | { type: "load" }
  | { type: "add"; merchandiseId: string }
  | { type: "update"; lineId: string; quantity: number }
  | { type: "remove"; lineId: string };

type CartSnapshot = {
  cart: Cart | null;
  status: CartStatus;
  error: string | null;
  pendingAction: PendingCartAction | null;
};

const listeners = new Set<() => void>();

let snapshot: CartSnapshot = {
  cart: null,
  status: "idle",
  error: null,
  pendingAction: null,
};

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return snapshot;
}

function setSnapshot(nextSnapshot: CartSnapshot) {
  snapshot = nextSnapshot;
  for (const listener of listeners) listener();
}

function setStatus(
  status: CartStatus,
  pendingAction: PendingCartAction | null,
  error: string | null = null,
) {
  setSnapshot({ ...snapshot, status, error, pendingAction });
}

export function useCartStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export const cartActions = {
  async loadStoredCart() {
    const cartId = readStoredCartId();

    if (!cartId) {
      setSnapshot({ cart: null, status: "idle", error: null, pendingAction: null });
      return null;
    }

    return runCartAction("loading", { type: "load" }, async () => {
      const client = await getCommerceClient();
      const cart = await client.getCart(cartId);

      if (!cart) {
        clearStoredCartId();
        return null;
      }

      return cart;
    });
  },

  async addLine(line: CartLineInput) {
    return runCartAction(
      "updating",
      { type: "add", merchandiseId: line.merchandiseId },
      async () => {
        const client = await getCommerceClient();
        const storedCartId = readStoredCartId();
        const existingCart =
          snapshot.cart ?? (storedCartId ? await client.getCart(storedCartId) : null);

        if (storedCartId && !existingCart) clearStoredCartId();

        const cart = existingCart
          ? await client.addLine(existingCart.id, line)
          : await client.createCart(line);

        writeStoredCartId(cart.id);
        return cart;
      },
    );
  },

  async updateLine(lineId: string, quantity: number) {
    const cartId = snapshot.cart?.id ?? readStoredCartId();
    if (!cartId) return null;

    return runCartAction("updating", { type: "update", lineId, quantity }, async () => {
      const client = await getCommerceClient();
      const cart =
        quantity <= 0
          ? await client.removeLine(cartId, lineId)
          : await client.updateLine(cartId, lineId, quantity);

      writeStoredCartId(cart.id);
      return cart;
    });
  },

  async removeLine(lineId: string) {
    const cartId = snapshot.cart?.id ?? readStoredCartId();
    if (!cartId) return null;

    return runCartAction("updating", { type: "remove", lineId }, async () => {
      const client = await getCommerceClient();
      const cart = await client.removeLine(cartId, lineId);
      writeStoredCartId(cart.id);
      return cart;
    });
  },

  checkout() {
    if (typeof window !== "undefined" && snapshot.cart?.checkoutUrl) {
      window.location.assign(snapshot.cart.checkoutUrl);
    }
  },
};

async function runCartAction(
  status: CartStatus,
  pendingAction: PendingCartAction,
  action: () => Promise<Cart | null>,
) {
  setStatus(status, pendingAction);

  try {
    const cart = await action();
    setSnapshot({ cart, status: "idle", error: null, pendingAction: null });
    return cart;
  } catch {
    setSnapshot({
      ...snapshot,
      status: "error",
      error: "Cart could not be updated.",
      pendingAction: null,
    });
    return null;
  }
}

function readStoredCartId() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(CART_ID_STORAGE_KEY)?.trim() ?? "";
}

function writeStoredCartId(cartId: string) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(CART_ID_STORAGE_KEY, cartId);
  }
}

function clearStoredCartId() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(CART_ID_STORAGE_KEY);
  }
}
