# qrc-gen design standards

Follows DNP42/design-studio `docs/design-rules.md` (v1).

- **Tokens:** `src/app/globals.css` holds the `--color-*` (light default, dark by system), `--motion-*` and type tokens. Components use the legacy aliases (`--hawk`, `--muted`, `--surface`, `--border`) that point at them. Brand accent: hawk green (`#15803d` light, `#39ff7a` dark). Contrast checked with `check-contrast.py src/app/globals.css`: all pairs pass.
- **Type:** Tailwind `text-xs/sm/base/lg/3xl/4xl` are remapped in `@theme` to the design-studio scale. Nothing is under 18px; body and inputs are 20px.
- **Motion:** only `transform` and `opacity`; cards fade and rise (`.rise-in`); reduced motion removes travel and the wordmark pulse.
- **Targets:** buttons, chips, inputs, header links are 44px or more (`.btn`, `.chip`, `.field`).
- **Sound:** off by default; labelled toggle `Sound: on/off` in the header; key `ui-sound`; one soft tone after a download, always with a visible `role="status"` message. Code in `src/lib/sound.ts`.
- **QR logic** (`src/lib/*`, `QRPreview.tsx`) is not touched; `.qr-frame` is restyled from CSS only.
- **Skipped:** 3D accent (optional, costs weight).
