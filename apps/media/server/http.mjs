// The manager's local file API, as a Vite dev/build plugin. It serves the
// originals from /media and routes /api/media/* to the library writes. All the
// request plumbing lives here so the Vite config just wires the plugin in.

import { createReadStream } from "node:fs";
import path from "node:path";

import { contentTypes, listLibrary, regenerate } from "./library.mjs";
import {
  bulkPatch,
  createFolder,
  deleteItems,
  patchItem,
  removeFolder,
  renameFolder,
} from "./mutate.mjs";
import { mediaDir } from "./paths.mjs";

export function mediaApiPlugin() {
  function attach(server) {
    server.middlewares.use("/api/media", (req, res, next) => {
      void handleApi(req, res, next);
    });
    server.middlewares.use("/media", (req, res, next) => serveOriginal(req, res, next));
  }

  return {
    name: "media-api",
    configureServer: attach,
    // The same API behind `vite preview`, so the built app is fully functional.
    configurePreviewServer: attach,
  };
}

async function handleApi(req, res, next) {
  const [first, second] = segmentsOf(req);
  try {
    if (req.method === "GET" && (first === "library" || !first)) {
      return sendJson(res, 200, await listLibrary());
    }
    if (req.method === "PATCH" && first === "bulk") {
      const { ids, patch } = await readBulk(req);
      return sendJson(res, 200, { items: bulkPatch(ids, patch) });
    }
    if (req.method === "DELETE" && !first) {
      const ids = idsOf(await readJson(req));
      deleteItems(ids);
      res.statusCode = 204;
      return res.end();
    }
    if (req.method === "POST" && first === "jobs" && second === "refresh") {
      const payload = await listLibrary({ refreshFiles: true });
      regenerate();
      return sendJson(res, 200, payload);
    }
    if (first === "folders") {
      return await handleFolders(req, res, second);
    }
    if (req.method === "PATCH" && first && !second) {
      return sendJson(res, 200, { item: patchItem(first, await readJson(req)) });
    }
    next();
  } catch (err) {
    sendJson(res, 400, { error: err instanceof Error ? err.message : String(err) });
  }
}

async function handleFolders(req, res, slug) {
  if (req.method === "POST" && !slug) {
    const body = await readJson(req);
    return sendJson(
      res,
      200,
      createFolder({ label: strOf(body, "label"), parent: nullableStrOf(body, "parent") }),
    );
  }
  if (req.method === "PATCH" && slug) {
    const body = await readJson(req);
    return sendJson(res, 200, renameFolder(slug, strOf(body, "label")));
  }
  if (req.method === "DELETE" && slug) {
    return sendJson(res, 200, removeFolder(slug));
  }
  sendJson(res, 404, { error: "unknown folders route" });
}

function serveOriginal(req, res, next) {
  const relative = decodeURIComponent((req.url ?? "").split("?")[0]).replace(/^\/+/, "");
  if (!relative) return next();
  const absolute = path.resolve(mediaDir, relative);
  if (!absolute.startsWith(`${mediaDir}${path.sep}`)) return next();
  const type = contentTypes[path.extname(relative).toLowerCase()];
  if (!type) return next();
  res.setHeader("content-type", type);
  createReadStream(absolute)
    .on("error", () => {
      res.statusCode = 404;
      res.end();
    })
    .pipe(res);
}

function segmentsOf(req) {
  return (req.url ?? "").split("?")[0].split("/").filter(Boolean).map(decodeURIComponent);
}

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify(body));
}

function idsOf(body) {
  return isRecord(body) && Array.isArray(body.ids) ? body.ids : [];
}

async function readBulk(req) {
  const body = await readJson(req);
  return { ids: idsOf(body), patch: isRecord(body) ? (body.patch ?? {}) : {} };
}

function strOf(body, key) {
  return isRecord(body) && typeof body[key] === "string" ? body[key] : "";
}

function nullableStrOf(body, key) {
  const value = strOf(body, key).trim();
  return value || null;
}

function isRecord(value) {
  return value !== null && typeof value === "object";
}

function readBuffer(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function readJson(req) {
  const buffer = await readBuffer(req);
  if (buffer.length === 0) return {};
  return JSON.parse(buffer.toString("utf8"));
}
