@AGENTS.md

# CLAUDE.md

Guidance for Claude Code in this repository. It overrides `~/AirLab/CLAUDE.md`.

## Rules

1. **Do not change QR generation logic without asking first.** Propose the change, wait for a yes. This covers:
   - `src/lib/qr.ts`: `QRConfig`, `buildOptions()`, the M → H error-correction bump
   - `src/lib/formatters.ts`: the encoded payload strings (URL, `WIFI:`, vCard)
   - `src/components/QRPreview.tsx`: how `qr-code-styling` is mounted and redrawn
   - `api/app/qr_generator.py`: segno matrix, logo compositing, logo download
   - Defaults and limits that change what gets encoded or how it scans (`api/app/models.py` caps, EC levels, margins)

   Styling the controls around the QR, copy, and layout are not "generation logic".
2. **Keep the UI bilingual: English (EN) and Slovenian (SL).** Every user-visible string you add or change ships in both languages in the same commit, including labels, placeholders, errors, `aria-label`s, alt text and metadata. Never hard-code a one-language string in a component.
   - Current state: the UI is English-only (`layout.tsx` sets `lang="en"`) and there is no i18n layer yet. Adding one (library choice, locale routing, `lang` switching) is an architectural change: plan it and ask before building it.
3. **Small, focused commits.** One intent per commit, prefixes `feat: fix: test: docs: chore:`, body says why. Do not mix a refactor, a feature and a dependency bump in one commit.
4. Work on a branch, open a PR, never push to `main`. `npm` only; never write a pnpm/yarn/bun lockfile.

## What this is

A public, free QR code generator with a SpectreHawk-flavored dark UI, plus a stateless API for programmatic QR generation. Two independent halves in one repo:

| Component | Location | Stack | Deploy |
|-----------|----------|-------|--------|
| **Web UI** | `src/` | Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + `qr-code-styling` | Vercel, static |
| **API** | `api/` | Python 3.12 + FastAPI + segno + Pillow + httpx | Docker container, not deployed yet |

The Web UI is fully client-side: no API routes, no database, no auth, no telemetry. The API handles logo embedding and batch ZIP generation.

Remote: `github.com/DNP42/qrc-gen` (public). The Claude GitHub App workflow is set up for `@claude` mentions in issues and PRs.

## Folder structure

```
src/
  app/
    layout.tsx           root layout, fonts, dark theme, OG metadata, <html lang>
    page.tsx             the single page; owns the QRConfig state
    globals.css          Tailwind v4 CSS-first config + neon accent tokens
  components/
    ContentTabs.tsx      URL/Text, Wi-Fi, vCard inputs
    StylePanel.tsx       colors, presets, dot/corner styles, overlay toggle
    QRPreview.tsx        mounts qr-code-styling, redraws on config change
    DownloadBar.tsx      PNG + SVG download
  lib/
    qr.ts                QRConfig type + buildOptions() → qr-code-styling Options
    formatters.ts        encodeURL / encodeWifi / encodeVCard → the encoded string
api/
  Dockerfile, docker-compose.yml, requirements.txt, README.md
  app/
    main.py              FastAPI app, CORS, GET /health, GET /qr, POST /batch
    models.py            Pydantic models + input validation (size, hex, batch cap)
    qr_generator.py      segno QR + Pillow logo compositing + SSRF-safe logo fetch
```

`README.md` and `DIRECTORY-SUMMARY.md` are the public-facing descriptions; keep them in sync when features change.

## Architecture rules

- **Client-side only.** `qr-code-styling` touches `window` and breaks during SSR. QR code runs in client components or `useEffect`; load the preview with a dynamic import and `ssr: false`.
- **Next.js 16 differs from older versions.** Read `node_modules/next/dist/docs/` before using a Next API (see `AGENTS.md`).
- **One source of truth.** One `QRConfig` object lives in `page.tsx` state and is passed down; children emit changes through callbacks. No global store.
- **Auto error-correction bump.** With an overlay (logo image or center text) on, error correction goes from M to H. Users never see the EC level.
- **Formatters are pure.** They turn typed form state into the plain string the QR encodes. Keep them small, pure and testable.
- **Center text is rendered, not encoded.** The overlay text is drawn over the QR; the payload stays the URL/Wi-Fi/vCard string.

## Visual identity

Black background, neon accent (cyan / hawk-green), monospace for code-like bits. Terminal/oracle tone; taglines punchy with ~20% sarcasm, never overkill. The SL copy keeps the same tone; do not translate jokes word for word.

## Run

### Web UI

```bash
npm install
npm run dev      # Turbopack dev server on http://localhost:3000
npm run build    # static production build
npm run start    # serve the production build
npm run lint     # ESLint
```

### API

Docker is not installed on the dev laptop. Run it on a machine that has Docker, or run it directly with Python 3.12:

```bash
cd api
docker compose up --build                     # http://localhost:8080
# without Docker:
uv venv -p 3.12 && uv pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --port 8080
```

## Test

No test runner exists yet. Verification today is lint + type-check + build for the UI, and a manual check of the API:

```bash
curl -s localhost:8080/health                         # {"status":"ok"}
curl -s "localhost:8080/qr?data=hello" -o /tmp/qr.png # then scan it
```

After any change near the QR output, scan the result with a phone: test PNG and SVG, with and without an overlay.

Adding a runner changes the dependency posture: propose it first. The planned targets are Vitest for `src/lib/formatters.ts` and `src/lib/qr.ts`, and pytest + httpx for `api/app/`.

## Gate

```bash
npm run lint && npm run build
```

`next build` also type-checks. The API has no automated gate yet; say so when a change touches `api/`.

## Deploy

- Web UI: `vercel` for a preview. `vercel --prod` is human-only.
- API: build the image and run it behind nginx/Caddy with TLS, target `qr.donotpanic.space`. Pushing images and production deploys are human-only.

## API reference

### `GET /health` → `{"status":"ok"}`

### `GET /qr`

| Param  | Type   | Required | Default  | Limits                           |
|--------|--------|----------|----------|----------------------------------|
| data   | string | yes      | —        | 1–4096 chars                     |
| format | string | no       | png      | png, svg                         |
| size   | int    | no       | 400      | 80–4096                          |
| ecc    | string | no       | M        | L, M, Q, H                       |
| margin | int    | no       | 4        | 0–100                            |
| fg     | string | no       | #000000  | hex color                        |
| bg     | string | no       | #FFFFFF  | hex color                        |
| logo   | string | no       | —        | http/https URL, auto-bumps ecc→H |

### `POST /batch`

```json
{ "items": [{"id":"a","data":"..."}], "format":"png", "size":400, "ecc":"M", "fg":"#000", "bg":"#FFF", "logo":"https://..." }
```

→ ZIP of `{id}.png|svg` files. Max 200 items.

## Post-v1 ideas (not started; ask before picking one up)

- EN/SL i18n layer for the Web UI (see Rule 2).
- Web UI calls `/qr` as a fallback when `qr-code-styling` cannot handle a payload.
- Styled server-side output (dot style, corners, gradients) in the API.
- Batch from CSV upload → ZIP.
- API key + per-IP rate limiting before the API goes public.
- LRU/Redis cache for repeated `(data, ecc, size, fg, bg, logo)` requests.
- Wi-Fi / vCard / geo / SMS encoders in the API (port of `formatters.ts`).
