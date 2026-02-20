// ─── Echoes Design Tokens ────────────────────────────────────────────────────
// Raw HSL values live in index.css as --echoes-* CSS variables.
// This file re-exports them for JS/inline-style usage.
//
// Usage:
//   import { palette, alpha } from '../styles/theme';
//   style={{ color: palette.brown }}
//   style={{ background: alpha('--echoes-amber', 0.15) }}

export const palette = {
    cream: 'hsl(var(--echoes-cream))',
    brown: 'hsl(var(--echoes-brown))',
    amber: 'hsl(var(--echoes-amber))',
    sage:  'hsl(var(--echoes-sage))',
    muted: 'hsl(var(--echoes-muted))',
};

/** Returns a color token at a given opacity, e.g. alpha('--echoes-amber', 0.25) */
export const alpha = (token, opacity) => `hsl(var(${token}) / ${opacity})`;
