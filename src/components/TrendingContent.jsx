import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RotateCcw, Search, Heart, Flame } from 'lucide-react';
import { callApiGateway } from '../firebaseConfig';
import MapPostCard from './MapPostCard';
import { useIsMobile } from "@/hooks/use-mobile.jsx";
import useUiStore from '../stores/useUiStore';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getEraColor } from '@/lib/eraColors';

const CACHE_TTL_MS = 5 * 60 * 1000;
const PAGE_SIZE = 12;

const ERA_DEFINITIONS = [
    { label: 'Pre-1900', test: (y) => y < 1900 },
    { label: '1900s',   test: (y) => y >= 1900 && y < 1920 },
    { label: '1920s',   test: (y) => y >= 1920 && y < 1930 },
    { label: '1930s',   test: (y) => y >= 1930 && y < 1940 },
    { label: '1940s',   test: (y) => y >= 1940 && y < 1950 },
    { label: '1950s',   test: (y) => y >= 1950 && y < 1960 },
    { label: '1960s',   test: (y) => y >= 1960 && y < 1970 },
    { label: '1970s',   test: (y) => y >= 1970 && y < 1980 },
    { label: '1980s',   test: (y) => y >= 1980 && y < 1990 },
    { label: '1990s',   test: (y) => y >= 1990 && y < 2000 },
    { label: '2000s',   test: (y) => y >= 2000 && y < 2010 },
    { label: '2010s+',  test: (y) => y >= 2010 },
];

function getAvailableEras(posts) {
    const present = new Set();
    for (const post of posts) {
        for (const y of (post.year || [])) {
            for (const era of ERA_DEFINITIONS) {
                if (era.test(y)) { present.add(era.label); break; }
            }
        }
    }
    return ERA_DEFINITIONS.filter(era => present.has(era.label));
}

function filterByEra(posts, eraLabel) {
    if (!eraLabel) return posts;
    const era = ERA_DEFINITIONS.find(e => e.label === eraLabel);
    return era ? posts.filter(post => (post.year || []).some(y => era.test(y))) : posts;
}

// Cinematic hero card for #1 trending — click-to-open only, no inline interaction buttons
function HeroCard({ post }) {
    const [, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [imgLoaded, setImgLoaded] = useState(false);

    const openPost = () => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set('post', post.id);
            return next;
        });
    };

    return (
        <div
            className="relative w-full rounded-xl overflow-hidden cursor-pointer group h-[400px] sm:h-[460px]"
            onClick={openPost}
            role="button"
            tabIndex={0}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && openPost()}
        >
            {/* Image */}
            {post.files?.[0] ? (
                <img
                    src={post.files[0]}
                    alt=""
                    onLoad={() => setImgLoaded(true)}
                    className={cn(
                        "absolute inset-0 w-full h-full object-cover",
                        imgLoaded ? "opacity-100" : "opacity-0"
                    )}
                />
            ) : (
                <div className="absolute inset-0 bg-muted" />
            )}
            {!imgLoaded && <div className="absolute inset-0 bg-muted animate-pulse" />}

            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

            {/* Trending pill */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-tight shadow-lg tracking-wide"
                 style={{ background: '#C4860A', color: '#fff' }}>
                <Flame className="h-3 w-3" />
                #1 Trending
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 text-white">
                <p className="text-base sm:text-xl font-semibold line-clamp-3 mb-3 leading-snug drop-shadow-sm">
                    {post.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-white/75 flex-wrap">
                    <Avatar className="h-5 w-5 flex-shrink-0">
                        <AvatarImage src={post.userProfilePicUrl} />
                        <AvatarFallback className="text-[10px] bg-white/20 text-white">
                            {post.userDisplayName?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <button
                        className="hover:text-white transition-colors hover:underline"
                        onClick={e => { e.stopPropagation(); navigate(`/profile/${post.userId}`); }}
                    >
                        {post.userDisplayName}
                    </button>
                    <span className="text-white/40">·</span>
                    <span className="flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5" />
                        {post.likesCount || 0}
                    </span>
                    {post.year?.[0] && (
                        <>
                            <span className="text-white/40">·</span>
                            <span className="text-xs font-medium tracking-wider"
                                  style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: 'italic', color: '#E8A824' }}>
                                {post.year[0]}
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function TrendingSkeleton() {
    return (
        <div className="space-y-5">
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-[400px] sm:h-[460px] w-full rounded-xl" />
            <div className="flex gap-2 overflow-hidden">
                {[72, 60, 68, 56, 76, 64].map((w, i) => (
                    <Skeleton key={i} className="h-7 rounded-full flex-shrink-0" style={{ width: w }} />
                ))}
            </div>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
                {[320, 240, 290, 210, 340, 260, 300, 220, 280].map((h, i) => (
                    <Skeleton key={i} className="break-inside-avoid mb-4 rounded-xl" style={{ height: h }} />
                ))}
            </div>
        </div>
    );
}

export default function TrendingContent() {
    const isMobile = useIsMobile();
    const { trendingPosts, trendingFetchedAt, setTrending } = useUiStore();
    const [, setSearchParams] = useSearchParams();

    const [posts, setPosts] = useState([]);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEra, setSelectedEra] = useState(null);
    const [heroSearchInput, setHeroSearchInput] = useState('');
    const sentinelRef = useRef(null);
    const heroInputRef = useRef(null);

    const isCacheFresh = trendingFetchedAt && (Date.now() - trendingFetchedAt) < CACHE_TTL_MS;

    const fetchTrendingPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await callApiGateway({
                action: 'getTrending',
                payload: { timeframe: '7d', limit: isMobile ? 20 : 40 }
            });
            const fetched = response.data.posts || [];
            setPosts(fetched);
            setTrending(fetched);
            setVisibleCount(PAGE_SIZE);
            setSelectedEra(null);
        } catch (err) {
            console.error('Error fetching trending posts:', err);
            setError('Failed to load trending posts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isCacheFresh && trendingPosts.length > 0) {
            setPosts(trendingPosts);
            setLoading(false);
            return;
        }
        fetchTrendingPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Reset visible count when era filter changes
    useEffect(() => {
        setVisibleCount(PAGE_SIZE);
    }, [selectedEra]);

    // Progressive reveal via IntersectionObserver
    useEffect(() => {
        if (!sentinelRef.current) return;
        const filtered = filterByEra(posts, selectedEra);
        if (visibleCount >= filtered.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisibleCount(prev => Math.min(prev + PAGE_SIZE, filtered.length));
                }
            },
            { rootMargin: '300px' }
        );
        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [visibleCount, posts, selectedEra]);

    const handleHeroSearch = () => {
        const q = heroSearchInput.trim();
        if (!q) return;
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set('q', q);
            return next;
        });
    };

    if (loading) return <TrendingSkeleton />;

    if (error) {
        return (
            <div className="text-center py-16">
                <div className="text-4xl mb-4">⚠️</div>
                <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={fetchTrendingPosts} className="gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Try Again
                </Button>
            </div>
        );
    }

    const filteredPosts = filterByEra(posts, selectedEra);
    const [heroPosts, gridPosts] = [filteredPosts.slice(0, 1), filteredPosts.slice(1)];
    const visibleGridPosts = gridPosts.slice(0, Math.max(0, visibleCount - 1));
    const hasMore = visibleCount - 1 < gridPosts.length;
    const availableEras = getAvailableEras(posts);

    return (
        <div className="max-w-7xl mx-auto space-y-5">

            {/* Hero search bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                    ref={heroInputRef}
                    type="text"
                    value={heroSearchInput}
                    onChange={e => setHeroSearchInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleHeroSearch()}
                    placeholder="Search moments, places, eras..."
                    className="w-full h-11 pl-11 pr-4 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                />
            </div>

            {posts.length > 0 ? (
                <>
                    {/* Hero card - only when showing all eras or filtered set has a first post */}
                    {heroPosts[0] && <HeroCard post={heroPosts[0]} />}

                    {/* Era chip filters */}
                    {availableEras.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                            <button
                                onClick={() => setSelectedEra(null)}
                                className={cn(
                                    "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                                    selectedEra === null
                                        ? "bg-foreground text-background border-foreground"
                                        : "bg-background text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                                )}
                            >
                                All
                            </button>
                            {availableEras.map(era => {
                                const colors = getEraColor(era.label);
                                const isActive = selectedEra === era.label;
                                return (
                                    <button
                                        key={era.label}
                                        onClick={() => setSelectedEra(prev => prev === era.label ? null : era.label)}
                                        className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                                        style={isActive
                                            ? { background: colors.bg, color: colors.text, border: `1px solid ${colors.bg}` }
                                            : { background: colors.light, color: colors.bg, border: `1px solid ${colors.border}` }
                                        }
                                    >
                                        {era.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Section label */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                            {selectedEra ? `${selectedEra} · ${filteredPosts.length} posts` : 'Trending this week'}
                        </span>
                    </div>

                    {/* Masonry grid (posts 2+) */}
                    {visibleGridPosts.length > 0 ? (
                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
                            {visibleGridPosts.map((post, index) => (
                                <div key={post.id} className="break-inside-avoid mb-4 relative">
                                    {index < 2 && !selectedEra && (
                                        <div className="absolute -top-2 -left-2 z-10 flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full shadow-md"
                                             style={{ background: '#C4860A', color: '#fff' }}>
                                            <Flame className="h-2.5 w-2.5" />
                                            #{index + 2}
                                        </div>
                                    )}
                                    <MapPostCard post={post} />
                                </div>
                            ))}
                        </div>
                    ) : filteredPosts.length <= 1 && selectedEra ? (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground text-sm">
                                No other trending posts from the {selectedEra}.
                            </p>
                            <button
                                onClick={() => setSelectedEra(null)}
                                className="mt-2 text-sm text-primary hover:underline"
                            >
                                Clear filter
                            </button>
                        </div>
                    ) : null}

                    {/* Infinite scroll sentinel */}
                    <div ref={sentinelRef} className="h-6 flex justify-center items-center">
                        {hasMore && (
                            <div className="h-1 w-16 rounded-full bg-muted animate-pulse" />
                        )}
                    </div>

                    {/* Refresh */}
                    <div className="flex justify-center pt-2 pb-6">
                        <Button
                            onClick={fetchTrendingPosts}
                            variant="outline"
                            disabled={loading}
                            className="gap-2 text-xs"
                        >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Refresh Trending
                        </Button>
                    </div>
                </>
            ) : (
                <div className="text-center py-16">
                    <div className="text-4xl mb-4">📊</div>
                    <h3 className="text-lg font-semibold mb-2">No Trending Content Yet</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                        No posts are trending this week. Be the first to share something!
                    </p>
                    <Button onClick={fetchTrendingPosts} variant="outline" className="gap-2">
                        <RotateCcw className="h-4 w-4" />
                        Refresh
                    </Button>
                </div>
            )}
        </div>
    );
}
