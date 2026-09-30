# AGENTS.md

Technical conventions for the HyDesign website repository: structure, commands, architecture, media and code style.

The site is a TanStack Start SSR application with code-owned business, service and project content. Content changes are commits and builds. Forms are simple contact paths unless a task explicitly adds server-side capture. Prefer the simplest thing that serves the site: no CMS, database, object storage, admin panel, shop, booking flow, upload system or analytics programme unless a task explicitly needs it.

## Repo map

- `apps/web` - website. TanStack Start SSR, React 19, Tailwind v4.
  - `src/routes` - thin TanStack page and server routes: route definition, loader, `head`, raw HTTP handler and page or template import.
  - `src/pages` - bespoke page composition and page-owned sections. Resource pages live under `src/pages/<resource>/` when they need supporting files.
  - `src/templates` - repeatable, data-driven page frames such as service and project detail pages.
  - `src/layout` - site shell and shared page geometry: header, navigation, footer, layout wrapper, page sections and page heroes.
  - `src/components` - reusable website components. Keep single components at the root; create a role folder only for a real component family.
  - `src/content` - editable site data: business details, service data, gallery data and generated media.
  - `src/content/media.gen.ts` - generated from `media/library.json`; never hand-edit.
  - `src/content/services/catalog.json` - web-owned service vocabulary used by the media manager.
  - `src/lib`, `src/hooks` - shared helpers and hooks.
- `apps/media` - local media manager on `:4000`. It edits `media/library.json` and regenerates web media data. It is not deployed. Its `src/layout` owns app chrome and `src/components` owns reusable tool UI; a single-screen tool does not need website-style pages or templates.
- `packages/ui` - shared shadcn/Base UI source, support hooks and the neutral Tailwind theme foundation used by every app.
- `media/` - canonical website photo and video sources plus `library.json`.
- `apps/web/wrangler.jsonc` - Worker runtime, binding, cache and custom-domain configuration.

## Application boundaries

The deployed website is TanStack Start running in a Cloudflare Worker. Vite and the Cloudflare Vite plugin build the Worker and its static assets; workerd is the production runtime.

- TanStack Start owns page routing, loaders, server functions, raw HTTP routes, SSR and client hydration. Cloudflare owns the Worker runtime, static asset delivery and edge response cache. Extend their documented surfaces instead of adding a parallel server entry.
- `vite.app.config.ts` composes development and build plugins, aliases and bundler settings.
- `wrangler.jsonc` owns Cloudflare compatibility, bindings, response-cache enablement and the custom domain. Do not add account IDs or secrets to it.
- Runtime integrations read bindings through `src/server/env.ts` inside `*.server.ts` modules. Use `VITE_*` or `import.meta.env` only for values intentionally embedded in browser bundles, never for secrets or deployed feature availability.
- `*.server.ts` owns credentials, runtime configuration, validation and external service calls. `*.functions.ts` is the typed same-origin TanStack server-function boundary. TanStack server routes call the same server integration modules instead of reimplementing them.
- Derive each optional capability once from its complete runtime configuration. Absent or incomplete configuration disables it plainly. Routes, navigation, sitemaps and UI consume the same resolved capability rather than reading environment variables independently.
- SSR is the fallback delivery model. Prerender routes that are independent of runtime configuration and runtime data; keep home and contact dynamic while they depend on Instagram and Turnstile. Use response caching for freshness and delivery policy rather than turning runtime integrations into build-time state.
- Keep route files at the transport and composition boundary. TanStack page routes own route definition, guards, loaders, `head` and page composition. TanStack server routes own HTTP parsing and translation. Integration behaviour stays in the server module that owns it.
- Workers Static Assets serves canonical media, CSS, JavaScript and prerendered HTML before the Worker. Do not enable `run_worker_first` broadly or route static assets through application code.

## Commands

mise owns the toolchain and task runner.
Run `mise tasks --all` when unsure. Tasks work from any directory.

Root tasks:

- `mise run dev` - web dev server on `:3000`.
- `mise run media` - media manager on `:4000`.
- `mise run build` - build both apps.
- `mise run lint` - repo-wide lint.
- `mise run format` - repo-wide format.
- `mise run fmt-check` - check repo-wide formatting.
- `mise run test` - run media manager tests.

Web tasks use `mise run //apps/web:<task>`: `dev`, `build`, `preview`, `deploy`, `cf-typegen`, `lint`, `format` and `typecheck`. Media tasks use `mise run //apps/media:<task>`: `dev`, `build`, `serve`, `generate`, `test`, `lint`, `format` and `typecheck`. Shared UI tasks use `mise run //packages/ui:<task>` for `lint`, `format` and `typecheck`.

Toolchain pins must agree:

- `.mise/config.toml` is the source of truth.
- `.mise/mise.lock` is re-locked by lefthook on commit.
- `.node-version` mirrors the Node pin for Cloudflare Workers Builds.
- `packageManager` in root `package.json` pins pnpm for corepack.

## Branches and pull requests

- Keep local `main` as a clean base, updated by fast-forward from `origin/main`.
- Start each independent change on a short branch from current `origin/main`, named after the change, such as `simplify-contact-copy`.
- Rebase a branch onto current `origin/main` when it has moved and repeat affected checks. After rebasing an already-pushed branch, use `--force-with-lease`, never an unconditional force push. Never rewrite another contributor's branch.
- PR titles describe the change. Bodies say what changed and why, usually in one or two sentences.
- Never bypass repository protections.

## Deployment

Cloudflare Workers Builds owns preview builds and deployment from `main`. GitHub Actions runs formatting, lint, tests and workflow checks only; do not build the website or generate responsive images there.

- Workers Builds root directory: `apps/web`.
- Build command: `pnpm run build`.
- Production deploy command: `npx wrangler deploy`.
- Non-production deploy command: `npx wrangler preview`, which creates a Worker Preview per branch.
- Production branch: `main`. Merging publishes through Workers Builds; do not run a manual production deploy as part of ordinary editing.
- Use the branch/PR preview for deployed review. Verify the build and actual preview URL before presenting it as ready; configuration alone is not proof of a successful preview.
- `apps/web/wrangler.jsonc` owns the `staging.hydesign.com.au` custom domain and the preview-only `previews.hydesign.com.au` domain, so Wrangler creates their DNS records and certificates during deployment. Branch previews are served at `<branch>.previews.hydesign.com.au`.
- Build-time variables and secrets are normally empty. Runtime variables and secrets are configured on the Worker, not in Workers Builds.
- Previews do not inherit production settings. Top-level settings are production; the `previews` block holds preview values, including Turnstile test keys and the mock.shop storefront. Preview secrets go in the Worker's Previews Base settings.

Renovate configuration lives in `.renovaterc.json5`. Renovate runs from `.github/workflows/renovate.yaml` every six hours. Non-major updates, apart from 0.x minors, automerge once `Build Success` passes. To force a run, use `gh workflow run renovate.yaml --repo hydesign-au/hydesign-site`.

## UI ownership

Place UI by ownership and reuse, not by the fact that it renders JSX. Do not create `common/`, `shared/` or `misc/`.

- `packages/ui/src/components/` owns shared shadcn and approved registry primitives. Do not hand-edit except lint or format fixes after CLI generation. Add or update with the shadcn CLI using `--overwrite`. Compose around primitives instead of forking them.
- `apps/web/src/layout/` owns the site shell and reusable structural geometry. Layout may depend on app components; components do not depend on layout.
- `apps/web/src/templates/` owns real data-driven page families. A template is rendered by multiple content records, not a second name for a one-off page.
- `apps/web/src/pages/` owns bespoke page composition and anything used by only that page. Keep supporting components beside the page rather than promoting them into `src/components`.
- App `src/components/` owns reusable app-specific UI. A folder such as `shop/` is justified by a cohesive family; a folder containing one raw renderer is not.
- `apps/media/src/layout/` owns persistent tool chrome. Its feature-oriented component folders may mirror the tool's visible work areas without introducing route or page layers that do not exist.

Move an app component to `packages/ui` only when it is genuinely app-agnostic and has at least two app consumers.

## Code style

- Use strict, modern TypeScript.
- `@/*` is app-local. Shared primitives, hooks and utilities use explicit `@hydesign/ui/*` package imports.
- Keep route files thin. They select a bespoke page or a real data-driven template after their transport work.
- Pages own their composition and one-page-only sections. Reusable section anatomy belongs in `src/components`; cross-page geometry belongs in `src/layout`.
- Use existing UI primitives and CSS variable tokens. Do not hardcode hex colours.
- `packages/ui/src/styles/globals.css` owns the neutral shadcn token contract, the radius scale and cross-app surface treatments such as frosted glass. Each app stylesheet imports it, then overrides only brand colour and font tokens plus genuinely app-wide behaviour.
- Components own their interaction and reveal motion. Keep component-specific keyframes, transitions and state selectors beside the component, preferably in its class list or CSS module. Global styles hold only site-wide motion such as page transitions, the shared reveal system and shared arrow or media behaviour.
- Follow documented shadcn composition for navigation and shell patterns before writing local lookalikes.
- Use `useEffect` only for external systems such as DOM APIs, timers and media queries. Calculate render data during render.
- Avoid `any` at data boundaries.
- Do not add shared packages, plugin systems or compatibility shims without two real consumers.

## SEO implementation

`apps/web/src/lib/seo.ts` builds page head data. `sitemap[.]xml.ts` and `robots[.]txt.ts` are server routes. robots.txt allows crawling only on the production host, so staging and preview hosts stay out of search; never prerender it.

- Keep `/llms.txt` as a short factual summary. It is not visible page copy and does not replace crawlable service content.
- Titles put the keyword first. `seo()` appends `| HyDesign`.
- Use schema correctly: LocalBusiness and WebSite on home, Service and BreadcrumbList on service pages, BreadcrumbList elsewhere.
- `areaServed` lists suburbs or regions, not states.
- New indexable pages need: `head()` through `seo()`, title, description, pathname, sitemap entry, breadcrumbs, distinct hero and section images.
- Mark placeholder pages `noindex`.

## Photos and media

The repo-root `media/` directory is the source media library. A tracked photo is a canonical website source derived from an unmodified capture: finish technical normalisation and an intentional 4:3 or 3:4 crop before its first commit. Keep the archival original in the photo library instead of Git.

Committed photos are public, so they carry no GPS. The media commit hook removes GPS tags from staged photos; the human-written `location` field in `library.json` carries the suburb instead.

Photo sources must be normal SDR `.jpeg` files:

- Keep JPEGs with normal SDR colour, EXIF Orientation `1`, no HDR gain map and no edit sidecar as-is when they already meet the source and crop requirements.
- Physically normalise JPEGs with EXIF Orientation other than `1`. Prefer lossless `jpegtran`/`exiftran`-style transforms, then reset Orientation to `1` while preserving useful EXIF and ICC metadata.
- Intentionally convert HDR/gain-map captures to normal SDR JPEG and verify the result. Removing HDR metadata alone is not tone mapping. Reject an output when its colour conversion cannot be verified.
- Convert HEIC/HEIF photos to SDR JPEG before adding them. This is a decode and re-encode step; preserve useful EXIF and ICC metadata.
- Treat HEVC and other videos separately as video sources, poster frames or rejects. Do not ingest them as photo sources.
- Reject externally edited exports and XMP/adjustment-based versions. Use the unmodified capture.
- Keep 4:3 landscape or 3:4 portrait composition without stretching.
- Decode and inspect the output, verify dimensions, orientation and SDR colour, then reconcile the library metadata. A successful conversion command alone is not verification.

Video sources are short, edited and compressed site clips rather than archival camera originals. Normalise them before adding them to the library:

- Use FFmpeg's macOS VideoToolbox decode and encode path. For a 16:9 hero source, use:

  ```sh
  ffmpeg -hwaccel videotoolbox -hwaccel_output_format videotoolbox_vld -i input.mov -map 0:v:0 -vf 'scale_vt=w=1920:h=1080:color_matrix=bt709:color_primaries=bt709:color_transfer=bt709' -c:v h264_videotoolbox -pix_fmt videotoolbox_vld -profile:v high -b:v 6000k -an -map_metadata -1 -movflags +faststart output.mp4
  ```

- Do not stretch non-16:9 sources. Choose an intentional crop or padded presentation for the placement.
- Output H.264 High at 1920x1080, `yuv420p`, BT.709 primaries, transfer and matrix, TV range, and approximately 6 Mbps. Preserve the source frame rate without upsampling.
- Remove audio and source metadata unless a placement explicitly needs them. Do not ship 4K camera masters, HDR, Dolby Vision or HEVC as site video.
- Generate a clean, representative same-stem `.jpeg` poster from the normalised output. Every video requires a poster.
- Store the pair as `media/videos/<stem>.mp4` and `media/videos/<stem>.jpeg`, then use Refresh to reconcile the library and generated web bindings.
- Verify the result with `ffprobe`: one video stream, no audio stream, the expected duration, H.264 High, 1920x1080, `yuv420p`, BT.709 TV range, no HDR or Dolby Vision side data, and a fast-start `moov` atom before `mdat`.

The web app imports canonical media through `@media` as Workers Static Assets. Cloudflare Images creates and caches responsive WebP and JPEG variants at request time; builds do not encode photos. Transformations only run on hosts in the hydesign.com.au zone, so Workers Builds previews of branches other than `main` serve the canonical photos untransformed.

Photo framing belongs to the prepared source and its placement:

- Components use fixed-aspect boxes with `object-cover`.
- The source owns the durable 4:3 or 3:4 composition; a placement may crop it further with CSS.
- `<Picture>` keeps the source aspect and asks Cloudflare only for responsive size and format variants.

Keep original capture IDs such as `IMG_1234` as filenames so photos remain searchable in the photo library.

`media/library.json` is keyed by filename stem. Human-authored fields:

- `project` - client or album grouping. A photo belongs to one project.
- `services` - web-owned service slugs from `apps/web/src/content/services/catalog.json`.
- `tags` - media-owned descriptive slugs for visible details that are not services.

Never classify photos by visual guesswork. Signage categories are easy to misread. Use existing metadata or placeholders.

Alt text is generated by `imageAlt`, generally from service, client and suburb metadata. Fix the library metadata instead of hand-overriding placement alt text.

Avoid using the same photo as both hero and section content on the same page. Index-page heroes should not repeat card images below. Gallery pages may repeat any image in the album.

## Media manager

Use `mise run media` for library work. The manager runs on `:4000` and owns:

- browsing and filtering media;
- editing metadata;
- bulk editing and deleting;
- managing tag vocabulary;
- writing `media/library.json`;
- regenerating `apps/web/src/content/media.gen.ts`.

It does not import or upload sources. Add or replace source files directly in `media/`, then use the manager's rescan to reconcile `library.json` and regenerate web media data. Unknown service slugs fail generation.

## Commits

Use focused conventional commits:

- `feat(web): ...`
- `fix(web): ...`
- `chore: ...`
- `docs: ...`

Keep unrelated work in separate commits.

## Done checklist

A change is done when all relevant items are true:

- `mise run fmt-check`, `mise run lint` and `mise run test` pass.
- Deployable website changes receive their production-build proof from Cloudflare Workers Builds.
- The rendered pages touched by the work have been inspected on mobile and desktop in both light and dark mode.
- Photos are real, distinct where needed and backed by library metadata.
- SEO head data is set for new public pages.
- No unnecessary infrastructure, abstraction or page furniture.
