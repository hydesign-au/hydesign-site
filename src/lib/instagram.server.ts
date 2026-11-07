import type { InstagramFeedResponse, InstagramPost, InstagramProfile } from "@/lib/instagram";
import { runtimeValue } from "@/server/env";

type InstagramConfig = {
  accessToken: string;
  accountId: string;
};

type LoadedInstagramFeed = {
  feed: InstagramFeedResponse;
  imageSources: Map<string, string>;
};

type FeedCacheEntry = LoadedInstagramFeed & {
  expiresAt: number;
};

const GRAPH_API_VERSION = "v25.0";
const GRAPH_MEDIA_PAGE_SIZE = 100;
const FEED_CACHE_TTL_MS = 10 * 60 * 1000;
const GRAPH_TIMEOUT_MS = 10 * 1000;

let feedCache: FeedCacheEntry | null = null;
let pendingFeed: Promise<LoadedInstagramFeed> | null = null;

async function loadInstagramFeed() {
  const loaded = await loadInstagramData();
  return loaded?.feed ?? null;
}

async function instagramImageSource(mediaId: string) {
  const loaded = await loadInstagramData();
  return loaded?.imageSources.get(mediaId) ?? "";
}

async function loadInstagramData(): Promise<LoadedInstagramFeed | null> {
  const config = readInstagramConfig();
  if (!config) {
    return null;
  }

  if (feedCache && feedCache.expiresAt > Date.now()) {
    return feedCache;
  }

  pendingFeed ??= fetchInstagramData(config)
    .then((loaded) => {
      feedCache = {
        ...loaded,
        expiresAt: Date.now() + FEED_CACHE_TTL_MS,
      };
      return loaded;
    })
    .finally(() => {
      pendingFeed = null;
    });

  return pendingFeed;
}

async function fetchInstagramData(config: InstagramConfig): Promise<LoadedInstagramFeed> {
  const [profile, media] = await Promise.all([fetchProfile(config), fetchMedia(config)]);
  const imageSources = new Map<string, string>();
  const posts = media.flatMap((item) => {
    const normalised = normalisePost(item);
    if (!normalised) {
      return [];
    }

    imageSources.set(normalised.post.id, normalised.imageSource);
    return [normalised.post];
  });

  return {
    feed: {
      enabled: true,
      profile,
      posts,
    },
    imageSources,
  };
}

async function fetchProfile(config: InstagramConfig): Promise<InstagramProfile> {
  const response = await graphFetch(
    graphUrl(config.accountId, { fields: "biography,username" }),
    config.accessToken,
  );
  const data = await readGraphResponse(response);

  return {
    username: isRecord(data) ? stringValue(data.username) : "",
    biography: isRecord(data) ? stringValue(data.biography) : "",
  };
}

async function fetchMedia(config: InstagramConfig) {
  const response = await graphFetch(
    graphUrl(`${config.accountId}/media`, {
      fields:
        "id,caption,children{media_type,media_url,thumbnail_url},media_type,media_url,permalink,thumbnail_url",
      limit: String(GRAPH_MEDIA_PAGE_SIZE),
    }),
    config.accessToken,
  );
  const data = await readGraphResponse(response);

  if (!isRecord(data) || !Array.isArray(data.data)) {
    return [];
  }

  return data.data.filter(isRecord);
}

function normalisePost(value: unknown): { post: InstagramPost; imageSource: string } | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = stringValue(value.id);
  const imageSource = mediaImageSource(value);
  const permalink = stringValue(value.permalink);

  if (!id || !imageSource || !permalink) {
    return null;
  }

  return {
    post: {
      id,
      caption: stringValue(value.caption),
      thumbnailUrl: `/api/instagram/image/${id}/photo.jpg`,
      permalink,
      type: mediaType(stringValue(value.media_type)),
    },
    imageSource,
  };
}

function mediaImageSource(value: Record<string, unknown>) {
  const thumbnailUrl = stringValue(value.thumbnail_url);
  if (thumbnailUrl) {
    return thumbnailUrl;
  }

  const mediaUrl = stringValue(value.media_url);
  if (mediaUrl) {
    return mediaUrl;
  }

  if (!isRecord(value.children) || !Array.isArray(value.children.data)) {
    return "";
  }

  const child = value.children.data[0];
  if (!isRecord(child)) {
    return "";
  }

  return stringValue(child.thumbnail_url) || stringValue(child.media_url);
}

async function graphFetch(url: URL, accessToken: string) {
  return fetch(url, {
    signal: AbortSignal.timeout(GRAPH_TIMEOUT_MS),
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

async function readGraphResponse(response: Response) {
  const data = await response.json().catch(() => null);
  const errorMessage = graphErrorMessage(data);

  if (!response.ok || errorMessage) {
    throw new Error(errorMessage || `Facebook Graph API returned ${response.status}`);
  }

  return data;
}

function graphUrl(path: string, params: Record<string, string>) {
  const url = new URL(`https://graph.facebook.com/${GRAPH_API_VERSION}/${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url;
}

function graphErrorMessage(data: unknown) {
  if (!isRecord(data) || !isRecord(data.error)) {
    return "";
  }

  return stringValue(data.error.message);
}

function mediaType(value: string) {
  if (value === "VIDEO") {
    return "video";
  }

  if (value === "CAROUSEL_ALBUM") {
    return "carousel";
  }

  return "image";
}

function readInstagramConfig(): InstagramConfig | null {
  const accessToken = runtimeValue("FACEBOOK_PAGE_ACCESS_TOKEN");
  const accountId = runtimeValue("INSTAGRAM_BUSINESS_ACCOUNT_ID");

  return accessToken && accountId ? { accessToken, accountId } : null;
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

export { instagramImageSource, loadInstagramFeed };
