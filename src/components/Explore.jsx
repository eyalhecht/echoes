import React, { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { callApiGateway } from "../firebaseConfig.js";
import { useIsMobile } from "@/hooks/use-mobile.jsx";
import TrendingContent from "./TrendingContent.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Map } from "lucide-react";

const SUGGESTED_SEARCHES = [
    'Berlin Wall',
    'World War II',
    'Moon landing 1969',
    'Great Depression',
    'Civil Rights Movement',
    'Cold War',
    'Victorian era',
    'Space race',
];

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

function getAvailableTopics(posts, query) {
    const queryWords = (query || '').toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const counts = new Map();
    for (const post of posts) {
        const tags = [
            ...(post.AiMetadata?.tags || []),
            ...(post.AiMetadata?.subject_terms || []),
        ];
        for (const tag of tags) {
            const lower = tag.toLowerCase();
            if (queryWords.some(w => lower.includes(w) || w.includes(lower))) continue;
            counts.set(tag, (counts.get(tag) || 0) + 1);
        }
    }
    return [...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 7)
        .map(([tag]) => tag);
}

function filterPosts(posts, eraLabel, topic) {
    let filtered = posts;
    if (eraLabel) {
        const era = ERA_DEFINITIONS.find(e => e.label === eraLabel);
        if (era) filtered = filtered.filter(p => (p.year || []).some(y => era.test(y)));
    }
    if (topic) {
        const topicLower = topic.toLowerCase();
        filtered = filtered.filter(p => {
            const tags = [...(p.AiMetadata?.tags || []), ...(p.AiMetadata?.subject_terms || [])];
            return tags.some(t => t.toLowerCase() === topicLower);
        });
    }
    return filtered;
}

// Highlight query terms in text — returns array of strings/elements
function highlightText(text, query) {
    if (!text || !query?.trim()) return text;
    const words = query.trim().split(/\s+/).filter(w => w.length > 2);
    if (words.length === 0) return text;
    const escaped = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');
    const parts = text.split(pattern);
    return parts.map((part, i) =>
        pattern.test(part)
            ? <mark key={i} className="bg-yellow-100 dark:bg-yellow-900/40 text-foreground not-italic rounded-sm px-0.5 font-medium">{part}</mark>
            : part
    );
}

export function Explore() {
    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') ?? '';

    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [postsLoading, setPostsLoading] = useState(false);
    const [hasMorePosts, setHasMorePosts] = useState(false);
    const [lastPostId, setLastPostId] = useState(null);

    const [selectedEra, setSelectedEra] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);

    const sentinelRef = useRef(null);

    const openPost = (postId) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set('post', postId);
            return next;
        });
    };

    // Reset filters when query changes
    useEffect(() => {
        setSelectedEra(null);
        setSelectedTopic(null);
    }, [query]);

    // Search when query changes
    useEffect(() => {
        if (query && query.trim().length > 0) {
            searchContent(query.trim());
        } else {
            setUsers([]);
            setPosts([]);
            setLastPostId(null);
            setHasMorePosts(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    // Infinite scroll sentinel for load-more
    useEffect(() => {
        if (!sentinelRef.current || !hasMorePosts || postsLoading) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMorePosts();
                }
            },
            { rootMargin: '200px' }
        );
        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasMorePosts, postsLoading, lastPostId]);

    const searchContent = async (q, loadMore = false) => {
        if (!q || q.length < 2) return;

        try {
            if (!loadMore) {
                setUsersLoading(true);
                setPostsLoading(true);
                setUsers([]);
                setPosts([]);
            } else {
                setPostsLoading(true);
            }

            const promises = [];

            if (!loadMore) {
                promises.push(
                    callApiGateway({
                        action: 'searchUsers',
                        payload: { query: q, limit: isMobile ? 5 : 8 }
                    })
                );
            }

            promises.push(
                callApiGateway({
                    action: 'searchPosts',
                    payload: {
                        query: q,
                        limit: isMobile ? 10 : 15,
                        lastPostId: loadMore ? lastPostId : null
                    }
                })
            );

            const responses = await Promise.all(promises);

            if (!loadMore) {
                const [usersRes, postsRes] = responses;
                setUsers(usersRes.data.users || []);
                setPosts(postsRes.data.posts || []);
                setHasMorePosts(postsRes.data.hasMore || false);
                setLastPostId(postsRes.data.lastDocId || null);
            } else {
                const [postsRes] = responses;
                setPosts(prev => [...prev, ...(postsRes.data.posts || [])]);
                setHasMorePosts(postsRes.data.hasMore || false);
                setLastPostId(postsRes.data.lastDocId || null);
            }
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setUsersLoading(false);
            setPostsLoading(false);
        }
    };

    const loadMorePosts = () => {
        if (query && hasMorePosts && !postsLoading) {
            searchContent(query.trim(), true);
        }
    };

    const getUserInitials = (user) => {
        if (!user?.displayName) return 'U';
        return user.displayName
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (!query || query.trim().length === 0) {
        return <TrendingContent />;
    }

    // Derived filter data
    const availableEras = getAvailableEras(posts);
    const availableTopics = getAvailableTopics(posts, query);
    const filteredPosts = filterPosts(posts, selectedEra, selectedTopic);
    const hasActiveFilter = selectedEra || selectedTopic;
    const showFilters = !postsLoading && posts.length > 0 && (availableEras.length > 1 || availableTopics.length > 0);

    return (
        <div className="flex-1 overflow-auto">
            <div className="max-w-4xl mx-auto p-4 space-y-5">
                {/* Header */}
                <div className="border-b pb-4">
                    <h1 className="text-xl font-semibold">
                        Search results for &ldquo;{query}&rdquo;
                    </h1>
                    {!postsLoading && !usersLoading && (posts.length > 0 || users.length > 0) && (
                        <div className="flex items-center gap-3 mt-1">
                            <p className="text-sm text-muted-foreground">
                                {posts.length > 0 && `${posts.length} post${posts.length !== 1 ? 's' : ''}`}
                                {posts.length > 0 && users.length > 0 && ' · '}
                                {users.length > 0 && `${users.length} ${users.length !== 1 ? 'people' : 'person'}`}
                            </p>
                            {posts.length > 0 && (
                                <button
                                    onClick={() => navigate(`/map?q=${encodeURIComponent(query)}`)}
                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <Map className="h-3 w-3" />
                                    View on Map
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Dynamic filter chips */}
                {showFilters && (
                    <div className="space-y-2">
                        {/* Era chips */}
                        {availableEras.length > 1 && (
                            <div className="flex flex-wrap gap-1.5">
                                <span className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase self-center mr-1">
                                    Era
                                </span>
                                {availableEras.map(era => (
                                    <button
                                        key={era.label}
                                        onClick={() => setSelectedEra(prev => prev === era.label ? null : era.label)}
                                        className={cn(
                                            "px-2.5 py-1 rounded-full text-xs font-medium border transition-colors",
                                            selectedEra === era.label
                                                ? "bg-foreground text-background border-foreground"
                                                : "bg-background text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                                        )}
                                    >
                                        {era.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Topic chips */}
                        {availableTopics.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                <span className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase self-center mr-1">
                                    Topic
                                </span>
                                {availableTopics.map(topic => (
                                    <button
                                        key={topic}
                                        onClick={() => setSelectedTopic(prev => prev === topic ? null : topic)}
                                        className={cn(
                                            "px-2.5 py-1 rounded-full text-xs border transition-colors",
                                            selectedTopic === topic
                                                ? "bg-foreground text-background border-foreground font-medium"
                                                : "bg-background text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                                        )}
                                    >
                                        {topic}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Active filter summary + clear */}
                        {hasActiveFilter && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>
                                    Showing {filteredPosts.length} of {posts.length} posts
                                </span>
                                <button
                                    onClick={() => { setSelectedEra(null); setSelectedTopic(null); }}
                                    className="text-primary hover:underline"
                                >
                                    Clear filters
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Users Section */}
                {(users.length > 0 || usersLoading) && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground tracking-wider">
                                People {!usersLoading && `(${users.length})`}
                            </span>
                            {usersLoading && <Spinner size="sm" />}
                        </div>

                        {usersLoading ? (
                            <div className="space-y-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
                                        <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                                        <div className="flex-1 space-y-1.5">
                                            <Skeleton className="h-4 w-1/3" />
                                            <Skeleton className="h-3 w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {users.map((user) => (
                                    <button
                                        key={user.userId}
                                        onClick={() => navigate(`/profile/${user.userId}`)}
                                        className="flex items-center gap-3 w-full p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                                    >
                                        <Avatar className="h-10 w-10 flex-shrink-0">
                                            <AvatarImage src={user.profilePictureUrl} />
                                            <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{user.displayName}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {user.followersCount} followers · {user.postsCount} posts
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Posts Section */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground tracking-wider">
                            Posts {!postsLoading && filteredPosts.length > 0 && `(${filteredPosts.length})`}
                        </span>
                        {postsLoading && <Spinner size="sm" />}
                    </div>

                    {postsLoading && posts.length === 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[180, 220, 160, 240, 190, 210].map((h, i) => (
                                <div key={i} className="rounded-lg border overflow-hidden">
                                    <Skeleton className="w-full" style={{ height: h }} />
                                    <div className="p-3 space-y-2">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-3 w-1/2" />
                                        <Skeleton className="h-3 w-1/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredPosts.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredPosts.map((post) => (
                                    <div
                                        key={post.id}
                                        className="rounded-lg border overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => openPost(post.id)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') openPost(post.id);
                                        }}
                                        tabIndex={0}
                                    >
                                        {post.files?.[0] && (
                                            <div className="aspect-square bg-muted overflow-hidden">
                                                <img
                                                    src={post.files[0]}
                                                    alt=""
                                                    className="h-full w-full object-cover hover:scale-105 transition-transform"
                                                />
                                            </div>
                                        )}
                                        <div className="p-3 space-y-2">
                                            <p className="text-sm font-medium line-clamp-2">
                                                {highlightText(post.description, query)}
                                            </p>

                                            {/* Year + historical period badges */}
                                            {(post.year?.[0] || post.AiMetadata?.historical_period) && (
                                                <div className="flex flex-wrap gap-1">
                                                    {post.year?.[0] && (
                                                        <span className="text-[10px] font-mono font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 px-1.5 py-0.5 rounded">
                                                            {post.year[0]}
                                                        </span>
                                                    )}
                                                    {post.AiMetadata?.historical_period && (
                                                        <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded truncate max-w-[140px]">
                                                            {post.AiMetadata.historical_period}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Avatar className="h-4 w-4">
                                                    <AvatarImage src={post.userProfilePicUrl} />
                                                    <AvatarFallback className="text-xs">
                                                        {post.userDisplayName?.[0]?.toUpperCase() || 'U'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="truncate">{post.userDisplayName}</span>
                                                <span>·</span>
                                                <span>{post.likesCount || 0} likes</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Infinite scroll sentinel */}
                            <div ref={sentinelRef} className="h-8 flex justify-center items-center">
                                {postsLoading && <Spinner size="sm" />}
                            </div>
                        </>
                    ) : posts.length > 0 && hasActiveFilter ? (
                        // Has posts but filters exclude all
                        <div className="py-8 text-center">
                            <p className="text-sm text-muted-foreground mb-3">
                                No posts match the selected filters.
                            </p>
                            <button
                                onClick={() => { setSelectedEra(null); setSelectedTopic(null); }}
                                className="text-sm text-primary hover:underline"
                            >
                                Clear filters
                            </button>
                        </div>
                    ) : query && !postsLoading ? (
                        <div className="py-10 space-y-6">
                            <div className="text-center">
                                <p className="text-lg font-semibold mb-1">
                                    Nothing found for &ldquo;{query}&rdquo;
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Try a different term, or explore one of these:
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {SUGGESTED_SEARCHES.map(suggestion => (
                                    <button
                                        key={suggestion}
                                        onClick={() => setSearchParams(prev => {
                                            const next = new URLSearchParams(prev);
                                            next.set('q', suggestion);
                                            return next;
                                        })}
                                        className="px-3 py-1.5 rounded-full border text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
