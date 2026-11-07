import type {
  Money,
  Product,
  ProductImage,
  ProductVariant,
  SelectedOption,
} from "@/lib/commerce/types";

const defaultOptionName = "Title";
const defaultOptionValue = "Default Title";

function formatMoney(money: Money) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: money.currencyCode,
  }).format(Number(money.amount));
}

function productHasRealOptions(product: Product) {
  if (product.variants.length !== 1) return true;

  return product.options.some((option) => {
    const values = option.values.map((value) => value.name).filter(Boolean);
    return !(
      option.name === defaultOptionName &&
      values.length === 1 &&
      values[0] === defaultOptionValue
    );
  });
}

function getQuickAddVariant(product: Product) {
  if (productHasRealOptions(product) || product.requiresSellingPlan) return null;
  return product.variants.find((variant) => variant.availableForSale) ?? null;
}

function formatProductPrice(product: Product) {
  const minimum = formatMoney(product.priceRange.minVariantPrice);
  const hasPriceRange =
    product.priceRange.minVariantPrice.amount !== product.priceRange.maxVariantPrice.amount;

  return hasPriceRange ? `From ${minimum}` : minimum;
}

function getProductMetaDescription(product: Product) {
  const description =
    product.seo.description?.trim() ||
    product.description.trim() ||
    `Shop ${product.title} online from HyDesign. View current options, pricing and availability before checkout.`;
  if (description.length <= 160) return description;
  return `${description.slice(0, 157).trimEnd()}...`;
}

function getProductImages(product: Product): ProductImage[] {
  if (product.images.length > 0) return product.images;
  return product.featuredImage ? [product.featuredImage] : [];
}

function getVariantLabel(variant: ProductVariant) {
  return variant.title === defaultOptionValue ? "Default" : variant.title;
}

function getInitialVariant(product: Product) {
  return (
    product.variants.find((variant) => variant.availableForSale) ?? product.variants[0] ?? null
  );
}

function selectionsFromVariant(variant: ProductVariant | null) {
  return Object.fromEntries(
    (variant?.selectedOptions ?? []).map((option) => [option.name, option.value]),
  );
}

function getVariantForSelections(product: Product, selections: Record<string, string>) {
  return (
    product.variants.find((variant) =>
      variant.selectedOptions.every((option) => selections[option.name] === option.value),
    ) ?? null
  );
}

function optionValueIsAvailable(
  product: Product,
  optionName: string,
  value: string,
  selections: Record<string, string>,
) {
  return product.variants.some(
    (variant) =>
      variant.availableForSale &&
      variant.selectedOptions.every((option) =>
        option.name === optionName
          ? option.value === value
          : !selections[option.name] || option.value === selections[option.name],
      ),
  );
}

function selectedOptionsLabel(options: SelectedOption[]) {
  return options
    .filter((option) => option.value !== defaultOptionValue)
    .map((option) => option.value)
    .join(" / ");
}

function adjustQuantity(quantity: number, variant: ProductVariant, direction: -1 | 1) {
  const { increment, maximum, minimum } = variant.quantityRule;
  const next = quantity + increment * direction;
  return Math.min(maximum ?? Number.POSITIVE_INFINITY, Math.max(minimum, next));
}

export {
  formatMoney,
  formatProductPrice,
  adjustQuantity,
  getProductImages,
  getProductMetaDescription,
  getInitialVariant,
  getQuickAddVariant,
  getVariantForSelections,
  getVariantLabel,
  optionValueIsAvailable,
  productHasRealOptions,
  selectedOptionsLabel,
  selectionsFromVariant,
};
