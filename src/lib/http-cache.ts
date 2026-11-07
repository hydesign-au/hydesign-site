const publicCacheHeaders = {
  "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400, stale-if-error=86400",
} as const;

const revalidateCacheHeaders = {
  "Cache-Control": "public, max-age=0, must-revalidate",
} as const;

const privateNoStoreHeaders = {
  "Cache-Control": "private, no-store",
} as const;

export { privateNoStoreHeaders, publicCacheHeaders, revalidateCacheHeaders };
