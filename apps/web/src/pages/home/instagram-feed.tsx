import { cn } from "@hydesign/ui/lib/utils";
import { ImagesIcon, PlayIcon } from "lucide-react";

import { MotionReveal } from "@/components/motion-reveal";
import { siteSettings } from "@/content";
import { PageHeader, PageSection } from "@/layout/page-section";
import type { InstagramFeedResponse, InstagramPost, InstagramProfile } from "@/lib/instagram";

function InstagramFeedSection({ feed }: { feed: InstagramFeedResponse }) {
  if (!feed.enabled || feed.posts.length === 0) {
    return null;
  }

  const instagramHref =
    feed.profile.username.length > 0
      ? `https://www.instagram.com/${feed.profile.username}/`
      : siteSettings.instagramUrl;

  return (
    <PageSection compact>
      <MotionReveal>
        <PageHeader title="On Instagram" />
        <InstagramProfileLink href={instagramHref} profile={feed.profile} />
      </MotionReveal>
      <InstagramPostGrid posts={feed.posts} username={feed.profile.username} />
    </PageSection>
  );
}

function InstagramProfileLink({ href, profile }: { href: string; profile: InstagramProfile }) {
  return (
    <a
      className="group mt-5 flex max-w-3xl items-center gap-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-full bg-muted transition-transform duration-200 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
        <img alt="" className="size-full object-cover" src="/favicon.svg" />
      </span>
      <span className="min-w-0">
        {profile.username ? <span className="font-bold">@{profile.username}</span> : null}
        {profile.biography ? (
          <span className="mt-1 block text-sm leading-6 text-muted-foreground">
            {profile.biography}
          </span>
        ) : null}
      </span>
    </a>
  );
}

function InstagramPostGrid({ posts, username }: { posts: InstagramPost[]; username: string }) {
  return (
    <MotionReveal>
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {posts.map((post) => (
          <InstagramPostLink key={post.id} post={post} username={username} />
        ))}
      </div>
    </MotionReveal>
  );
}

function InstagramPostLink({ post, username }: { post: InstagramPost; username: string }) {
  const altText = post.caption || (username ? `Instagram post by @${username}` : "Instagram post");

  return (
    <a
      className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted shadow-md ring-1 ring-border focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      href={post.permalink}
      rel="noreferrer"
      target="_blank"
    >
      <img
        alt={altText}
        className="size-full object-cover transition-transform duration-200 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        decoding="async"
        fetchPriority="low"
        loading="lazy"
        src={post.thumbnailUrl}
      />
      <PostTypeIcon type={post.type} />
    </a>
  );
}

function PostTypeIcon({ type }: { type: InstagramPost["type"] }) {
  if (type === "image") {
    return null;
  }

  const Icon = type === "video" ? PlayIcon : ImagesIcon;

  return (
    <span
      className={cn(
        "absolute top-1/2 left-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-glass-border bg-glass text-glass-foreground backdrop-blur-glass",
        type === "video" && "[&_svg]:fill-current",
      )}
    >
      <Icon className="size-4" />
      <span className="sr-only">{type === "video" ? "Video" : "Carousel"}</span>
    </span>
  );
}

export { InstagramFeedSection };
