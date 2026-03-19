const selectedSvg = encodeURIComponent(`
  <svg width="48" height="60" viewBox="0 0 48 60" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="fillSel" cx="38%" cy="30%" r="65%">
        <stop offset="0%" stop-color="hsl(31,64%,65%)"/>
        <stop offset="100%" stop-color="hsl(22,51%,25%)"/>
      </radialGradient>
      <filter id="glowSel" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="4" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="shadowSel" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="hsl(22,51%,16%)" flood-opacity="0.4"/>
      </filter>
    </defs>
    <circle cx="24" cy="24" r="22" fill="none" stroke="hsl(31,64%,52%)" stroke-width="1.5" opacity="0.5" filter="url(#glowSel)"/>
    <path d="M24 54 C24 54, 42 34, 42 24 C42 14, 34 6, 24 6 C14 6, 6 14, 6 24 C6 34, 24 54, 24 54 Z"
          fill="url(#fillSel)" stroke="hsl(35,80%,82%)" stroke-width="1.5" filter="url(#shadowSel)"/>
    <circle cx="24" cy="24" r="11" fill="white" opacity="0.95"/>
    <circle cx="24" cy="24" r="7" fill="hsl(31,64%,47%)" opacity="0.9"/>
    <circle cx="24" cy="24" r="3.5" fill="white"/>
    <circle cx="24" cy="24" r="1.4" fill="hsl(22,51%,30%)"/>
  </svg>
`);

const hoveredSvg = encodeURIComponent(`
  <svg width="42" height="52" viewBox="0 0 42 52" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="fillHov" cx="38%" cy="30%" r="65%">
        <stop offset="0%" stop-color="hsl(31,70%,72%)"/>
        <stop offset="100%" stop-color="hsl(22,55%,38%)"/>
      </radialGradient>
      <filter id="shadowHov" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="hsl(22,51%,16%)" flood-opacity="0.35"/>
      </filter>
    </defs>
    <path d="M21 48 C21 48, 37 31, 37 21 C37 11.6, 29.9 4, 21 4 C12.1 4, 5 11.6, 5 21 C5 31, 21 48, 21 48 Z"
          fill="url(#fillHov)" stroke="hsl(35,75%,85%)" stroke-width="1.5" filter="url(#shadowHov)"/>
    <circle cx="21" cy="21" r="9.5" fill="white" opacity="0.95"/>
    <circle cx="21" cy="21" r="6" fill="hsl(31,64%,52%)" opacity="0.9"/>
    <circle cx="21" cy="21" r="3" fill="white"/>
  </svg>
`);

const defaultSvg = encodeURIComponent(`
  <svg width="36" height="45" viewBox="0 0 36 45" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="fillDef" cx="38%" cy="30%" r="65%">
        <stop offset="0%" stop-color="hsl(31,64%,58%)"/>
        <stop offset="100%" stop-color="hsl(22,51%,32%)"/>
      </radialGradient>
      <filter id="shadowDef" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="hsl(22,51%,16%)" flood-opacity="0.3"/>
      </filter>
    </defs>
    <path d="M18 40.5 C18 40.5, 32 25.5, 32 18 C32 10.3, 25.7 4, 18 4 C10.3 4, 4 10.3, 4 18 C4 25.5, 18 40.5, 18 40.5 Z"
          fill="url(#fillDef)" stroke="hsl(35,70%,78%)" stroke-width="1.2" filter="url(#shadowDef)"/>
    <circle cx="18" cy="18" r="8" fill="white" opacity="0.92"/>
    <circle cx="18" cy="18" r="4.5" fill="hsl(31,64%,47%)" opacity="0.85"/>
    <circle cx="18" cy="18" r="2" fill="white"/>
  </svg>
`);

export function getMarkerIcon(isSelected, isHovered = false) {
    if (!window.google?.maps) return undefined;

    if (isSelected) {
        return {
            url: 'data:image/svg+xml;charset=UTF-8,' + selectedSvg,
            scaledSize: new window.google.maps.Size(48, 60),
            anchor: new window.google.maps.Point(24, 54),
        };
    }
    if (isHovered) {
        return {
            url: 'data:image/svg+xml;charset=UTF-8,' + hoveredSvg,
            scaledSize: new window.google.maps.Size(42, 52),
            anchor: new window.google.maps.Point(21, 48),
        };
    }
    return {
        url: 'data:image/svg+xml;charset=UTF-8,' + defaultSvg,
        scaledSize: new window.google.maps.Size(36, 45),
        anchor: new window.google.maps.Point(18, 40.5),
    };
}
