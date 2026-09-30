import { createFileRoute } from "@tanstack/react-router";

import { instagramImageSource } from "@/lib/instagram.server";

const IMAGE_TIMEOUT_MS = 15 * 1000;
const MAX_IMAGE_BYTES = 12 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES = new Set(["image/avif", "image/jpeg", "image/png", "image/webp"]);

export const Route = createFileRoute("/api/instagram/image/$id/photo.jpg")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const mediaId = params.id;
        if (!/^\d+$/.test(mediaId)) {
          return textResponse("Instagram media ID is invalid.", 400);
        }

        try {
          const sourceUrl = await instagramImageSource(mediaId);
          if (!sourceUrl) {
            return textResponse("Instagram image was not found.", 404);
          }

          const upstream = await fetch(sourceUrl, {
            signal: AbortSignal.timeout(IMAGE_TIMEOUT_MS),
            headers: { Referer: "https://www.instagram.com/" },
          });
          const contentType = normalisedContentType(upstream);
          const contentLength = contentLengthValue(upstream);

          if (!upstream.ok || !upstream.body || !ALLOWED_CONTENT_TYPES.has(contentType)) {
            throw new Error(`Instagram CDN returned ${upstream.status}`);
          }

          if (contentLength > MAX_IMAGE_BYTES) {
            throw new Error(`Instagram image exceeded ${MAX_IMAGE_BYTES} bytes`);
          }

          return new Response(limitedImageStream(upstream.body), {
            headers: imageHeaders(contentType, contentLength),
          });
        } catch (error) {
          console.error("Instagram image fetch failed", {
            mediaId,
            message: error instanceof Error ? error.message : String(error),
          });
          return textResponse("Instagram image could not be loaded.", 502);
        }
      },
    },
  },
});

function imageHeaders(contentType: string, contentLength: number) {
  const headers = new Headers({
    "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800, stale-if-error=604800",
    "Content-Type": contentType,
    "X-Content-Type-Options": "nosniff",
  });

  if (contentLength > 0) {
    headers.set("Content-Length", String(contentLength));
  }

  return headers;
}

function textResponse(message: string, status: number) {
  return new Response(message, {
    status,
    headers: {
      "Cache-Control": status === 404 ? "public, max-age=60" : "no-store",
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function normalisedContentType(response: Response) {
  return (response.headers.get("content-type") ?? "").split(";", 1)[0].trim().toLowerCase();
}

function contentLengthValue(response: Response) {
  const value = Number.parseInt(response.headers.get("content-length") ?? "", 10);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function limitedImageStream(body: ReadableStream<Uint8Array>) {
  const reader = body.getReader();
  let bytesRead = 0;

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          return;
        }

        bytesRead += value.byteLength;
        if (bytesRead > MAX_IMAGE_BYTES) {
          const error = new Error(`Instagram image exceeded ${MAX_IMAGE_BYTES} bytes`);
          await reader.cancel(error);
          controller.error(error);
          return;
        }

        controller.enqueue(value);
      } catch (error) {
        controller.error(error);
      }
    },
    cancel(reason) {
      return reader.cancel(reason);
    },
  });
}
