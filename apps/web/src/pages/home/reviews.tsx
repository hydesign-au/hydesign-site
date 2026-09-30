import { buttonVariants } from "@hydesign/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@hydesign/ui/components/card";
import { Rating, RatingItem } from "@hydesign/ui/components/rating";
import { cn } from "@hydesign/ui/lib/utils";
import { ArrowRightIcon } from "lucide-react";

import { MotionReveal } from "@/components/motion-reveal";
import { customerReviews, type CustomerReview } from "@/content";
import { PageHeader, PageSection } from "@/layout/page-section";

function ReviewsSection() {
  return (
    <PageSection>
      <MotionReveal>
        <PageHeader
          title="Reviews"
          action={
            <a
              href={customerReviews.googleMapsUrl}
              className={cn(buttonVariants({ variant: "outline", className: "group" }))}
            >
              Google Reviews
              <ArrowRightIcon data-icon="inline-end" className="motion-arrow" />
            </a>
          }
        />
      </MotionReveal>
      <MotionReveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {customerReviews.reviews.slice(0, 3).map((review, index) => (
            <ReviewCard key={`${review.authorName}-${index}`} review={review} />
          ))}
        </div>
      </MotionReveal>
    </PageSection>
  );
}

function ReviewCard({ review }: { review: CustomerReview }) {
  return (
    <Card className="h-full">
      <CardHeader className="grid grid-cols-[auto_1fr] items-center gap-x-3">
        <span
          aria-hidden
          className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/15 text-sm font-bold text-primary-ink"
        >
          {initials(review.authorName)}
        </span>
        <div className="min-w-0">
          <CardTitle className="truncate font-bold">{review.authorName}</CardTitle>
          <CardDescription>via {review.source}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <Rating
          value={review.rating}
          readOnly
          aria-label={`${formatRating(review.rating)} star rating`}
        >
          {Array.from({ length: 5 }, (_, index) => (
            <RatingItem
              key={index}
              index={index}
              aria-label={`${index + 1} ${index === 0 ? "star" : "stars"}`}
            />
          ))}
        </Rating>
        <blockquote className="border-l-2 border-primary pl-4 leading-7 text-muted-foreground">
          {review.text}
        </blockquote>
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

function formatRating(rating: number) {
  return Number.isInteger(rating) ? String(rating) : rating.toFixed(1);
}

export { ReviewsSection };
