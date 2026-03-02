import { useId } from 'react';

function Professor({ size = 32, className = "" }) {
    const uid = useId().replace(/:/g, '');
    const clipId = `prof-${uid}`;

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 80 80"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="Professor"
        >
            <defs>
                <clipPath id={clipId}>
                    <circle cx="40" cy="40" r="38" />
                </clipPath>
            </defs>

            <g clipPath={`url(#${clipId})`}>
                {/* Background */}
                <circle cx="40" cy="40" r="40" fill="#f5e4c0" />

                {/* Hair — slightly wild, academic */}
                <ellipse cx="40" cy="25" rx="23" ry="18" fill="#3a1e08" />
                {/* Side wisps */}
                <path d="M19 32 Q12 16 24 11 Q27 22 19 32Z" fill="#3a1e08" />
                <path d="M61 32 Q68 16 56 11 Q53 22 61 32Z" fill="#3a1e08" />
                {/* Crown tufts */}
                <path d="M35 10 Q33 3 38 1 Q40 6 35 10Z" fill="#3a1e08" />
                <path d="M45 10 Q47 3 42 1 Q40 6 45 10Z" fill="#3a1e08" />

                {/* Face */}
                <ellipse cx="40" cy="47" rx="21" ry="24" fill="#f0ca85" />

                {/* Ears */}
                <ellipse cx="19" cy="47" rx="3.5" ry="5" fill="#e8c070" />
                <ellipse cx="61" cy="47" rx="3.5" ry="5" fill="#e8c070" />

                {/* Eyebrows — slightly raised, inquisitive */}
                <path d="M22 37 Q30 33 37 36" stroke="#3a1e08" fill="none" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M43 36 Q50 33 58 37" stroke="#3a1e08" fill="none" strokeWidth="2.2" strokeLinecap="round" />

                {/* Glasses — left lens */}
                <circle cx="30" cy="44" r="8.5" fill="rgba(245,225,175,0.5)" stroke="#3a1e08" strokeWidth="2" />
                {/* Glasses — right lens */}
                <circle cx="50" cy="44" r="8.5" fill="rgba(245,225,175,0.5)" stroke="#3a1e08" strokeWidth="2" />
                {/* Bridge */}
                <path d="M38.5 43.5 Q40 42 41.5 43.5" stroke="#3a1e08" fill="none" strokeWidth="1.8" />
                {/* Left temple */}
                <line x1="21.5" y1="43" x2="13" y2="41" stroke="#3a1e08" strokeWidth="1.8" strokeLinecap="round" />
                {/* Right temple */}
                <line x1="58.5" y1="43" x2="67" y2="41" stroke="#3a1e08" strokeWidth="1.8" strokeLinecap="round" />

                {/* Eyes */}
                <circle cx="30" cy="44" r="3" fill="#1a0800" />
                <circle cx="50" cy="44" r="3" fill="#1a0800" />
                {/* Highlights */}
                <circle cx="31.3" cy="42.5" r="1.1" fill="white" opacity="0.8" />
                <circle cx="51.3" cy="42.5" r="1.1" fill="white" opacity="0.8" />

                {/* Nose */}
                <path d="M38 53 Q40 57 42 53" stroke="#b07840" fill="none" strokeWidth="1.3" strokeLinecap="round" />

                {/* Mustache */}
                <path d="M31 57 Q36 63 40 60 Q44 63 49 57" fill="#3a1e08" opacity="0.9" />

                {/* Smile */}
                <path d="M34 65 Q40 72 46 65" stroke="#3a1e08" fill="none" strokeWidth="1.5" strokeLinecap="round" />

                {/* Shirt collar */}
                <path d="M12 84 L26 70 L33 67 L40 71 L47 67 L54 70 L68 84Z" fill="#f8f2e6" />

                {/* Bow tie */}
                <path d="M35 67 L40 71.5 L35 76Z" fill="#c07830" />
                <path d="M45 67 L40 71.5 L45 76Z" fill="#c07830" />
                <circle cx="40" cy="71.5" r="2.2" fill="#3a1e08" />
            </g>

            {/* Border ring */}
            <circle cx="40" cy="40" r="38" fill="none" stroke="#8b5c2a" strokeWidth="1.5" />
        </svg>
    );
}

export default Professor;