# qrc-gen design standards

Visual rules for the UI around the QR code. `frontend-dev` loads this file first.
The look is the SpectreHawk dark terminal style described in `CLAUDE.md` (black, neon hawk-green, monospace for code-like bits).

These rules cite, and do not copy, the art-lab research:
- `~/art-lab/research/art-styles/modern-design-standards.md` (WCAG 2.2 thresholds, dark theme, target sizes)
- `~/art-lab/research/art-styles/dashboard-design.md` (grouping with cards, dark surfaces)

## Contrast

Targets are WCAG 2.2 AA, measured on the real token pairs. The check script is in the PR that introduced this file; rerun it when a token changes.

| Pair | Ratio | Rule |
|---|---|---|
| `--foreground` on `--background` | 17.7:1 | text >= 4.5:1 |
| `--foreground` on `--surface` | 16.5:1 | text >= 4.5:1 |
| `--muted` on `--background` | 10.5:1 | text >= 4.5:1 |
| `--muted` on `--surface` | 9.8:1 | text >= 4.5:1 |
| `--muted` on `--surface-2` | 9.1:1 | text >= 4.5:1 |
| `--hawk` on `--surface` | 13.8:1 | text >= 4.5:1 |
| `--danger` on `--surface` | 5.7:1 | text >= 4.5:1 |
| `--control-border` on `--surface` | 3.7:1 | control edge >= 3:1 |
| `--control-border` on `--background` | 4.0:1 | control edge >= 3:1 |

Rules:
- Every control edge (input, pill, stepper button, color swatch) uses `--control-border`, never `--border`.
- `--border` (1.6:1) is for card edges and dividers only. It never marks a control.
- `--hawk-dim` is decorative (the preview frame). Do not use it for text: 4.4:1 fails.
- Color is never the only cue. The selected pill has a hawk border and hawk text; a disabled button is also dimmed and shows a not-allowed cursor.

## Type

- Smallest text is 13px (`text-xs` is set to 0.8125rem in `globals.css`). No `text-[10px]` or `text-[11px]`.
- Labels are uppercase mono 13px with letter spacing. Body and helper text is sentence case.
- Helper text under a field uses `--muted`, never a darker grey.

## Controls

- Minimum target is 40px high (WCAG AA asks 24px; this app is used on phones).
- Numbers use the `NumberStepper` (number box, - / + buttons, arrow keys). No range sliders: exact values and larger targets.
- Focus is a 2px hawk outline on buttons and links, and a hawk border plus glow on fields.

## Cards

- Each concern is its own card with a mono uppercase title: Content, Design, Title, Caption, Logo.
- Cards use `--surface` on `--background` with a `--border` edge and 0.75rem radius.
- Keep the main view to about 3-5 groups; fold the rest.

## Language

- Every visible string ships in EN, SL and ES (see `CLAUDE.md` rule 2). Taglines stay punchy with about 20% sarcasm.
