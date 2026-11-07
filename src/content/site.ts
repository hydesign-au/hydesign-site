export const siteSettings = {
  name: "HyDesign",
  legalName: "HYDESIGN AUST PTY LTD",
  abn: "29 613 229 468",
  // Established 1980: "over 45 years" in current prose, "Est. 1980" as the compact form.
  foundingYear: 1980,
  url: "https://hydesign.com.au",
  phone: "0410 544 641",
  phoneHref: "tel:+61410544641",
  email: "signs@hydesign.com.au",
  emailHref: "mailto:signs@hydesign.com.au",
  address: "117 Aqueduct Road, Langwarrin VIC 3910",
  addressParts: {
    street: "117 Aqueduct Road",
    locality: "Langwarrin",
    region: "VIC",
    postcode: "3910",
    country: "AU",
  },
  geo: { latitude: -38.1608977, longitude: 145.1927842 },
  serviceArea: "Frankston, the Mornington Peninsula and Melbourne",
  hours: "Monday to Friday, 9 am to 5 pm.",
  // Shown with the address wherever it appears.
  visitPolicy: "Appointment only.",
  // The Shopify storefront the nav "Shop" item points at. Owner input needed for the
  // real URL; while null the Shop item stays out of navigation entirely.
  shopUrl: null as string | null,
  googleReviewUrl: "https://g.page/HYDESIGN/review/",
  facebookUrl: "https://www.facebook.com/HyDesignAu/",
  instagramUrl: "https://www.instagram.com/hydesign_au/",
} as const;
