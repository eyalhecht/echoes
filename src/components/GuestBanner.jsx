import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { palette, alpha } from '../styles/theme';

const DISMISSED_KEY = 'echoes_banner_dismissed';

export default function GuestBanner() {
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [dismissed, setDismissed] = useState(
        () => localStorage.getItem(DISMISSED_KEY) === 'true'
    );

    if (isAuthenticated || dismissed) return null;

    const handleDismiss = () => {
        localStorage.setItem(DISMISSED_KEY, 'true');
        setDismissed(true);
    };

    return (
        <div
            className="flex items-center justify-between gap-3 px-4 py-2.5"
            style={{
                background: alpha('--echoes-amber', 0.1),
                borderBottom: `1px solid ${alpha('--echoes-amber', 0.22)}`,
                fontFamily: "'Lora', Georgia, serif",
            }}
        >
            <p className="text-sm font-bold leading-snug flex-1" style={{ color: palette.brown }}>
                You're browsing real historical photos, AI-analyzed.{' '}
                <span style={{ color: palette.muted }}>
                    Sign up to like, comment, and share your own.
                </span>
            </p>

            <div className="flex items-center gap-2 flex-shrink-0">
                <button
                    onClick={() => navigate('/login')}
                    className="text-sm font-semibold px-3 py-1 transition-all"
                    style={{
                        background: palette.brown,
                        color: palette.cream,
                        boxShadow: `2px 2px 0px ${palette.amber}`,
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = palette.amber;
                        e.currentTarget.style.boxShadow = `2px 2px 0px ${palette.brown}`;
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = palette.brown;
                        e.currentTarget.style.boxShadow = `2px 2px 0px ${palette.amber}`;
                    }}
                >
                    Join Echoes
                </button>

                <button
                    onClick={handleDismiss}
                    className="p-1 transition-colors"
                    style={{ color: palette.muted }}
                    onMouseEnter={e => e.currentTarget.style.color = palette.brown}
                    onMouseLeave={e => e.currentTarget.style.color = palette.muted}
                    aria-label="Dismiss"
                >
                    <X size={15} />
                </button>
            </div>
        </div>
    );
}
