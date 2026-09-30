import { Button } from "@hydesign/ui/components/button";
import { useSidebar } from "@hydesign/ui/components/sidebar";
import { cn } from "@hydesign/ui/lib/utils";
import { MenuIcon } from "lucide-react";

function MobileNavTrigger({ className }: { className?: string }) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-lg"
      className={cn("size-9", className)}
      aria-label="Open navigation"
      onClick={toggleSidebar}
    >
      <MenuIcon />
    </Button>
  );
}

export { MobileNavTrigger };
