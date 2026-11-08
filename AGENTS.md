# AGENTS.md

The website for HyDesign, a family signwriting, signage and printing business in Langwarrin. A TanStack Start app on a Cloudflare Worker: pages are prerendered at build time, except home, contact, shop and cart, which render per request.

## Layout

- `src/routes`: file routes. A page route holds its page component. `.ts` routes are raw HTTP handlers: sitemap, robots, llms.txt, the contact form endpoint and the Instagram image proxy.
- `src/components`: the site shell and shared sections. `src/components/ui` is shadcn source (Base UI, base-nova style).
- `src/content`: the site's words and facts as typed data: business details, services, projects, reviews, legal terms and navigation. `public-routes.ts` feeds the sitemap.
- `src/content/photos.ts`: one entry per file in `src/assets/photos`, keyed by file name, with the photo's client, suburb and services. Its order is the gallery order.
- `src/content/media.ts`: turns the photo and video files into URLs and sizes.
- `src/assets/photos`: the site's photos, named after the camera file. `src/assets/videos`: short silent clips, each with a JPEG poster of the same name.
- `src/lib`: `*.functions.ts` are server functions, `*.server.ts` hold credentials and external calls (contact email, Instagram, Shopify), the rest are shared helpers. `src/server/env.ts` reads Worker bindings.
- `wrangler.toml`: Worker bindings, the staging and preview domains, and preview-only values.

## Contracts

- Words and facts on the site come from a person: the owner, existing site text, or what is already in `src/content`. Text without a human source stays a visible placeholder until someone supplies it. That includes what a photo shows: its client, its suburb and the kind of sign.
- Photos are the camera's own files. JPEGs are never re-encoded and HEIC is converted once. Reframing happens in Photos; layouts crop into fixed 4:3 or 3:4 boxes.
- The repo is public, so committed photos carry no GPS.
- Cloudflare resizes photos at request time through `/cdn-cgi/image/`. Builds never process images.
- Instagram, Turnstile and the Shopify shop switch on only when their Worker variables are set. Previews take test values and mock.shop from the `previews` block in `wrangler.toml`.
- A public page builds its `head` with `seo()` and has an entry in `src/content/public-routes.ts`.

## Baseline

- Write modern, idiomatic code for the versions this repo pins: React 19, TanStack Start, Tailwind v4 and Vite.
- When this repo has no precedent for something, follow how the maintainer's other repositories under hydesign-au, hydazz and woodleighschool do it, so they stay consistent.
- Check a dependency's API against its pinned version, not from memory.
- Add shadcn components with the shadcn CLI. Colours come from the CSS variables in `src/globals.css` and `src/styles.css`.

## Tooling

- mise pins the toolchain and runs the tasks. `mise run dev` serves on :3000; local secrets go in `.dev.vars`, shaped like `.dev.vars.example`.
- `format` (oxfmt) and `lint:fix` (oxlint, type-aware) are the loop, with `typecheck` (tsc). CI runs `fmt-check`, `lint`, `typecheck` and `build` read-only.
- Lefthook formats staged files, relocks mise and lints workflows on commit.
- `mise run photo <files>` adds photos. JPEGs are copied as they are, other formats go through macOS `sips`, and GPS and HDR gain maps are stripped. Each new photo then needs a `photos.ts` entry.
- Cloudflare Workers Builds deploys `main` to staging.hydesign.com.au and other branches to `<branch>.previews.hydesign.com.au`.

## Commits

- Commits follow Conventional Commits.
