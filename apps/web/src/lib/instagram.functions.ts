import { createServerFn } from "@tanstack/react-start";

import type { InstagramFeedResponse } from "@/lib/instagram";
import { loadInstagramFeed } from "@/lib/instagram.server";

const disabledFeed: InstagramFeedResponse = {
  enabled: false,
  profile: null,
  posts: [],
};

const getInstagramFeed = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const feed = await loadInstagramFeed();
    if (!feed?.enabled) return disabledFeed;

    return {
      ...feed,
      posts: feed.posts.slice(0, 8),
    } satisfies InstagramFeedResponse;
  } catch (error) {
    console.error("Instagram feed fetch failed", {
      message: error instanceof Error ? error.message : String(error),
    });
    return disabledFeed;
  }
});

export { getInstagramFeed };
