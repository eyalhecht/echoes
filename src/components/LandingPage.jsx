import React, { useState, useEffect } from 'react';
import {
    ArrowRight,
    Menu,
    X,
    Sun,
    Moon,
    Heart,
    MessageCircle,
    Bookmark,
    Brain,
    MapPin,
    Check,
    Sparkles,
    Clock,
    Play,
    Tag,
    Globe,
    FileText,
    Shield,
    BookOpen,
    ChevronDown,
    Users,
    Search,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './theme-provider';
import { palette, alpha } from '../styles/theme';
import Polaroid from './ui/Polaroid';
import Professor from './Professor.jsx';

// ── Features (sticky notes) ───────────────────────────────────────────────────

const FEATURES = [
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

function StickyNote({ icon: Icon, title, description, noteColor, rotate }) {
    return (
        <div
            style={{
                background: noteColor,
                transform: `rotate(${rotate})`,
                boxShadow: `3px 5px 20px ${alpha('--echoes-brown', 0.12)}`,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            className="p-6 pt-8 relative"
            onMouseEnter={e => { e.currentTarget.style.transform = 'rotate(0deg) scale(1.02)'; e.currentTarget.style.boxShadow = `6px 8px 28px ${alpha('--echoes-brown', 0.18)}`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = `rotate(${rotate})`; e.currentTarget.style.boxShadow = `3px 5px 20px ${alpha('--echoes-brown', 0.12)}`; }}
        >
            {/* tape strip */}
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

// ── Mock feed data ─────────────────────────────────────────────────────────────

const MOCK_POSTS = [
    {
        id: 'p1',
        user: 'Sarah K.',
        initials: 'SK',
        avatarColor: '#C9A87A',
        timeAgo: '2 days ago',
        caption: "Found this in grandma's attic. She never talked much about her childhood in Germany…",
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/echoes-prod-2afe6.firebasestorage.app/o/post_media%2FulTS5Y2Y6ab31Z5v0VNZibJnsRV2%2F1762103986842_Jena_1960er.jpg?alt=media&token=05bd1ea6-a90e-4219-926a-8d1042d4514b',
        year: '~1963',
        likes: 142,
        comments: 23,
        bookmarks: 31,
        ai: {
            date_estimate: '1960–1965',
            location: 'Jena, East Germany',
            description: 'A street scene from Jena, East Germany in the early 1960s. GDR-era architecture lines the background alongside civilians in typical period clothing. The photo captures everyday life during the early Cold War.',
            tags: ['East Germany', '1960s', 'Cold War', 'Urban life'],
        },
    },
    {
        id: 'p2',
        user: 'Marcus H.',
        initials: 'MH',
        avatarColor: '#A89070',
        timeAgo: '5 days ago',
        caption: "My grandfather's photo from Weimar, 1966. He was studying architecture there.",
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/echoes-prod-2afe6.firebasestorage.app/o/post_media%2FulTS5Y2Y6ab31Z5v0VNZibJnsRV2%2F1762104605109_Goethe_Wohnhaus_Weimar_1966.jpg?alt=media&token=f96fc128-856b-4c94-b72b-5e1a519b581f',
        year: '1966',
        likes: 89,
        comments: 14,
        bookmarks: 22,
        ai: {
            date_estimate: '1966',
            location: 'Weimar, Germany',
            description: 'The Goethe Wohnhaus in Weimar, captured in 1966. The residence of Johann Wolfgang von Goethe — now a UNESCO World Heritage Site — is shown in its GDR-era context with characteristic period preservation.',
            tags: ['Weimar', 'Goethe', 'Architecture', 'UNESCO', 'GDR'],
        },
    },
    {
        id: 'p3',
        user: 'Lena V.',
        initials: 'LV',
        avatarColor: '#9A8060',
        timeAgo: '1 week ago',
        caption: "Summer '67. My mother still remembers this day perfectly.",
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/echoes-prod-2afe6.firebasestorage.app/o/post_media%2FulTS5Y2Y6ab31Z5v0VNZibJnsRV2%2F1762101847784_Scan%202.11.2025%2C%2010.36.jpg?alt=media&token=edb8677e-f7e7-4db8-b27c-5d8983cb0600',
        year: '~1967',
        likes: 234,
        comments: 41,
        bookmarks: 67,
        ai: {
            date_estimate: '1966–1968',
            location: 'Central Europe',
            description: 'A candid summer photograph showing civilians in late 1960s attire. Clothing styles, hairstyles, and photographic grain all point to the latter half of the 1960s, likely taken in Central Europe.',
            tags: ['1960s', 'Summer', 'Everyday life', 'Analog photography'],
        },
    },
];

const UPLOAD_DEMO = {
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/echoes-prod-2afe6.firebasestorage.app/o/post_media%2FulTS5Y2Y6ab31Z5v0VNZibJnsRV2%2F1762106202384_Ga%CC%88nsema%CC%88nnchenbrunnen_Weimar_1966.jpg?alt=media&token=adee0f45-83b9-43aa-89eb-1c240aef8c51',
    ai: {
        date_estimate: '1966',
        location: 'Weimar, Thuringia, Germany',
        description: "The Gänsemännchenbrunnen (Goose Man Fountain) in Weimar's market square, photographed in 1966. This Renaissance bronze fountain, dating to 1555, depicts a man carrying two geese. Captured during the GDR period, the square shows characteristic East German-era preservation.",
        tags: ['Weimar', 'GDR', 'Fountain', '1960s', 'Renaissance'],
    },
};

// ── Tech stack data ────────────────────────────────────────────────────────────

const TECH_CARDS = [
    {
        category: 'Orchestration',
        name: 'LangChain Agent',
        description: 'A tool-calling agent that drives the two-phase workflow — deciding which Vision tools to invoke based on Phase 1 findings, then synthesizing all evidence into a structured data.',
        details: [
            'createAgent() with tool-calling loop',
            'System prompt encodes historian domain expertise',
            'responseFormat: SynthesisSchema (Zod)',
            'Sequential Phase 1 → parallel Phase 2',
            'Tools run only when evidence warrants it',
        ],
    },
    {
        category: 'Vision + Reasoning Model',
        name: 'OpenAI GPT-4o',
        description: 'Receives the original image alongside all tool outputs, reasons across visual and textual evidence, and produces the final typed output.',
        details: [
            'model: gpt-4o, temperature: 0',
            'Multimodal: image_url, detail: "high"',
            'Sees both the image and all tool results',
            'Structured JSON via responseFormat',
            'ChatOpenAI via @langchain/openai',
        ],
    },
    {
        category: 'Computer Vision · 5 parallel tools',
        name: 'Google Cloud Vision',
        description: 'Five independent Vision API calls run in parallel during Phase 2, each targeting a distinct signal. The agent calls only the tools that Phase 1 makes relevant.',
        details: [
            'LABEL_DETECTION — scene & object taxonomy',
            'LANDMARK_DETECTION — buildings & monuments',
            'TEXT_DETECTION — OCR, signs, captions',
            'LOGO_DETECTION — insignia, mastheads, seals',
            'WEB_DETECTION — reverse image + entities',
        ],
    },
    {
        category: 'Output Contract',
        name: 'Zod Structured Schema',
        description: "Every response field is typed and validated at runtime. Confidence enums prevent the model from asserting certainty it doesn't have.",
        details: [
            'date_confidence: definite | probable | possible | unknown',
            'location_confidence: same four-level enum',
            'people_identified[]: { name, role, confidence }',
            'geographic_terms[] — Getty TGN-aligned',
            'subject_terms[] — Getty AAT-aligned',
        ],
    },
];

// ── Agent pipeline data ────────────────────────────────────────────────────────

const PIPELINE = [
    {
        phaseKey: 'p1',
        phaseLabel: 'Phase 1 · Orient',
        parallel: false,
        tools: [
            { key: 'detectLabels', Icon: Tag, name: 'detectLabels', result: 'fountain · cobblestone · 1960s attire · urban square' },
        ],
    },
    {
        phaseKey: 'p2',
        phaseLabel: 'Phase 2 · Investigate',
        parallel: true,
        tools: [
            { key: 'detectLandmarks', Icon: MapPin,   name: 'detectLandmarks',                       result: 'Gänsemännchenbrunnen, Weimar — 0.94' },
            { key: 'searchWeb',       Icon: Globe,    name: 'searchWeb',                             result: 'Weimar · East Germany · 1960s' },
            { key: 'extractText',     Icon: FileText, name: 'extractText',                           result: 'No text detected' },
            { key: 'detectLogos',     Icon: Shield,   name: 'detectLogos',                           result: 'No logos detected' },
            { key: 'searchWikipedia', Icon: BookOpen, name: 'searchWikipedia("Gänsemännchenbrunnen")', result: 'Renaissance fountain, built 1555, Weimar' },
        ],
    },
    {
        phaseKey: 'p3',
        phaseLabel: 'GPT-4o · Synthesis',
        parallel: false,
        tools: [
            { key: 'synthesis', Icon: Sparkles, name: 'Structured output', result: 'Historical record generated' },
        ],
    },
];

// ms from when analyzing begins
const TOOL_TIMERS = {
    detectLabels:    { start: 0,    end: 2500  },
    detectLandmarks: { start: 3000, end: 7500  },
    searchWeb:       { start: 3000, end: 6800  },
    extractText:     { start: 3100, end: 5200  },
    detectLogos:     { start: 3000, end: 5600  },
    searchWikipedia: { start: 3500, end: 8200  },
    synthesis:       { start: 8800, end: 10800 },
};

const ALL_IDLE = Object.fromEntries(Object.keys(TOOL_TIMERS).map(k => [k, 'idle']));

// ── Typewriter hook ────────────────────────────────────────────────────────────

function useTypewriter(text, speed = 18, enabled = false) {
    const [displayed, setDisplayed] = useState('');
    useEffect(() => {
        if (!enabled) { setDisplayed(''); return; }
        let i = 0;
        setDisplayed('');
        const id = setInterval(() => {
            i++;
            setDisplayed(text.slice(0, i));
            if (i >= text.length) clearInterval(id);
        }, speed);
        return () => clearInterval(id);
    }, [text, speed, enabled]);
    return displayed;
}

// ── Agent pipeline visualization ──────────────────────────────────────────────

function PipelineVisualization({ active }) {
    const [statuses, setStatuses] = useState(ALL_IDLE);

    useEffect(() => {
        if (!active) { setStatuses(ALL_IDLE); return; }
        setStatuses(ALL_IDLE);
        const timers = [];
        Object.entries(TOOL_TIMERS).forEach(([key, { start, end }]) => {
            timers.push(setTimeout(() => setStatuses(s => ({ ...s, [key]: 'running' })), start));
            timers.push(setTimeout(() => setStatuses(s => ({ ...s, [key]: 'done'    })), end));
        });
        return () => timers.forEach(clearTimeout);
    }, [active]);

    const phaseStatus = (tools) => {
        const ss = tools.map(t => statuses[t.key]);
        if (ss.every(s => s === 'done')) return 'done';
        if (ss.some(s => s === 'running' || s === 'done')) return 'active';
        return 'idle';
    };

    return (
        <div className="space-y-1.5">
            {PIPELINE.map((phase, pi) => {
                const ps = phaseStatus(phase.tools);
                const borderColor = ps === 'active' ? alpha('--echoes-amber', 0.5)
                    : ps === 'done' ? 'rgba(34,197,94,0.3)' : 'rgba(0,0,0,0.08)';
                const headerBg = ps === 'active' ? alpha('--echoes-amber', 0.06)
                    : ps === 'done' ? 'rgba(34,197,94,0.04)' : 'rgba(0,0,0,0.02)';
                const labelColor = ps === 'active' ? palette.amber
                    : ps === 'done' ? 'rgb(34,197,94)' : palette.muted;

                return (
                    <React.Fragment key={phase.phaseKey}>
                        <div
                            className="rounded-lg overflow-hidden"
                            style={{ border: `1px solid ${borderColor}`, transition: 'border-color 0.4s ease' }}
                        >
                            <div
                                className="px-3 py-1.5 flex items-center justify-between"
                                style={{ background: headerBg, borderBottom: `1px solid ${borderColor}`, transition: 'background 0.4s ease' }}
                            >
                                <span
                                    className="text-[10px] font-mono tracking-wider uppercase font-medium"
                                    style={{ color: labelColor, transition: 'color 0.4s ease' }}
                                >
                                    {phase.phaseLabel}
                                </span>
                                <div className="flex items-center gap-1.5">
                                    {phase.parallel && ps !== 'idle' && (
                                        <span
                                            className="text-[9px] px-1.5 py-0.5 rounded"
                                            style={{ background: alpha('--echoes-amber', 0.1), color: palette.muted }}
                                        >
                                            parallel
                                        </span>
                                    )}
                                    {ps === 'done' && <Check size={10} style={{ color: 'rgb(34,197,94)' }} />}
                                </div>
                            </div>

                            <div className="px-3 py-2 space-y-2">
                                {phase.tools.map(({ key, Icon, name, result }) => {
                                    const status = statuses[key];
                                    return (
                                        <div key={key}>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                                                    style={{
                                                        background: status === 'running' ? alpha('--echoes-amber', 0.12)
                                                            : status === 'done' ? 'rgba(34,197,94,0.1)' : 'rgba(0,0,0,0.04)',
                                                        transition: 'background 0.3s ease',
                                                    }}
                                                >
                                                    <Icon
                                                        size={11}
                                                        style={{
                                                            color: status === 'running' ? palette.amber
                                                                : status === 'done' ? 'rgb(34,197,94)' : 'rgba(0,0,0,0.2)',
                                                            transition: 'color 0.3s ease',
                                                        }}
                                                    />
                                                </div>
                                                <span
                                                    className="text-[10px] font-mono flex-1 truncate"
                                                    style={{
                                                        color: status === 'idle' ? 'rgba(0,0,0,0.2)' : palette.brown,
                                                        transition: 'color 0.3s ease',
                                                    }}
                                                >
                                                    {name}
                                                </span>
                                                {status === 'running' && (
                                                    <div className="flex gap-0.5 flex-shrink-0">
                                                        {[0, 1, 2].map(i => (
                                                            <div
                                                                key={i}
                                                                className="w-1 h-1 rounded-full"
                                                                style={{
                                                                    background: palette.amber,
                                                                    animation: `echoesDot 1.2s ease-in-out ${i * 0.2}s infinite`,
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                                {status === 'done' && (
                                                    <Check size={10} style={{ color: 'rgb(34,197,94)', flexShrink: 0 }} />
                                                )}
                                            </div>
                                            {status === 'done' && (
                                                <p
                                                    className="ml-7 text-[10px] leading-relaxed mt-0.5"
                                                    style={{ color: palette.muted, animation: 'echoesFadeSlideIn 0.3s ease' }}
                                                >
                                                    {result}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {pi < PIPELINE.length - 1 && (
                            <div className="flex flex-col items-center py-0.5">
                                <div
                                    style={{
                                        width: 1, height: 12,
                                        background: ps === 'done' ? alpha('--echoes-amber', 0.45) : 'rgba(0,0,0,0.1)',
                                        transition: 'background 0.4s ease',
                                    }}
                                />
                                <div
                                    style={{
                                        width: 0, height: 0,
                                        borderLeft: '4px solid transparent',
                                        borderRight: '4px solid transparent',
                                        borderTop: `5px solid ${ps === 'done' ? alpha('--echoes-amber', 0.45) : 'rgba(0,0,0,0.1)'}`,
                                        transition: 'border-top-color 0.4s ease',
                                    }}
                                />
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

// ── AI analysis card ───────────────────────────────────────────────────────────

function AiCard({ ai, visible }) {
    if (!visible) return null;
    return (
        <div
            className="mt-3 rounded-lg p-3 border"
            style={{
                background: 'rgba(251,243,219,0.75)',
                borderColor: 'rgba(210,168,100,0.4)',
                animation: 'echoesFadeSlideIn 0.3s ease both',
            }}
        >
            <div className="flex gap-2.5">
                <Professor size={26} className="flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-mono tracking-widest text-amber-700 uppercase block mb-1.5">
                        Historical Analysis
                    </span>
                    <p className="text-xs leading-relaxed italic text-stone-700 mb-2">
                        {ai.description}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 mb-2">
                        {ai.date_estimate && (
                            <span className="text-[10px] font-medium text-stone-700">{ai.date_estimate}</span>
                        )}
                        {ai.location && (
                            <span className="text-[10px] text-stone-500">{ai.location}</span>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {ai.tags.map(tag => (
                            <span
                                key={tag}
                                className="text-[10px] px-1.5 py-0.5 rounded-full border"
                                style={{ borderColor: 'rgba(210,168,100,0.5)', color: '#92650a' }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Mock post card ─────────────────────────────────────────────────────────────

function MockPostCard({ post }) {
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [localLikes, setLocalLikes] = useState(post.likes);
    const [showAi, setShowAi] = useState(false);

    return (
        <div
            className="rounded-xl overflow-hidden flex flex-col"
            style={{
                background: 'white',
                border: `1px solid ${alpha('--echoes-amber', 0.18)}`,
                boxShadow: `0 2px 14px ${alpha('--echoes-brown', 0.07)}`,
            }}
        >
            <div className="flex items-center gap-3 px-4 pt-4 pb-3">
                <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: post.avatarColor }}
                >
                    {post.initials}
                </div>
                <div>
                    <p className="text-sm font-semibold leading-tight" style={{ color: palette.brown }}>{post.user}</p>
                    <p className="text-xs" style={{ color: palette.muted }}>{post.timeAgo}</p>
                </div>
            </div>

            <div className="px-4 pb-3">
                <div className="bg-white p-2 pb-7 shadow-md relative" style={{ border: '1px solid #ede5d8' }}>
                    <img
                        src={post.imageUrl}
                        alt="Historical photo"
                        className="w-full object-cover"
                        style={{ maxHeight: 200, filter: 'sepia(12%) contrast(0.96)' }}
                    />
                    {post.year && (
                        <span
                            className="absolute bottom-2 right-2 text-[10px] italic px-2 py-0.5"
                            style={{ background: 'rgba(255,255,255,0.88)', color: '#999', border: '1px solid #e0d8cc' }}
                        >
                            {post.year}
                        </span>
                    )}
                </div>
            </div>

            <div className="px-4 pb-2">
                <p
                    className="leading-snug"
                    style={{ fontFamily: "'Caveat', cursive", color: palette.brown, fontSize: '1.1rem' }}
                >
                    {post.caption}
                </p>
            </div>

            <div className="px-4 pb-3">
                <button
                    onClick={() => setShowAi(v => !v)}
                    className="flex items-center gap-1.5 text-[11px] font-medium transition-colors"
                    style={{ color: showAi ? '#92650a' : palette.muted }}
                >
                    <Brain size={13} />
                    {showAi ? 'Hide AI analysis' : 'Show AI analysis'}
                </button>
                <AiCard ai={post.ai} visible={showAi} />
            </div>

            <div
                className="flex items-center gap-3 px-4 py-3 mt-auto"
                style={{ borderTop: `1px solid ${alpha('--echoes-amber', 0.12)}` }}
            >
                <button
                    onClick={() => { setLiked(v => !v); setLocalLikes(l => liked ? l - 1 : l + 1); }}
                    className="flex items-center gap-1.5 text-xs transition-colors"
                    style={{ color: liked ? '#ef4444' : palette.muted }}
                >
                    <Heart size={14} className={liked ? 'fill-current' : ''} />
                    {localLikes}
                </button>
                <button className="flex items-center gap-1.5 text-xs" style={{ color: palette.muted }}>
                    <MessageCircle size={14} />
                    {post.comments}
                </button>
                <button
                    onClick={() => setBookmarked(v => !v)}
                    className="flex items-center gap-1.5 text-xs transition-colors ml-auto"
                    style={{ color: bookmarked ? '#3b82f6' : palette.muted }}
                >
                    <Bookmark size={14} className={bookmarked ? 'fill-current' : ''} />
                    {post.bookmarks}
                </button>
            </div>
        </div>
    );
}

// ── Upload section left column ─────────────────────────────────────────────────

function UploadSectionLeft() {
    const [view, setView] = useState('tech');
    const [visible, setVisible] = useState(true);

    const handleToggle = (next) => {
        if (next === view) return;
        setVisible(false);
        setTimeout(() => { setView(next); setVisible(true); }, 180);
    };

    return (
        <div>
            <p className="text-base mb-1" style={{ fontFamily: "'Caveat', cursive", color: palette.amber }}>step 01</p>
            <h2 className="text-2xl font-bold mb-4" style={{ color: palette.brown, letterSpacing: '-0.02em' }}>
                Upload a Memory, Watch AI Uncover It
            </h2>
            <p className="text-sm leading-relaxed mb-5" style={{ color: palette.muted }}>
                Upload any historical photo and Echoes AI reads it immediately — detecting the decade,
                identifying the location, and surfacing the cultural context. In seconds, a dusty scan
                becomes a documented piece of history.
            </p>

            {/* Pill toggle */}
            <div
                className="inline-flex rounded-full p-0.5 mb-5"
                style={{ background: alpha('--echoes-amber', 0.1) }}
            >
                {[
                    { id: 'tech',     label: "How it's built" },
                    { id: 'features', label: 'What it does'   },
                ].map(({ id, label }) => (
                    <button
                        key={id}
                        onClick={() => handleToggle(id)}
                        className="px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                        style={view === id ? {
                            background: palette.brown,
                            color: palette.cream,
                            boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
                        } : {
                            background: 'transparent',
                            color: palette.muted,
                        }}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Animated content area */}
            <div
                style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(-8px)',
                    transition: 'opacity 0.18s ease, transform 0.18s ease',
                }}
            >
                {view === 'tech' ? (
                    <div>
                        {TECH_CARDS.map((card, i) => (
                            <div
                                key={card.name}
                                className="flex gap-3 py-2.5"
                                style={{
                                    borderBottom: i < TECH_CARDS.length - 1
                                        ? `1px solid ${alpha('--echoes-amber', 0.1)}`
                                        : 'none',
                                }}
                            >
                                <div
                                    className="w-0.5 flex-shrink-0 rounded-full self-stretch"
                                    style={{ background: alpha('--echoes-amber', 0.45) }}
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline gap-2 mb-0.5">
                                        <span className="font-mono font-bold text-xs" style={{ color: palette.brown }}>
                                            {card.name}
                                        </span>
                                        <span className="text-[9px] font-mono tracking-wide" style={{ color: palette.muted }}>
                                            {card.category}
                                        </span>
                                    </div>
                                    <p
                                        className="text-[11px] leading-snug line-clamp-2"
                                        style={{ color: palette.muted }}
                                    >
                                        {card.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        {[
                            { icon: Clock,    text: 'Era & decade detection from visual cues' },
                            { icon: MapPin,   text: 'Location identification from landmarks & context' },
                            { icon: Brain,    text: 'Historical events & cultural significance' },
                            { icon: Sparkles, text: 'Notable figures and people identified' },
                        ].map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-start gap-3 mb-3.5">
                                <div
                                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                    style={{ background: alpha('--echoes-amber', 0.12) }}
                                >
                                    <Icon size={12} style={{ color: palette.amber }} />
                                </div>
                                <p className="text-sm" style={{ color: palette.muted }}>{text}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Upload demo ────────────────────────────────────────────────────────────────

function UploadDemo() {
    const [stage, setStage] = useState('idle'); // idle | uploading | analyzing | done
    const [progress, setProgress] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const aiText = useTypewriter(UPLOAD_DEMO.ai.description, 18, showResult);

    const startDemo = () => {
        if (stage !== 'idle') return;
        setStage('uploading');
        setProgress(0);
        let p = 0;
        const tick = setInterval(() => {
            p = Math.min(p + Math.random() * 14 + 6, 100);
            setProgress(p);
            if (p >= 100) {
                clearInterval(tick);
                setTimeout(() => setStage('analyzing'), 300);
                setTimeout(() => {
                    setStage('done');
                    setTimeout(() => setShowResult(true), 500);
                }, 13200);
            }
        }, 140);
    };

    const reset = () => { setStage('idle'); setProgress(0); setShowResult(false); };

    return (
        <div
            className="rounded-xl overflow-hidden"
            style={{
                background: 'white',
                border: `1px solid ${alpha('--echoes-amber', 0.22)}`,
                boxShadow: `0 4px 28px ${alpha('--echoes-brown', 0.1)}`,
            }}
        >
            <div className="relative" style={{ height: 260 }}>
                <img
                    src={UPLOAD_DEMO.imageUrl}
                    alt="Historical demo upload"
                    className="w-full h-full object-cover"
                    style={{
                        filter: stage === 'idle'
                            ? 'sepia(40%) contrast(0.86) brightness(0.9)'
                            : 'sepia(10%) contrast(0.96)',
                        transition: 'filter 0.9s ease',
                    }}
                />

                {stage === 'analyzing' && (
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ animation: 'echoesGlowPulse 2s ease-in-out infinite' }}
                    />
                )}

                {stage === 'idle' && (
                    <div
                        className="absolute inset-0 flex items-center justify-center cursor-pointer group"
                        style={{ background: 'linear-gradient(160deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.6) 100%)' }}
                        onClick={startDemo}
                    >
                        <div className="text-center select-none">
                            <div className="relative flex items-center justify-center mx-auto mb-5" style={{ width: 88, height: 88 }}>
                                <div className="absolute rounded-full" style={{ inset: 0, border: `2px solid ${palette.amber}`, animation: 'echoesRipple 2.4s ease-out infinite' }} />
                                <div className="absolute rounded-full" style={{ inset: 0, border: `2px solid ${palette.amber}`, animation: 'echoesRipple 2.4s ease-out 0.8s infinite' }} />
                                <div className="absolute rounded-full" style={{ inset: 0, border: `2px solid ${palette.amber}`, animation: 'echoesRipple 2.4s ease-out 1.6s infinite' }} />
                                <div
                                    className="relative w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                                    style={{
                                        background: palette.amber,
                                        boxShadow: `0 0 32px ${alpha('--echoes-amber', 0.55)}, 0 0 8px ${alpha('--echoes-amber', 0.4)}`,
                                    }}
                                >
                                    <Play size={24} fill="white" className="text-white ml-1" />
                                </div>
                            </div>
                            <p className="text-white font-bold text-base mb-1 drop-shadow">Watch AI analyze this photo</p>
                            <p className="text-xs drop-shadow" style={{ color: 'rgba(255,255,255,0.6)' }}>See the full agent pipeline in action</p>
                        </div>
                    </div>
                )}

                {stage === 'done' && (
                    <div
                        className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(34,197,94,0.92)', animation: 'echoesFadeSlideIn 0.3s ease' }}
                    >
                        <Check size={14} className="text-white" />
                    </div>
                )}
            </div>

            <div className="p-4">
                {stage === 'idle' && (
                    <div>
                        <p className="text-sm font-medium mb-0.5" style={{ color: palette.brown }}>
                            Gänsemännchenbrunnen, Weimar
                        </p>
                        <p className="text-xs" style={{ color: palette.muted }}>
                            Click the photo to watch AI analyze it in real time
                        </p>
                    </div>
                )}

                {stage === 'uploading' && (
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-medium" style={{ color: palette.brown }}>Uploading photo…</span>
                            <span className="text-xs" style={{ color: palette.muted }}>{Math.round(progress)}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: alpha('--echoes-amber', 0.15) }}>
                            <div
                                className="h-full rounded-full transition-all duration-150"
                                style={{
                                    width: `${progress}%`,
                                    background: `linear-gradient(90deg, ${palette.amber}, ${palette.brown})`,
                                }}
                            />
                        </div>
                    </div>
                )}

                {stage === 'analyzing' && (
                    <PipelineVisualization active={true} />
                )}

                {stage === 'done' && (
                    <div>
                        <div
                            className="rounded-lg p-3 mb-3 border"
                            style={{
                                background: 'rgba(251,243,219,0.75)',
                                borderColor: 'rgba(210,168,100,0.4)',
                                animation: 'echoesFadeSlideIn 0.4s ease',
                            }}
                        >
                            <div className="flex gap-2.5">
                                <Professor size={26} className="flex-shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <span className="text-[9px] font-mono tracking-widest text-amber-700 uppercase block mb-1.5">
                                        Historical Analysis
                                    </span>
                                    <p className="text-xs leading-relaxed italic text-stone-700 mb-2 min-h-[48px]">
                                        {aiText}
                                        {showResult && aiText.length < UPLOAD_DEMO.ai.description.length && (
                                            <span style={{ animation: 'echoesBlink 0.8s step-end infinite' }}>|</span>
                                        )}
                                    </p>
                                    {showResult && aiText === UPLOAD_DEMO.ai.description && (
                                        <div style={{ animation: 'echoesFadeSlideIn 0.4s ease' }}>
                                            <div className="flex gap-4 mb-2">
                                                <span className="text-[10px] font-medium text-stone-700">{UPLOAD_DEMO.ai.date_estimate}</span>
                                                <span className="text-[10px] text-stone-500">{UPLOAD_DEMO.ai.location}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {UPLOAD_DEMO.ai.tags.map(tag => (
                                                    <span
                                                        key={tag}
                                                        className="text-[10px] px-1.5 py-0.5 rounded-full border"
                                                        style={{ borderColor: 'rgba(210,168,100,0.5)', color: '#92650a' }}
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button onClick={reset} className="text-xs" style={{ color: palette.muted }}>
                            ↩ Try again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Main landing page ──────────────────────────────────────────────────────────

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
                                onClick={() => scrollToSection('demo')}
                                className="text-sm transition-colors"
                                style={{ color: palette.muted }}
                                onMouseEnter={e => e.target.style.color = palette.brown}
                                onMouseLeave={e => e.target.style.color = palette.muted}
                            >
                                Live Demo
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
                                    { label: 'Live Demo', action: () => scrollToSection('demo') },
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

            {/* Hero */}
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
                    </div>

                    {/* Bouncing scroll prompt */}
                    <div className="mt-14 flex justify-center">
                    <button
                        onClick={() => scrollToSection('demo')}
                        className="flex flex-col items-center gap-1 group"
                        style={{ animation: 'echoesBounce 1.8s ease-in-out infinite', background: 'none', border: 'none', cursor: 'pointer' }}
                        aria-label="Scroll to demo"
                    >
                        <span
                            className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                            style={{
                                background: alpha('--echoes-amber', 0.12),
                                color: palette.amber,
                                border: `1px solid ${alpha('--echoes-amber', 0.35)}`,
                                boxShadow: `0 0 18px ${alpha('--echoes-amber', 0.15)}`,
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = alpha('--echoes-amber', 0.22); e.currentTarget.style.boxShadow = `0 0 28px ${alpha('--echoes-amber', 0.3)}`; }}
                            onMouseLeave={e => { e.currentTarget.style.background = alpha('--echoes-amber', 0.12); e.currentTarget.style.boxShadow = `0 0 18px ${alpha('--echoes-amber', 0.15)}`; }}
                        >
                            Watch the demo
                        </span>
                        <ChevronDown size={22} style={{ color: alpha('--echoes-amber', 0.5) }} />
                    </button>
                    </div>
                </div>
            </section>

            {/* Demo section: Upload + AI */}
            <section id="demo" className="py-24 px-4" style={{ background: alpha('--echoes-brown', 0.025) }}>
                <div className="max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-14 items-start">
                        <UploadSectionLeft />
                        <UploadDemo />
                    </div>
                </div>
            </section>

            {/* Demo section: Feed */}
            <section className="pb-24 px-4 pt-20">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-8">
                        <p className="text-base mb-1" style={{ fontFamily: "'Caveat', cursive", color: palette.amber }}>step 02</p>
                        <h2 className="text-2xl font-bold mb-2" style={{ color: palette.brown, letterSpacing: '-0.02em' }}>
                            Browse the Feed
                        </h2>
                        <p className="text-sm" style={{ color: palette.muted }}>
                            Real historical photos, shared by users. Click "Show AI analysis" on any card to see what Echoes uncovered.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {MOCK_POSTS.map(post => <MockPostCard key={post.id} post={post} />)}
                    </div>
                </div>
            </section>

            {/* Sticky notes */}
            <section className="py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-xl mb-3" style={{ fontFamily: "'Caveat', cursive", color: palette.amber }}>
                            everything in one place
                        </p>
                        <h2
                            className="font-bold"
                            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.02em', color: palette.brown }}
                        >
                            More than just a photo archive
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
                        {FEATURES.map(f => <StickyNote key={f.title} {...f} />)}
                    </div>
                </div>
            </section>

            {/* CTA */}
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

            {/* CSS keyframes */}
            <style>{`
                @keyframes echoesFadeSlideIn {
                    from { opacity: 0; transform: translateY(-6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes echoesGlowPulse {
                    0%, 100% { box-shadow: inset 0 0 0 2px rgba(196,144,60,0.25), inset 0 0 24px rgba(196,144,60,0.08); }
                    50%      { box-shadow: inset 0 0 0 3px rgba(196,144,60,0.7),  inset 0 0 48px rgba(196,144,60,0.22); }
                }
                @keyframes echoesDot {
                    0%, 100% { opacity: 0.3; transform: scale(0.8); }
                    50%      { opacity: 1;   transform: scale(1.2); }
                }
                @keyframes echoesBlink {
                    0%, 100% { opacity: 1; }
                    50%      { opacity: 0; }
                }
                @keyframes echoesRipple {
                    0%   { transform: scale(1);   opacity: 0.5; }
                    100% { transform: scale(2.2); opacity: 0; }
                }
                @keyframes echoesBounce {
                    0%, 100% { transform: translateY(0); }
                    50%      { transform: translateY(8px); }
                }
            `}</style>

        </div>
    );
}

export default LandingPage;
