// Era color palette — used across Explore, TrendingContent, and MapPostCard
// Each era maps to a distinct hue within the Living Archive palette

const ERA_COLORS = {
    'Pre-1900': { bg: '#B8924A', text: '#fff', light: 'rgba(184,146,74,0.12)', border: 'rgba(184,146,74,0.35)' },
    '1900s':    { bg: '#4A7B8A', text: '#fff', light: 'rgba(74,123,138,0.12)', border: 'rgba(74,123,138,0.35)' },
    '1920s':    { bg: '#4A7B8A', text: '#fff', light: 'rgba(74,123,138,0.12)', border: 'rgba(74,123,138,0.35)' },
    '1930s':    { bg: '#4A7B8A', text: '#fff', light: 'rgba(74,123,138,0.12)', border: 'rgba(74,123,138,0.35)' },
    '1940s':    { bg: '#4A7B8A', text: '#fff', light: 'rgba(74,123,138,0.12)', border: 'rgba(74,123,138,0.35)' },
    '1950s':    { bg: '#5E8C5E', text: '#fff', light: 'rgba(94,140,94,0.12)',  border: 'rgba(94,140,94,0.35)'  },
    '1960s':    { bg: '#5E8C5E', text: '#fff', light: 'rgba(94,140,94,0.12)',  border: 'rgba(94,140,94,0.35)'  },
    '1970s':    { bg: '#5E8C5E', text: '#fff', light: 'rgba(94,140,94,0.12)',  border: 'rgba(94,140,94,0.35)'  },
    '1980s':    { bg: '#5E8C5E', text: '#fff', light: 'rgba(94,140,94,0.12)',  border: 'rgba(94,140,94,0.35)'  },
    '1990s':    { bg: '#5E8C5E', text: '#fff', light: 'rgba(94,140,94,0.12)',  border: 'rgba(94,140,94,0.35)'  },
    '2000s':    { bg: '#9A8A7A', text: '#fff', light: 'rgba(154,138,122,0.12)', border: 'rgba(154,138,122,0.35)' },
    '2010s+':   { bg: '#9A8A7A', text: '#fff', light: 'rgba(154,138,122,0.12)', border: 'rgba(154,138,122,0.35)' },
};

const DEFAULT_COLOR = { bg: '#9A8A7A', text: '#fff', light: 'rgba(154,138,122,0.12)', border: 'rgba(154,138,122,0.35)' };

/** Get era colors for a given era label */
export function getEraColor(eraLabel) {
    return ERA_COLORS[eraLabel] || DEFAULT_COLOR;
}

/**
 * Get era label for a given year number
 * Mirrors ERA_DEFINITIONS from Explore/TrendingContent
 */
export function getEraLabelForYear(year) {
    if (!year) return null;
    if (year < 1900) return 'Pre-1900';
    if (year < 1920) return '1900s';
    if (year < 1930) return '1920s';
    if (year < 1940) return '1930s';
    if (year < 1950) return '1940s';
    if (year < 1960) return '1950s';
    if (year < 1970) return '1960s';
    if (year < 1980) return '1970s';
    if (year < 1990) return '1980s';
    if (year < 2000) return '1990s';
    if (year < 2010) return '2000s';
    return '2010s+';
}
