import React from 'react';
import { palette, alpha } from '../../styles/theme';

function Polaroid({ rotate, label, tint = '#D4B896', size = 'md', className = '', imageUrl }) {
    const dimensions = {
        sm: { width: 110, height: 88 },
        md: { width: 208, height: 188 },
    };
    const { width, height } = dimensions[size];

    return (
        <div
            className={`absolute hidden lg:block select-none ${className}`}
            style={{ transform: `rotate(${rotate})` }}
        >
            <div
                className="bg-white p-2 pb-7"
                style={{
                    width,
                    boxShadow: `3px 4px 18px ${alpha('--echoes-brown', 0.18)}, 0 1px 3px ${alpha('--echoes-brown', 0.08)}`,
                }}
            >
                <div
                    className="w-full"
                    style={{
                        height,
                        background: imageUrl ? 'none' : `linear-gradient(135deg, ${tint}cc 0%, ${tint}66 60%, ${tint}99 100%)`,
                        backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <p
                    className="text-center mt-2 text-xs"
                    style={{ fontFamily: "'Caveat', cursive", color: palette.muted, letterSpacing: '0.02em' }}
                >
                    {label}
                </p>
            </div>
        </div>
    );
}

export default Polaroid;
