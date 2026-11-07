import { MarketingHero } from "@/layout/marketing-hero";

function NotFoundPage() {
  return (
    <>
      {/* Stub background: swap for the missing/unfinished sign photo once it's in the library. */}
      <MarketingHero
        image="IMG_0331"
        title="No Sign of It"
        fullScreen
        actions={[
          { href: "/", label: "Back to Home" },
          { href: "/projects", label: "See Projects", kind: "secondary" },
        ]}
      >
        <p>
          You've hit a 404. The page you're after has moved, never existed, or the link was painted
          wrong. The rest of the site is still where we left it.
        </p>
      </MarketingHero>
    </>
  );
}

export { NotFoundPage };
