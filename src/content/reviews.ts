import { siteSettings } from "./site";

export type CustomerReview = {
  authorName: string;
  rating: number;
  text: string;
  // Where the review came from, shown on the card (e.g. "Google").
  source: string;
};

export type CustomerReviewsData = {
  googleMapsUrl: string;
  rating: number;
  reviewCount: number;
  reviews: CustomerReview[];
};

export const customerReviews = {
  googleMapsUrl: siteSettings.googleReviewUrl,
  rating: 5,
  reviewCount: 8,
  reviews: [
    {
      authorName: "Sam Martin",
      rating: 5,
      text: "WOW! Trevor was great to work with on our design for vinyl wrapping our caravan panels. Fantastic communication and assistance with scaling to fit the requirements of our caravan. We are very happy with the end result.",
      source: "Google",
    },
    {
      authorName: "Energy Fabricator",
      rating: 5,
      text: "Painted our logo on our site container. great communication, great price, great job & done on time! Thanks :)",
      source: "Google",
    },
    {
      authorName: "Eliza Quinn",
      rating: 5,
      text: "Trevor was great to work with! He was very helpful in providing options and ideas and the final result looks great!",
      source: "Google",
    },
    {
      authorName: "lisa attard",
      rating: 5,
      text: "Friendly, fast, efficient service. Quality of work was of high standard, would highly recommend Trevor. Lisa - Lima & Co",
      source: "Google",
    },
    {
      authorName: "Kylie White",
      rating: 5,
      text: "Great communication and service",
      source: "Google",
    },
  ],
} satisfies CustomerReviewsData;
