import React, { useState } from 'react';
import {
    MapPin,
    Search,
    Upload,
    Brain,
    Users,
    ArrowRight,
    Menu,
    X,
    Sun,
    Moon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './theme-provider';
import { palette, alpha } from '../styles/theme';
import Polaroid from './ui/Polaroid';

const features = [
    {
        icon: Users,
        title: 'A Living Feed',
        description: "Scroll through photos you've never seen before — street scenes from the '60s, vintage storefronts, faded family portraits.",
        noteColor: '#FFF9C4',
        rotate: '-1.5deg',
    },
    {
        icon: MapPin,
        title: 'History on the Map',
        description: 'Every photo is tied to a real location. Browse historical moments by place and see what the world looked like decades ago.',
        noteColor: '#F8E8D4',
        rotate: '1deg',
    },
    {
        icon: Search,
        title: 'Explore Any Era',
        description: "Search by decade, city, or subject. 1970s Paris? Cold War Berlin? There's always a photo you haven't discovered yet.",
        noteColor: '#E4EFE5',
        rotate: '-0.8deg',
    },
    {
        icon: Brain,
        title: 'AI Reads the Story',
        description: 'AI detects the time period, location, cultural context, and historical significance — so every post tells its full story.',
        noteColor: '#EDE8F8',
        rotate: '1.8deg',
    },
];

const steps = [
    {
        num: '01',
        icon: Upload,
        title: 'Share a Moment From the Past',
        description: "That photo from grandma's drawer, a vintage street scene, a faded family portrait — upload it and give it a second life.",
    },
    {
        num: '02',
        icon: Brain,
        title: 'AI Adds the Story',
        description: 'Our AI analyzes every detail — architecture, clothing, vehicles, signs — and tells you when, where, and why this photo matters.',
    },
    {
        num: '03',
        icon: Users,
        title: 'The World Sees It Too',
        description: "Your photo joins a living feed of history. Others like it, comment on it, and discover moments they've never seen before.",
    },
];

function StickyNote({ icon: Icon, title, description, noteColor, rotate }) {
    return (
        <div
            style={{
                background: noteColor,
                transform: `rotate(${rotate})`,
                boxShadow: `3px 5px 20px ${alpha('--echoes-brown', 0.12)}`,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            className="p-6 pt-8 relative hover:scale-[1.02] hover:rotate-0 hover:shadow-xl"
            onMouseEnter={e => { e.currentTarget.style.transform = 'rotate(0deg) scale(1.02)'; e.currentTarget.style.boxShadow = `6px 8px 28px ${alpha('--echoes-brown', 0.18)}`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = `rotate(${rotate})`; e.currentTarget.style.boxShadow = `3px 5px 20px ${alpha('--echoes-brown', 0.12)}`; }}
        >
            {/* tape strip at top */}
            <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 rounded-sm"
                style={{ background: alpha('--echoes-amber', 0.25), backdropFilter: 'blur(2px)' }}
            />
            <div className="mb-3 inline-flex">
                <Icon size={20} color={palette.amber} strokeWidth={1.8} />
            </div>
            <h3
                className="text-lg mb-2 font-semibold"
                style={{ fontFamily: "'Caveat', cursive", color: palette.brown, fontSize: '1.25rem', lineHeight: 1.2 }}
            >
                {title}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: palette.muted }}>
                {description}
            </p>
        </div>
    );
}

function LandingPage() {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
    };

    return (
        <div style={{ background: palette.cream, color: palette.brown, fontFamily: "'Lora', Georgia, serif" }}>

            <nav
                className="sticky top-0 z-50 backdrop-blur-md"
                style={{
                    background: alpha('--echoes-cream', 0.88),
                    borderBottom: `1px solid ${alpha('--echoes-amber', 0.19)}`,
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="flex items-center gap-2"
                        >
                            <span className="text-lg font-bold" style={{ color: palette.brown, letterSpacing: '-0.02em' }}>
                                Echoes
                            </span>
                        </button>
                        <div className="hidden md:flex items-center gap-8">
                            <button
                                onClick={() => scrollToSection('features')}
                                className="text-sm transition-colors"
                                style={{ color: palette.muted }}
                                onMouseEnter={e => e.target.style.color = palette.brown}
                                onMouseLeave={e => e.target.style.color = palette.muted}
                            >
                                Features
                            </button>
                            <button
                                onClick={() => scrollToSection('how-it-works')}
                                className="text-sm transition-colors"
                                style={{ color: palette.muted }}
                                onMouseEnter={e => e.target.style.color = palette.brown}
                                onMouseLeave={e => e.target.style.color = palette.muted}
                            >
                                How It Works
                            </button>

                            <button
                                onClick={() => navigate('/login')}
                                className="text-sm px-5 py-2 font-semibold transition-all"
                                style={{
                                    background: palette.brown,
                                    color: palette.cream,
                                    boxShadow: `3px 3px 0px ${palette.amber}`,
                                }}
                                onMouseEnter={e => { e.currentTarget.style.boxShadow = `3px 3px 0px ${palette.brown}`; e.currentTarget.style.background = palette.amber; }}
                                onMouseLeave={e => { e.currentTarget.style.boxShadow = `3px 3px 0px ${palette.amber}`; e.currentTarget.style.background = palette.brown; }}
                            >
                                Get Started
                            </button>
                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="p-2 transition-colors"
                                style={{ color: palette.muted }}
                                onMouseEnter={e => e.currentTarget.style.color = palette.brown}
                                onMouseLeave={e => e.currentTarget.style.color = palette.muted}
                                aria-label="Toggle theme"
                            >
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                        </div>
                        <button
                            className="md:hidden p-2"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            style={{ color: palette.brown }}
                        >
                            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>

                    {mobileMenuOpen && (
                        <div
                            className="md:hidden pb-4 border-t"
                            style={{ borderColor: alpha('--echoes-amber', 0.19) }}
                        >
                            <div className="flex flex-col gap-1 pt-3">
                                {[
                                    { label: 'Features', action: () => scrollToSection('features') },
                                    { label: 'How It Works', action: () => scrollToSection('how-it-works') },
                                    { label: 'Log In', action: () => navigate('/login') },
                                ].map(({ label, action }) => (
                                    <button
                                        key={label}
                                        onClick={action}
                                        className="text-left px-3 py-2 text-sm"
                                        style={{ color: palette.muted }}
                                    >
                                        {label}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                    className="flex items-center gap-2 px-3 py-2 text-sm"
                                    style={{ color: palette.muted }}
                                >
                                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                                    {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                                </button>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="mt-2 mx-3 py-2 text-sm font-semibold"
                                    style={{ background: palette.brown, color: palette.cream }}
                                >
                                    Get Started Free
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
                <div
                    className="absolute inset-0 opacity-40 pointer-events-none"
                    style={{
                        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 27px, ${alpha('--echoes-amber', 0.08)} 28px)`,
                    }}
                />

                {/* Scattered polaroids */}
                <Polaroid rotate="-7deg"  label="Summer '67"      tint="#C9A87A" className="top-[12%] left-[4%]"    imageUrl="https://firebasestorage.googleapis.com/v0/b/echoes-prod-2afe6.firebasestorage.app/o/post_media%2FulTS5Y2Y6ab31Z5v0VNZibJnsRV2%2F1762101847784_Scan%202.11.2025%2C%2010.36.jpg?alt=media&token=edb8677e-f7e7-4db8-b27c-5d8983cb0600" />
                <Polaroid rotate="5deg"   label="Grandma & Joe"  tint="#A89070" className="top-[8%]  right-[6%]"   imageUrl="https://firebasestorage.googleapis.com/v0/b/echoes-prod-2afe6.firebasestorage.app/o/post_media%2FulTS5Y2Y6ab31Z5v0VNZibJnsRV2%2F1762103986842_Jena_1960er.jpg?alt=media&token=05bd1ea6-a90e-4219-926a-8d1042d4514b" />
                <Polaroid rotate="-3deg"  label="Brooklyn, 1952"   tint="#B8927A" className="bottom-[14%] right-[5%]" imageUrl="https://firebasestorage.googleapis.com/v0/b/echoes-prod-2afe6.firebasestorage.app/o/post_media%2FulTS5Y2Y6ab31Z5v0VNZibJnsRV2%2F1762104605109_Goethe_Wohnhaus_Weimar_1966.jpg?alt=media&token=f96fc128-856b-4c94-b72b-5e1a519b581f" />
                <Polaroid rotate="8deg"   label="First car, 1971" tint="#9A8060" className="bottom-[18%] left-[3%]"  imageUrl="https://firebasestorage.googleapis.com/v0/b/echoes-prod-2afe6.firebasestorage.app/o/post_media%2FulTS5Y2Y6ab31Z5v0VNZibJnsRV2%2F1762106202384_Ga%CC%88nsema%CC%88nnchenbrunnen_Weimar_1966.jpg?alt=media&token=adee0f45-83b9-43aa-89eb-1c240aef8c51" />

                {/* Glow blob */}
                <div
                    className="absolute pointer-events-none"
                    style={{
                        width: 500, height: 500,
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${alpha('--echoes-amber', 0.09)} 0%, transparent 70%)`,
                        top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                />

                {/* Main copy */}
                <div className="relative z-10 text-center max-w-3xl">
                    <h1
                        className="font-bold leading-tight mb-6"
                        style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', letterSpacing: '-0.03em', color: palette.brown, lineHeight: 1.05 }}
                    >
                        History lives in
                        <span className="block italic relative inline-block w-full">
                            your drawer.
                            {/* Hand-drawn SVG underline */}
                            <svg
                                viewBox="0 0 420 14"
                                fill="none"
                                className="absolute w-full"
                                style={{ bottom: '-6px', left: 0 }}
                                preserveAspectRatio="none"
                            >
                                <path
                                    d="M4 9 Q 60 3, 140 8 Q 220 13, 300 7 Q 370 3, 416 9"
                                    stroke={palette.amber}
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    fill="none"
                                />
                            </svg>
                        </span>
                    </h1>

                    <p
                        className="max-w-xl mx-auto text-lg leading-relaxed mb-10"
                        style={{ color: palette.muted }}
                    >
                        Upload old photos. AI will uncover their story - the era, the place, the moment.
                        Then share them with people who care.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/login')}
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold text-base transition-all"
                            style={{
                                background: palette.brown,
                                color: palette.cream,
                                boxShadow: `4px 4px 0px ${palette.amber}`,
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = palette.amber; e.currentTarget.style.boxShadow = `4px 4px 0px ${palette.brown}`; }}
                            onMouseLeave={e => { e.currentTarget.style.background = palette.brown; e.currentTarget.style.boxShadow = `4px 4px 0px ${palette.amber}`; }}
                        >
                            Open the Shoebox
                            <ArrowRight size={18} />
                        </button>
                        <button
                            onClick={() => scrollToSection('how-it-works')}
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold text-base transition-all border"
                            style={{
                                background: 'transparent',
                                color: palette.brown,
                                borderColor: alpha('--echoes-brown', 0.31),
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = palette.amber; e.currentTarget.style.color = palette.amber; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = alpha('--echoes-brown', 0.31); e.currentTarget.style.color = palette.brown; }}
                        >
                            See How It Works
                        </button>
                    </div>
                </div>
            </section>

            <section id="features" className="py-28 px-4">
                <div className="max-w-6xl mx-auto">

                    <div className="text-center mb-20">
                        <p
                            className="text-xl mb-3"
                            style={{ fontFamily: "'Caveat', cursive", color: palette.amber }}
                        >
                            what you get
                        </p>
                        <h2
                            className="font-bold"
                            style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', letterSpacing: '-0.02em', color: palette.brown }}
                        >
                            Social Media for History Lovers
                        </h2>
                        <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: palette.muted }}>
                            Share, discover, and discuss historical photos — with AI adding the context you never knew was there
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
                        {features.map((f) => (
                            <StickyNote key={f.title} {...f} />
                        ))}
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="py-28 px-4" style={{ background: alpha('--echoes-brown', 0.03) }}>
                <div className="max-w-5xl mx-auto">

                    <div className="text-center mb-20">
                        <p
                            className="text-xl mb-3"
                            style={{ fontFamily: "'Caveat', cursive", color: palette.amber }}
                        >
                            three simple steps
                        </p>
                        <h2
                            className="font-bold"
                            style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', letterSpacing: '-0.02em', color: palette.brown }}
                        >
                            How It Works
                        </h2>
                        <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: palette.muted }}>
                            From a dusty photo to a shared piece of history — in three steps
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 md:gap-8">
                        {steps.map((step) => {
                            const Icon = step.icon;
                            return (
                                <div key={step.num} className="text-left relative">
                                    {/* Big handwritten step number */}
                                    <span
                                        className="block leading-none mb-2"
                                        style={{
                                            fontFamily: "'Caveat', cursive",
                                            fontSize: '5rem',
                                            color: alpha('--echoes-amber', 0.25),
                                            lineHeight: 1,
                                        }}
                                    >
                                        {step.num}
                                    </span>

                                    <div
                                        className="inline-flex items-center justify-center w-10 h-10 rounded-full mb-4"
                                        style={{ background: alpha('--echoes-amber', 0.09) }}
                                    >
                                        <Icon size={18} color={palette.amber} strokeWidth={1.8} />
                                    </div>

                                    <h3
                                        className="font-semibold mb-3 text-lg"
                                        style={{ color: palette.brown, letterSpacing: '-0.01em' }}
                                    >
                                        {step.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed" style={{ color: palette.muted }}>
                                        {step.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="py-28 px-4">
                <div className="max-w-3xl mx-auto">
                    <div
                        className="relative text-center px-8 py-16 md:py-20"
                        style={{
                            background: palette.cream,
                            border: `2px solid ${alpha('--echoes-amber', 0.31)}`,
                            boxShadow: `8px 8px 0px ${alpha('--echoes-amber', 0.19)}`,
                        }}
                    >
                        {/* Corner decorations */}
                        {[
                            'top-3 left-3',
                            'top-3 right-3',
                            'bottom-3 left-3',
                            'bottom-3 right-3',
                        ].map((pos) => (
                            <div
                                key={pos}
                                className={`absolute ${pos} w-4 h-4`}
                                style={{
                                    borderTop: pos.includes('top') ? `2px solid ${palette.amber}` : 'none',
                                    borderBottom: pos.includes('bottom') ? `2px solid ${palette.amber}` : 'none',
                                    borderLeft: pos.includes('left') ? `2px solid ${palette.amber}` : 'none',
                                    borderRight: pos.includes('right') ? `2px solid ${palette.amber}` : 'none',
                                }}
                            />
                        ))}

                        <p
                            className="text-2xl mb-4"
                            style={{ fontFamily: "'Caveat', cursive", color: palette.amber }}
                        >
                            don't let it sit forgotten
                        </p>
                        <h2
                            className="font-bold mb-5"
                            style={{
                                fontSize: 'clamp(2rem, 5vw, 3rem)',
                                letterSpacing: '-0.02em',
                                color: palette.brown,
                            }}
                        >
                            That Photo Deserves to Be Seen
                        </h2>
                        <p className="text-lg mb-10 max-w-lg mx-auto" style={{ color: palette.muted }}>
                            Share it. Let AI tell its story. Let the world discover it.
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            className="inline-flex items-center gap-2 px-10 py-4 font-semibold text-base transition-all"
                            style={{
                                background: palette.brown,
                                color: palette.cream,
                                boxShadow: `4px 4px 0px ${palette.amber}`,
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = palette.amber; e.currentTarget.style.boxShadow = `4px 4px 0px ${palette.brown}`; }}
                            onMouseLeave={e => { e.currentTarget.style.background = palette.brown; e.currentTarget.style.boxShadow = `4px 4px 0px ${palette.amber}`; }}
                        >
                            Get Started Free
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </section>

            <footer
                className="py-8 border-t"
                style={{ borderColor: alpha('--echoes-amber', 0.19) }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold" style={{ color: palette.brown }}>Echoes</span>
                    </div>
                    <p className="text-xs" style={{ color: palette.muted }}>
                        © 2025 Echoes. All rights reserved.
                    </p>
                </div>
            </footer>

        </div>
    );
}

export default LandingPage;
