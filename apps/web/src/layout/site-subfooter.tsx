import { Separator } from "@hydesign/ui/components/separator";
import { cn } from "@hydesign/ui/lib/utils";
import { Link } from "@tanstack/react-router";

import { siteSettings } from "@/content";

function SiteSubfooter({ reserveCartCorner = false }: { reserveCartCorner?: boolean }) {
  return (
    <div id="site-subfooter">
      <Separator />
      <div className="mx-auto grid max-w-7xl gap-3 px-5 py-5 text-center text-sm text-muted-foreground md:grid-cols-3 md:items-center md:px-8 md:text-left">
        <span>© 2026 {siteSettings.legalName}</span>
        <span className="md:text-center">ABN {siteSettings.abn}</span>
        <Link
          className={cn(
            "w-fit justify-self-center hover:text-primary-ink md:justify-self-end",
            reserveCartCorner && "md:mr-28",
          )}
          to="/terms-of-trade"
        >
          Terms of Trade
        </Link>
      </div>
    </div>
  );
}

export { SiteSubfooter };
