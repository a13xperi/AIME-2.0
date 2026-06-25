# AIME Golf — Design System

One streamlined design system extracted from the AIME-2.0 app and unified to the
canonical brand (Figma/Notion spec): **forest green + gold on near-black**. It
replaces the drifted, fragmented styling (80 per-component CSS files, Tailwind-default
grays/greens/blues, amber, no gold) with a single token source plus a reusable
component library.

## Structure
- `tokens.css` — the single source of truth (CSS custom properties: color, type, spacing, radius, shadow, tap).
- `tokens.ts` — same values as TS exports, for the React app to consume (Phase D).
- `components/<Name>/index.html` — token-driven component previews. Each begins with a
  `<!-- @dsCard group="..." -->` marker that the Claude Design pane (DesignSync) reads.
- `screens/<Name>/index.html` — four hero screens proving the system end to end
  (Splash S-01, Putt Read / Aim Line S-24, Hole Overview S-09, Round Summary S-35).
- `index.html` — gallery / contact sheet of every component + screen.

## Brand tokens
| Token | Value | Use |
|---|---|---|
| `--bg` | `#1a1a1a` | app background |
| `--surface` | `#2a2a2a` | cards, inputs |
| `--primary` | `#2d6a4f` | forest green, structural + secondary CTAs |
| `--accent` | `#c9a227` | **gold**, primary CTAs, hero numbers, highlights |
| `--good` / `--bad` | `#3fae74` / `#c0392b` | under / over par |

Score colors: eagle gold, birdie green, par neutral, bogey/double reds.

## Claude Design sync
This library is the input to the **`/design-sync`** flow (DesignSync tool): it is pushed
into one `claude.ai/design` design-system project so the streamlined system is the shared
source of truth, kept in sync with this repo. Cards are grouped by the `@dsCard group=...`
markers (Actions, Surfaces, Data Display, Forms, Feedback, Navigation, Golf Canvas, Layout, Screens).

## Next (Phase D, not in this pass)
Retone the 45 React screens to `tokens.css` / `tokens.ts` + these components; migrate
CRA → Vite; wire `PuttingGuidance` to the live `/solve_putt`.
