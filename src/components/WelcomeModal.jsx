import React, { useState, useEffect } from 'react';
import { Users, Brain, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog';
import { palette, alpha } from '../styles/theme';

const WELCOMED_KEY = 'echoes_welcomed';

const SLIDES = [
    {
        icon: Users,
        title: 'Welcome to Echoes',
        body: "You're now part of a community preserving history. Thousands of historical photos, shared and analyzed by people like you.",
    },
    {
        icon: Brain,
        title: 'AI-Powered Analysis',
        body: "Every photo is analyzed by AI — decade, location, cultural context. Look for the 'Show AI analysis' button on any post.",
    },
    {
        icon: Upload,
        title: 'Share Your Memories',
        body: 'Upload your own historical photos and let AI uncover their story. Watch the agent detect the era, location, and significance in seconds.',
    },
];

export default function WelcomeModal() {
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [slide, setSlide] = useState(0);

    useEffect(() => {
        if (isAuthenticated && localStorage.getItem(WELCOMED_KEY) !== 'true') {
            localStorage.setItem(WELCOMED_KEY, 'true');
            setOpen(true);
        }
    }, [isAuthenticated]);

    const handleClose = () => setOpen(false);

    const handleGetStarted = () => {
        handleClose();
        navigate('/upload');
    };

    const isLast = slide === SLIDES.length - 1;
    const { icon: Icon, title, body } = SLIDES[slide];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className="max-w-sm p-0 overflow-hidden gap-0 [&>button]:hidden"
                style={{
                    background: palette.cream,
                    border: `2px solid ${alpha('--echoes-amber', 0.3)}`,
                    boxShadow: `6px 6px 0px ${alpha('--echoes-amber', 0.2)}`,
                    fontFamily: "'Lora', Georgia, serif",
                }}
            >
                {/* Skip */}
                <div className="flex justify-end px-5 pt-4">
                    <button
                        onClick={handleClose}
                        className="text-xs transition-colors"
                        style={{ color: palette.muted }}
                        onMouseEnter={e => e.currentTarget.style.color = palette.brown}
                        onMouseLeave={e => e.currentTarget.style.color = palette.muted}
                    >
                        Skip
                    </button>
                </div>

                {/* Slide content */}
                <div className="px-8 pb-6 pt-2 text-center">
                    {/* Icon */}
                    <div
                        className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                        style={{ background: alpha('--echoes-amber', 0.12) }}
                    >
                        <Icon size={26} style={{ color: palette.amber }} strokeWidth={1.6} />
                    </div>

                    {/* Title */}
                    <h2
                        className="text-xl font-bold mb-3 leading-tight"
                        style={{ color: palette.brown, letterSpacing: '-0.02em' }}
                    >
                        {title}
                    </h2>

                    {/* Body */}
                    <p
                        className="text-sm leading-relaxed"
                        style={{ color: palette.muted }}
                    >
                        {body}
                    </p>
                </div>

                {/* Footer */}
                <div
                    className="px-8 pb-7 flex flex-col items-center gap-4"
                    style={{ borderTop: `1px solid ${alpha('--echoes-amber', 0.15)}`, paddingTop: '1.25rem' }}
                >
                    {/* Dot indicators */}
                    <div className="flex gap-1.5">
                        {SLIDES.map((_, i) => (
                            <div
                                key={i}
                                className="rounded-full transition-all duration-200"
                                style={{
                                    width: i === slide ? 18 : 6,
                                    height: 6,
                                    background: i === slide
                                        ? palette.amber
                                        : alpha('--echoes-amber', 0.25),
                                }}
                            />
                        ))}
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex gap-3 w-full">
                        {slide > 0 && (
                            <button
                                onClick={() => setSlide(s => s - 1)}
                                className="flex-1 py-2 text-sm font-medium transition-colors"
                                style={{
                                    border: `1px solid ${alpha('--echoes-amber', 0.35)}`,
                                    color: palette.muted,
                                }}
                                onMouseEnter={e => e.currentTarget.style.color = palette.brown}
                                onMouseLeave={e => e.currentTarget.style.color = palette.muted}
                            >
                                Back
                            </button>
                        )}

                        <button
                            onClick={isLast ? handleGetStarted : () => setSlide(s => s + 1)}
                            className="flex-1 py-2 text-sm font-semibold transition-all"
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
                            {isLast ? 'Get Started' : 'Next'}
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
