// The one place that knows where the library and its generated output live.
// The library is a repo-root asset (/media) the manager owns and edits; the
// generated media.gen.ts stays in the web app, which only consumes it.

import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url)); // apps/media/server
const repoRoot = path.resolve(here, "../../..");

export const mediaDir = path.join(repoRoot, "media");
export const libraryPath = path.join(repoRoot, "media/library.json");
export const mediaTsPath = path.join(repoRoot, "apps/web/src/content/media.gen.ts");
