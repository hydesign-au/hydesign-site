import autoplayPlugin from "embla-carousel-autoplay";
import { ArrowRightIcon } from "lucide-react";
import { useMemo } from "react";
import { siGoogle } from "simple-icons";

import { MotionReveal } from "@/components/motion-reveal";
import { PageHeader, PageSection } from "@/components/page-section";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Rating, RatingItem } from "@/components/ui/rating";
import { customerReviews, type CustomerReview } from "@/content";
import { cn } from "@/lib/utils";

// Adapted from https://www.shadcnblocks.com/block/testimonial9.
// License: https://www.shadcnblocks.com/license (Free Blocks: https://www.shadcnblocks.com/terms).
function ReviewsSection() {
  const autoplay = useMemo(
    () =>
      autoplayPlugin({
        delay: 6000,
        stopOnMouseEnter: true,
        stopOnInteraction: false,
        rootNode: (root) => root.parentElement,
        breakpoints: { "(prefers-reduced-motion: reduce)": { active: false } },
      }),
    [],
  );

  return (
    <PageSection id="reviews" className="scroll-mt-24 pb-0 md:pb-0">
      <MotionReveal>
        <PageHeader
          title="Reviews"
          action={
            <a
              href={customerReviews.googleMapsUrl}
              className={cn(buttonVariants({ variant: "outline", className: "group" }))}
            >
              Google Reviews
              <ArrowRightIcon
                data-icon="inline-end"
                className="motion-safe:transition-transform motion-safe:group-hover/button:translate-x-1 motion-safe:group-focus-within/button:translate-x-1"
              />
            </a>
          }
        />
      </MotionReveal>
      <MotionReveal>
        <Carousel
          className="mt-4 [&>[data-slot=carousel-content]]:[mask-image:linear-gradient(to_right,transparent,black_0.75rem,black_calc(100%_-_0.75rem),transparent)]"
          opts={{ align: "start", loop: true }}
          plugins={[autoplay]}
          onFocusCapture={() => autoplay.stop()}
          aria-label="Customer reviews"
        >
          <CarouselContent className="ml-0 items-center">
            {customerReviews.reviews.map((review) => (
              <CarouselItem key={review.authorName} className="pl-0 md:basis-1/2 lg:basis-1/3">
                <div className="px-3.5 py-1">
                  <ReviewCard review={review} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious variant="glass" className="left-0" />
          <CarouselNext variant="glass" className="right-0" />
        </Carousel>
      </MotionReveal>
    </PageSection>
  );
}

function ReviewCard({ review }: { review: CustomerReview }) {
  return (
    <Card className="[--card-spacing:--spacing(5)]">
      <CardHeader>
        <div className="row-span-2 flex min-w-0 items-center gap-3">
          <Avatar size="lg" aria-hidden>
            <AvatarFallback>{initials(review.authorName)}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col gap-1">
            <CardTitle>{review.authorName}</CardTitle>
            <Rating
              value={review.rating}
              size="sm"
              readOnly
              aria-label={`${review.rating} out of 5 stars`}
            >
              {Array.from({ length: 5 }, (_, index) => (
                <RatingItem
                  key={index}
                  index={index}
                  aria-label={`${index + 1} ${index === 0 ? "star" : "stars"}`}
                />
              ))}
            </Rating>
          </div>
        </div>
        {review.source === "Google" ? (
          <CardAction>
            <svg
              aria-hidden
              className="size-4 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d={siGoogle.path} />
            </svg>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent>
        <blockquote className="leading-7 text-muted-foreground">{review.text}</blockquote>
      </CardContent>
    </Card>
  );
}

// First letters of the first two words: "Sam Martin" -> "SM", "lisa attard" -> "LA".
function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export { ReviewsSection };
