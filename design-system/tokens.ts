/**
 * AIME Golf — Design Tokens (single source of truth, TS mirror of tokens.css).
 * Canonical brand: forest green + GOLD on near-black. Import these into the
 * React app (Phase D) so screens stop hardcoding colors.
 */
export const tokens = {
  color: {
    bg: "#1a1a1a",
    surface: "#2a2a2a",
    surface2: "#222222",
    greenDeep: "#16291d",
    line: "rgba(255,255,255,0.10)",
    lineStrong: "rgba(255,255,255,0.16)",

    primary: "#2d6a4f",
    primaryPress: "#245a42",
    accent: "#c9a227",
    accentSoft: "#e4c65a",
    accentPress: "#a9871d",

    text: "#ffffff",
    muted: "#999999",
    dim: "#666666",

    good: "#3fae74",
    bad: "#c0392b",
    score: {
      eagle: "#c9a227",
      birdie: "#2d6a4f",
      par: "#2a2a2a",
      bogey: "#8b0000",
      double: "#4a0000",
    },
  },
  font: {
    sans: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, system-ui, sans-serif',
    mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace',
  },
  fontSize: { display: 48, h1: 28, h2: 20, body: 16, sm: 14, xs: 12 },
  fontWeight: { reg: 400, med: 500, semi: 600, bold: 700 },
  space: { 1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, 7: 48 },
  radius: { sm: 8, md: 12, lg: 18, pill: 999 },
  shadow: {
    default: "0 24px 60px -28px rgba(0,0,0,0.8)",
    sm: "0 8px 24px -12px rgba(0,0,0,0.6)",
  },
  tap: 44,
} as const;

export type Tokens = typeof tokens;
export default tokens;
