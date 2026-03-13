const selectedSvg = encodeURIComponent(`
  <svg width="48" height="60" viewBox="0 0 48 60" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="fill" cx="38%" cy="30%" r="65%">
        <stop offset="0%" stop-color="hsl(31,64%,65%)"/>
        <stop offset="100%" stop-color="hsl(22,51%,25%)"/>
      </radialGradient>
      <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="4" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="hsl(22,51%,16%)" flood-opacity="0.4"/>
      </filter>
    </defs>
    <circle cx="24" cy="24" r="22" fill="none" stroke="hsl(31,64%,52%)" stroke-width="1.5" opacity="0.5" filter="url(#glow)"/>
    <path d="M24 54 C24 54, 42 34, 42 24 C42 14, 34 6, 24 6 C14 6, 6 14, 6 24 C6 34, 24 54, 24 54 Z"
          fill="url(#fill)" stroke="hsl(35,80%,82%)" stroke-width="1.5" filter="url(#shadow)"/>
    <circle cx="24" cy="24" r="11" fill="white" opacity="0.95"/>
    <circle cx="24" cy="24" r="7" fill="hsl(31,64%,47%)" opacity="0.9"/>
    <circle cx="24" cy="24" r="3.5" fill="white"/>
    <circle cx="24" cy="24" r="1.4" fill="hsl(22,51%,30%)"/>
    <line x1="24" y1="17" x2="24" y2="31" stroke="white" stroke-width="0.7" opacity="0.35"/>
    <line x1="17" y1="24" x2="31" y2="24" stroke="white" stroke-width="0.7" opacity="0.35"/>
    <line x1="19" y1="19" x2="29" y2="29" stroke="white" stroke-width="0.7" opacity="0.35"/>
    <line x1="29" y1="19" x2="19" y2="29" stroke="white" stroke-width="0.7" opacity="0.35"/>
  </svg>
`);

const defaultSvg = encodeURIComponent(`
  <svg width="36" height="45" viewBox="0 0 36 45" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="fill" cx="38%" cy="30%" r="65%">
        <stop offset="0%" stop-color="hsl(31,64%,58%)"/>
        <stop offset="100%" stop-color="hsl(22,51%,32%)"/>
      </radialGradient>
      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="hsl(22,51%,16%)" flood-opacity="0.3"/>
      </filter>
    </defs>
    <path d="M18 40.5 C18 40.5, 32 25.5, 32 18 C32 10.3, 25.7 4, 18 4 C10.3 4, 4 10.3, 4 18 C4 25.5, 18 40.5, 18 40.5 Z"
          fill="url(#fill)" stroke="hsl(35,70%,78%)" stroke-width="1.2" filter="url(#shadow)"/>
    <circle cx="18" cy="18" r="8" fill="white" opacity="0.92"/>
    <circle cx="18" cy="18" r="4.5" fill="hsl(31,64%,47%)" opacity="0.85"/>
    <circle cx="18" cy="18" r="2" fill="white"/>
    <circle cx="18" cy="18" r="0.8" fill="hsl(22,51%,30%)"/>
    <line x1="18" y1="13.5" x2="18" y2="22.5" stroke="white" stroke-width="0.6" opacity="0.35"/>
    <line x1="13.5" y1="18" x2="22.5" y2="18" stroke="white" stroke-width="0.6" opacity="0.35"/>
    <line x1="14.8" y1="14.8" x2="21.2" y2="21.2" stroke="white" stroke-width="0.6" opacity="0.35"/>
    <line x1="21.2" y1="14.8" x2="14.8" y2="21.2" stroke="white" stroke-width="0.6" opacity="0.35"/>
  </svg>
`);

export function getMarkerIcon(isHighlighted) {
    if (!window.google?.maps) return undefined;
    if (isHighlighted) {
        return {
            url: 'data:image/svg+xml;charset=UTF-8,' + selectedSvg,
            scaledSize: new window.google.maps.Size(48, 60),
            anchor: new window.google.maps.Point(24, 54),
        };
    }
    return {
        url: 'data:image/svg+xml;charset=UTF-8,' + defaultSvg,
        scaledSize: new window.google.maps.Size(36, 45),
        anchor: new window.google.maps.Point(18, 40.5),
    };
}
