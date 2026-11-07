import type {
  DetailedHTMLProps,
  LinkHTMLAttributes,
  MetaHTMLAttributes,
  ScriptHTMLAttributes,
} from "react";

import { siteSettings } from "@/content";
import type { Product } from "@/lib/commerce/types";

/**
 * Production origin for canonical URLs and structured data. This stays the live
 * domain even in dev or preview — a canonical should always point at production,
 * not at localhost.
 */
const SITE_URL = siteSettings.url;

/** Default social share card. A real 1200x630 asset lives at public/og-default.jpg. */
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;

/** schema.org @id for the single business entity, referenced from every page. */
const BUSINESS_ID = `${SITE_URL}/#business`;

type JsonLd = Record<string, unknown>;
type MetaTag = DetailedHTMLProps<MetaHTMLAttributes<HTMLMetaElement>, HTMLMetaElement>;
type LinkTag = DetailedHTMLProps<LinkHTMLAttributes<HTMLLinkElement>, HTMLLinkElement>;
type ScriptTag = DetailedHTMLProps<ScriptHTMLAttributes<HTMLScriptElement>, HTMLScriptElement>;

type SeoInput = {
  /** Page title without the brand suffix, e.g. "Vehicle signage". */
  title: string;
  description: string;
  /** Path with a leading slash and no trailing slash, e.g. "/services/vehicle-signage". */
  pathname: string;
  /** Absolute URL to a share image; falls back to the default card. */
  image?: string;
  robots?: "index,follow" | "noindex,follow" | "noindex,nofollow";
  /** Structured data rendered as <script type="application/ld+json"> tags. */
  schema?: JsonLd[];
};

function absoluteUrl(pathname: string) {
  return pathname === "/" ? SITE_URL : `${SITE_URL}${pathname}`;
}

function withBrand(title: string) {
  return title.includes(siteSettings.name) ? title : `${title} | ${siteSettings.name}`;
}

/**
 * Builds a route's head() value: title, description, canonical, Open Graph and
 * Twitter tags, plus any JSON-LD. Site-wide constants (og:site_name, locale,
 * card type) are set once in the root route and inherited here via head merging.
 */
export function seo({ title, description, pathname, image, robots, schema }: SeoInput) {
  const url = absoluteUrl(pathname);
  const fullTitle = withBrand(title);
  const ogImage = image ?? DEFAULT_OG_IMAGE;
  const meta: MetaTag[] = [
    { title: fullTitle },
    { name: "description", content: description },
    ...(robots ? [{ name: "robots", content: robots }] : []),
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image", content: ogImage },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
  ];
  const links: LinkTag[] = [{ rel: "canonical", href: url }];
  const scripts: ScriptTag[] | undefined = schema?.map((entry) => ({
    type: "application/ld+json",
    children: JSON.stringify(entry),
  }));

  return {
    meta,
    links,
    scripts,
  };
}

/** The business itself: name, address, hours, contact and service area. */
export function localBusinessSchema(): JsonLd {
  const { addressParts, geo } = siteSettings;
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": BUSINESS_ID,
    name: siteSettings.name,
    legalName: siteSettings.legalName,
    foundingDate: String(siteSettings.foundingYear),
    url: SITE_URL,
    telephone: siteSettings.phoneHref.replace("tel:", ""),
    email: siteSettings.email,
    image: DEFAULT_OG_IMAGE,
    address: {
      "@type": "PostalAddress",
      streetAddress: addressParts.street,
      addressLocality: addressParts.locality,
      addressRegion: addressParts.region,
      postalCode: addressParts.postcode,
      addressCountry: addressParts.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: geo.latitude,
      longitude: geo.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00",
      },
    ],
    // Suburbs and regions, never whole states — Google's service-area rules want
    // cities/localities, and it matches where the work actually is.
    areaServed: ["Langwarrin", "Frankston", "Mornington Peninsula", "Melbourne"],
    sameAs: [siteSettings.facebookUrl, siteSettings.instagramUrl],
  };
}

/** Site identity, tied back to the business as publisher. */
export function websiteSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: siteSettings.name,
    publisher: { "@id": BUSINESS_ID },
  };
}

/** A single service offering, provided by the business. */
export function serviceSchema(service: {
  slug: string;
  title: string;
  metaDescription: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.metaDescription,
    serviceType: service.title,
    url: `${SITE_URL}/services/${service.slug}`,
    provider: { "@id": BUSINESS_ID },
    // Same locality list as the LocalBusiness block, so the service-level signal
    // carries Langwarrin and Frankston too.
    areaServed: ["Langwarrin", "Frankston", "Mornington Peninsula", "Melbourne"],
  };
}

/** Shopify-backed product and offer data for product rich results. */
export function productSchema(product: Product): JsonLd {
  const url = absoluteUrl(`/shop/${product.handle}`);
  const image = product.images.map((entry) => entry.url);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    url,
    ...(image.length > 0 ? { image } : {}),
    ...(product.vendor ? { brand: { "@type": "Brand", name: product.vendor } } : {}),
    offers: product.variants.map((variant) => ({
      "@type": "Offer",
      url,
      price: variant.price.amount,
      priceCurrency: variant.price.currencyCode,
      availability: variant.availableForSale
        ? variant.currentlyNotInStock
          ? "https://schema.org/BackOrder"
          : "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@id": BUSINESS_ID },
    })),
  };
}

/** Breadcrumb trail for a page, ordered root-first. */
export function breadcrumbSchema(items: Array<{ name: string; pathname: string }>): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.pathname),
    })),
  };
}
