import type { Cart, Money, Product, ShopPolicy, Storefront } from "../types";

type ShopifyImage = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};

type ShopifyVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  currentlyNotInStock: boolean;
  price: Money;
  compareAtPrice: Money | null;
  image: ShopifyImage | null;
  quantityRule: {
    minimum: number;
    maximum: number | null;
    increment: number;
  };
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  availableForSale: boolean;
  productType: string;
  vendor: string;
  requiresSellingPlan: boolean;
  seo: {
    title: string | null;
    description: string | null;
  };
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  featuredImage: ShopifyImage | null;
  images: {
    nodes: ShopifyImage[];
  };
  options: Array<{
    id: string;
    name: string;
    optionValues: Array<{
      id: string;
      name: string;
      swatch: {
        color: string | null;
      } | null;
    }>;
  }>;
  variants: {
    nodes: ShopifyVariant[];
  };
};

export type ShopifyShop = {
  name: string;
  description: string | null;
  customerAccountUrl: string | null;
  privacyPolicy: ShopPolicy | null;
  refundPolicy: ShopPolicy | null;
  shippingPolicy: ShopPolicy | null;
  termsOfService: ShopPolicy | null;
};

export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: {
    nodes: Array<{
      id: string;
      quantity: number;
      instructions?: {
        canRemove: boolean;
        canUpdateQuantity: boolean;
      };
      merchandise: ShopifyVariant & {
        product: {
          title: string;
          handle: string;
        };
      };
      cost: {
        totalAmount: Money;
      };
    }>;
  };
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
  };
};

export type ShopifyUserError = {
  field: string[] | null;
  message: string;
};

export function mapProduct(product: ShopifyProduct): Product {
  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description,
    availableForSale: product.availableForSale,
    productType: product.productType,
    vendor: product.vendor,
    requiresSellingPlan: product.requiresSellingPlan,
    seo: product.seo,
    priceRange: product.priceRange,
    featuredImage: product.featuredImage,
    images: product.images.nodes,
    options: product.options.map((option) => ({
      id: option.id,
      name: option.name,
      values: option.optionValues.map((value) => ({
        id: value.id,
        name: value.name,
        swatchColor: value.swatch?.color ?? null,
      })),
    })),
    variants: product.variants.nodes.map(mapVariant),
  };
}

export function mapStorefront(shop: ShopifyShop): Storefront {
  return {
    name: shop.name,
    description: shop.description,
    customerAccountUrl: shop.customerAccountUrl,
    policies: [
      shop.shippingPolicy,
      shop.refundPolicy,
      shop.privacyPolicy,
      shop.termsOfService,
    ].filter((policy): policy is ShopPolicy => policy !== null),
  };
}

export function mapCart(cart: ShopifyCart | null): Cart | null {
  if (!cart) return null;

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    lines: cart.lines.nodes.map((line) => ({
      id: line.id,
      quantity: line.quantity,
      merchandise: {
        ...mapVariant(line.merchandise),
        productTitle: line.merchandise.product.title,
        productHandle: line.merchandise.product.handle,
      },
      instructions: line.instructions ?? { canRemove: false, canUpdateQuantity: false },
      cost: line.cost,
    })),
    cost: cart.cost,
  };
}

export function assertNoShopifyUserErrors(errors: ShopifyUserError[] | undefined) {
  if (!errors || errors.length === 0) return;

  throw new Error(errors.map((error) => error.message).join("\n"));
}

function mapVariant(variant: ShopifyVariant) {
  return {
    id: variant.id,
    title: variant.title,
    availableForSale: variant.availableForSale,
    currentlyNotInStock: variant.currentlyNotInStock,
    price: variant.price,
    compareAtPrice: variant.compareAtPrice,
    image: variant.image,
    quantityRule: variant.quantityRule,
    selectedOptions: variant.selectedOptions,
  };
}
