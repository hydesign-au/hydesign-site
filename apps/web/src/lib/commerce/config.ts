type DisabledCommerceConfig = {
  shopEnabled: false;
};

export type StorefrontCommerceConfig = {
  shopEnabled: true;
  storeDomain: string;
  storefrontAccessToken: string;
};

export type CommerceConfig = DisabledCommerceConfig | StorefrontCommerceConfig;
