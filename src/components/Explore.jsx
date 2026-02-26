import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { callApiGateway } from "../firebaseConfig.js";
import useUiStore from "../stores/useUiStore.js";
import { useIsMobile } from "@/hooks/use-mobile.jsx";
import TrendingContent from "./TrendingContent.jsx";
import {useNavigate} from "react-router-dom";

export function Explore() {
    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const exploreQuery = useUiStore((state) => state.exploreQuery);

    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [postsLoading, setPostsLoading] = useState(false);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const [lastPostId, setLastPostId] = useState(null);

    // Perform search when exploreQuery changes
    useEffect(() => {
        if (exploreQuery && exploreQuery.trim().length > 0) {
            searchContent(exploreQuery.trim());
        } else {
            // Clear results when no query
            setUsers([]);
            setPosts([]);
            setLastPostId(null);
            setHasMorePosts(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [exploreQuery]);

    const searchContent = async (query, loadMore = false) => {
        if (!query || query.length < 2) return;

        try {
            if (!loadMore) {
                setUsersLoading(true);
                setPostsLoading(true);
            } else {
                setPostsLoading(true);
            }

            const searchPromises = [];

            // Search users (only on initial search, not for load more)
            if (!loadMore) {
                searchPromises.push(
                    callApiGateway({
                        action: 'searchUsers',
                        payload: {
                            query: query,
                            limit: isMobile ? 5 : 8
                        }
                    })
                );
            }

            // Search posts
            searchPromises.push(
                callApiGateway({
                    action: 'searchPosts',
                    payload: {
                        query: query,
                        limit: isMobile ? 10 : 15,
                        lastPostId: loadMore ? lastPostId : null
                    }
                })
            );

            const responses = await Promise.all(searchPromises);
            
            if (!loadMore) {
                const usersResponse = responses[0];
                const postsResponse = responses[1];
                
                setUsers(usersResponse.data.users || []);
                setPosts(postsResponse.data.posts || []);
                setHasMorePosts(postsResponse.data.hasMore || false);
                setLastPostId(postsResponse.data.lastDocId || null);
            } else {
                const postsResponse = responses[0];
                
                setPosts(prev => [...prev, ...(postsResponse.data.posts || [])]);
                setHasMorePosts(postsResponse.data.hasMore || false);
                setLastPostId(postsResponse.data.lastDocId || null);
            }

        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setUsersLoading(false);
            setPostsLoading(false);
        }
    };

    const handleUserClick = (user) => {
        navigate(`/profile/${user.userId}`);
    };

    const handleLoadMorePosts = () => {
        if (exploreQuery && hasMorePosts && !postsLoading) {
            searchContent(exploreQuery.trim(), true);
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

    // Empty state - show trending content
    if (!exploreQuery || exploreQuery.trim().length === 0) {
        return <TrendingContent />;
    }

    return (
        <div className="flex-1 overflow-auto">
            <div className="max-w-4xl mx-auto p-4 space-y-6">
                {/* Search Results Header */}
                <div className="border-b pb-4">
                    <h1 className="text-xl font-semibold">
                        Search results for "{exploreQuery}"
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
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg border animate-pulse">
                                        <div className="h-10 w-10 bg-muted rounded-full" />
                                        <div className="flex-1 space-y-1">
                                            <div className="h-4 bg-muted rounded w-1/3" />
                                            <div className="h-3 bg-muted rounded w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {users.map((user) => (
                                    <button
                                        key={user.userId}
                                        onClick={() => handleUserClick(user)}
                                        className="flex items-center gap-3 w-full p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                                    >
                                        <Avatar className="h-10 w-10 flex-shrink-0">
                                            <AvatarImage src={user.profilePictureUrl} />
                                            <AvatarFallback>
                                                {getUserInitials(user)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">
                                                {user.displayName}
                                            </p>
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
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="rounded-lg border p-4 animate-pulse">
                                    <div className="h-48 bg-muted rounded mb-3" />
                                    <div className="space-y-2">
                                        <div className="h-4 bg-muted rounded w-3/4" />
                                        <div className="h-3 bg-muted rounded w-1/2" />
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
                                        onClick={() => {
                                            window.history.pushState({}, '', `?post=${post.id}`);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                window.history.pushState({}, '', `?post=${post.id}`);
                                            }
                                        }}
                                        tabIndex={0}
                                    >
                                        {/* Post Image */}
                                        {post.files?.[0] && (
                                            <div className="aspect-square bg-muted overflow-hidden">
                                                <img
                                                    src={post.files[0]}
                                                    alt=""
                                                    className="h-full w-full object-cover hover:scale-105 transition-transform"
                                                />
                                            </div>
                                        )}

                                        {/* Post Content */}
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
                                                {post.relevanceScore && (
                                                    <>
                                                        <span>·</span>
                                                        <span className="text-primary">
                                                            {Math.round(post.relevanceScore)}% match
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Load More Button */}
                            {hasMorePosts && (
                                <div className="flex justify-center pt-4">
                                    <Button 
                                        onClick={handleLoadMorePosts}
                                        disabled={postsLoading}
                                        variant="outline"
                                    >
                                        {postsLoading ? (
                                            <>
                                                <Spinner size="sm" className="mr-2" />
                                                Loading...
                                            </>
                                        ) : (
                                            'Load More Posts'
                                        )}
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : exploreQuery && !postsLoading ? (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-2">📭</div>
                            <p className="text-muted-foreground">
                                No posts found for "{exploreQuery}"
                            </p>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
