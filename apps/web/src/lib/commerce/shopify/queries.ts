const PRODUCT_FRAGMENT = `#graphql
  fragment ProductFields on Product {
    id
    handle
    title
    description
    availableForSale
    productType
    vendor
    requiresSellingPlan
    seo {
      title
      description
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 10) {
      nodes {
        url
        altText
        width
        height
      }
    }
    options {
      id
      name
      optionValues {
        id
        name
        swatch {
          color
        }
      }
    }
    variants(first: 20) {
      nodes {
        id
        title
        availableForSale
        currentlyNotInStock
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        image {
          url
          altText
          width
          height
        }
        quantityRule {
          minimum
          maximum
          increment
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
`;

const CART_FRAGMENT = `#graphql
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    lines(first: 100) {
      nodes {
        id
        quantity
        ... on CartLine {
          instructions {
            canRemove
            canUpdateQuantity
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            availableForSale
            currentlyNotInStock
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            image {
              url
              altText
              width
              height
            }
            quantityRule {
              minimum
              maximum
              increment
            }
            selectedOptions {
              name
              value
            }
            product {
              title
              handle
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
    }
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
  }
`;

export const GET_STOREFRONT_QUERY = `#graphql
  query GetStorefront {
    shop {
      name
      description
      customerAccountUrl
      privacyPolicy {
        title
        url
      }
      refundPolicy {
        title
        url
      }
      shippingPolicy {
        title
        url
      }
      termsOfService {
        title
        url
      }
    }
  }
`;

export const LIST_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_FRAGMENT}
  query ListProducts {
    products(first: 24) {
      nodes {
        ...ProductFields
      }
    }
  }
`;

export const GET_PRODUCT_QUERY = `#graphql
  ${PRODUCT_FRAGMENT}
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
`;

export const GET_CART_QUERY = `#graphql
  ${CART_FRAGMENT}
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
`;

export const CART_CREATE_MUTATION = `#graphql
  ${CART_FRAGMENT}
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_ADD_MUTATION = `#graphql
  ${CART_FRAGMENT}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_UPDATE_MUTATION = `#graphql
  ${CART_FRAGMENT}
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_REMOVE_MUTATION = `#graphql
  ${CART_FRAGMENT}
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;
