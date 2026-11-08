import type { ComponentType, ReactNode, SVGProps } from "react";

import { cn } from "@/lib/utils";

type PageSectionTone = "plain" | "muted";

type PageSectionProps = {
  children: ReactNode;
  className?: string;
  tone?: PageSectionTone;
  id?: string;
};

function PageSection({ children, className, id, tone = "plain" }: PageSectionProps) {
  return (
    <section id={id} className={cn("py-8 md:py-10", tone === "muted" && "bg-muted", className)}>
      <div className="site-container">{children}</div>
    </section>
  );
}

type PageHeaderProps = {
  title: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  align?: "start" | "center";
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
  label?: string;
  level?: 1 | 2;
};

function PageHeader({
  action,
  align = "start",
  children,
  className,
  icon: Icon,
  label,
  level = 2,
  title,
}: PageHeaderProps) {
  const Heading = level === 1 ? "h1" : "h2";

  return (
    <div className={className}>
      <div
        className={cn(
          "flex items-center gap-4",
          align === "center" ? "justify-center text-center" : "justify-between",
        )}
      >
        <div className="max-w-3xl">
          {label ? <p className="text-sm font-bold uppercase text-primary-ink">{label}</p> : null}
          <Heading
            className={cn(
              "text-3xl font-black leading-tight md:text-5xl",
              Icon && "flex items-center gap-3",
              label && "mt-3",
            )}
          >
            {Icon ? (
              <Icon
                aria-hidden
                className="size-6 -translate-y-[0.08em] shrink-0 text-primary-ink md:size-8"
              />
            ) : null}
            {title}
          </Heading>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children ? (
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
          {children}
        </p>
      ) : null}
    </div>
  );
}

export { PageHeader, PageSection };
