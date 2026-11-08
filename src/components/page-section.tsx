import type { ReactNode } from "react";

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
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
  label?: string;
  level?: 1 | 2;
};

function PageHeader({ action, children, className, label, level = 2, title }: PageHeaderProps) {
  const Heading = level === 1 ? "h1" : "h2";

  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-4">
        <div className="max-w-3xl">
          {label ? <p className="text-sm font-bold uppercase text-primary-ink">{label}</p> : null}
          <Heading className={cn("text-3xl font-black leading-tight md:text-5xl", label && "mt-3")}>
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
