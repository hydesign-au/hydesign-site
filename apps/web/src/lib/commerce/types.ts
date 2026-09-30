export type Money = {
  amount: string;
  currencyCode: string;
};

export type ProductImage = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};

export type ProductOptionValue = {
  id: string;
  name: string;
  swatchColor: string | null;
};

export type ProductOption = {
  id: string;
  name: string;
  values: ProductOptionValue[];
};

export type SelectedOption = {
  name: string;
  value: string;
};

export type QuantityRule = {
  minimum: number;
  maximum: number | null;
  increment: number;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  currentlyNotInStock: boolean;
  price: Money;
  compareAtPrice: Money | null;
  image: ProductImage | null;
  quantityRule: QuantityRule;
  selectedOptions: SelectedOption[];
};

export type ProductSeo = {
  title: string | null;
  description: string | null;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  availableForSale: boolean;
  productType: string;
  vendor: string;
  requiresSellingPlan: boolean;
  seo: ProductSeo;
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  featuredImage: ProductImage | null;
  images: ProductImage[];
  options: ProductOption[];
  variants: ProductVariant[];
};

export type ShopPolicy = {
  title: string;
  url: string;
};

export type Storefront = {
  name: string;
  description: string | null;
  customerAccountUrl: string | null;
  policies: ShopPolicy[];
};

export type CartLine = {
  id: string;
  quantity: number;
  merchandise: ProductVariant & {
    productTitle: string;
    productHandle: string;
  };
  instructions: {
    canRemove: boolean;
    canUpdateQuantity: boolean;
  };
  cost: {
    totalAmount: Money;
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: CartLine[];
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
  };
};

export type CartLineInput = {
  merchandiseId: string;
  quantity: number;
};

export interface CommerceClient {
  getStorefront(): Promise<Storefront>;
  listProducts(): Promise<Product[]>;
  getProduct(handle: string): Promise<Product | null>;

  getCart(cartId: string): Promise<Cart | null>;
  createCart(line?: CartLineInput): Promise<Cart>;
  addLine(cartId: string, line: CartLineInput): Promise<Cart>;
  updateLine(cartId: string, lineId: string, quantity: number): Promise<Cart>;
  removeLine(cartId: string, lineId: string): Promise<Cart>;
}
