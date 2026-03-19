import React, { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { callApiGateway } from "../firebaseConfig.js";
import { useIsMobile } from "@/hooks/use-mobile.jsx";
import TrendingContent from "./TrendingContent.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";

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

    const sentinelRef = useRef(null);

    const openPost = (postId) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set('post', postId);
            return next;
        });
    };

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

    return (
        <div className="flex-1 overflow-auto">
            <div className="max-w-4xl mx-auto p-4 space-y-6">
                {/* Header */}
                <div className="border-b pb-4">
                    <h1 className="text-xl font-semibold">
                        Search results for &ldquo;{query}&rdquo;
                    </h1>
                </div>

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
                            Posts {!postsLoading && posts.length > 0 && `(${posts.length})`}
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
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : posts.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {posts.map((post) => (
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
                                        <div className="p-3">
                                            <p className="text-sm font-medium line-clamp-2 mb-2">
                                                {post.description}
                                            </p>
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
