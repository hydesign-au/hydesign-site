import { createFileRoute } from "@tanstack/react-router";

import { breadcrumbSchema, seo } from "@/lib/seo";
import { TermsOfTradePage } from "@/pages/terms-of-trade";

export const Route = createFileRoute("/terms-of-trade")({
  head: () =>
    seo({
      title: "Terms of Trade",
      description:
        "HYDESIGN Aust Pty Ltd terms and conditions of trade for signage, print and related services.",
      pathname: "/terms-of-trade",
      schema: [
        breadcrumbSchema([
          { name: "Home", pathname: "/" },
          { name: "Terms of Trade", pathname: "/terms-of-trade" },
        ]),
      ],
    }),
  component: TermsOfTradePage,
});
