import { env } from "cloudflare:workers";

type RuntimeVariable =
  | "FACEBOOK_PAGE_ACCESS_TOKEN"
  | "INSTAGRAM_BUSINESS_ACCOUNT_ID"
  | "SHOPIFY_STOREFRONT_DOMAIN"
  | "SHOPIFY_STOREFRONT_PUBLIC_ACCESS_TOKEN"
  | "TURNSTILE_SECRET_KEY"
  | "TURNSTILE_SITE_KEY";

type RuntimeEnv = Cloudflare.Env & Partial<Record<RuntimeVariable, string>>;

const runtimeEnv = env as RuntimeEnv;

function runtimeValue(name: RuntimeVariable) {
  return runtimeEnv[name]?.trim() ?? "";
}

export { runtimeEnv, runtimeValue };
