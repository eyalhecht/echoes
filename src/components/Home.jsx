import React, { useEffect, useCallback, useState } from 'react';
import {callApiGateway} from "../firebaseConfig.js";
import PostCard from "./PostCard.jsx";
import useUiStore from "../stores/useUiStore.js";
import SuggestedUsers from "./SuggestedUsers.jsx";
import { PostCardSkeleton } from "@/components/PostCardSkeleton.jsx";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

function Home() {
    const [activeTab, setActiveTab] = useState('recent');

    const {
        posts,
        setPosts,
        addPosts,
        setPostsLoading,
        postsLoading,
        lastDocId,
        setLastDocId,
        hasMore,
        setHasMore
    } = useUiStore();

    // Load more posts function with useCallback to prevent recreation
    const loadMorePosts = useCallback(async () => {
        if (!hasMore || postsLoading) return; // Safety check

        console.log('Loading more posts...', { lastDocId, hasMore, postsLoading, feedType: activeTab });
        setPostsLoading(true);
        try {
            const response = await callApiGateway({
                action: 'getFeed',
                payload: {
                    limit: 10,
                    lastPostId: lastDocId, // Use the actual last document ID
                    feedType: activeTab // 'recent' or 'following'
                }
            });

            addPosts(response.data.posts); // Append to existing posts
            setLastDocId(response.data.lastDocId);
            setHasMore(response.data.hasMore);
            console.log("More posts loaded:", response.data);
        } catch (error) {
            console.error('Failed to load more posts:', error);
        } finally {
            setPostsLoading(false);
        }
    }, [hasMore, postsLoading, lastDocId, addPosts, setLastDocId, setHasMore, setPostsLoading, activeTab]);

    // Load initial posts or reload when tab changes
    useEffect(() => {
        const getPosts = async () => {
            setPosts([]);
            setLastDocId(null);
            setPostsLoading(true);
            try {
                const response = await callApiGateway({
                    action: 'getFeed',
                    payload: {
                        limit: 10,
                        lastPostId: null, // Start from beginning
                        feedType: activeTab // 'recent' or 'following'
                    }
                });
                setPosts(response.data.posts);
                setLastDocId(response.data.lastDocId);
                setHasMore(response.data.hasMore);
                console.log("Posts loaded:", response.data);
            } catch (error) {
                console.error('Failed to load posts:', error);
            } finally {
                setPostsLoading(false);
            }
        }
        getPosts();
    }, [activeTab, setPosts, setLastDocId, setHasMore, setPostsLoading]); // Reload when tab changes

    // Infinite scroll handler
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const lastThirdStart = documentHeight * (2 / 3);
            // Trigger when the bottom of the viewport has scrolled past the start of the last third
            const reachesLastThird = (scrollTop + windowHeight) >= lastThirdStart;

            if (reachesLastThird && hasMore && !postsLoading) {
                console.log('Scroll triggered load more');
                loadMorePosts();
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMorePosts, hasMore, postsLoading]);

    const renderSkeletonCards = () => (
        Array.from({ length: 5 }).map((_, index) => (
            <PostCardSkeleton key={`skeleton-${index}`} />
        ))
    );

    return (
        <>
            <div className="hidden lg:block">
                <SuggestedUsers />
            </div>
            <div className={cn("max-w-[600px] mx-auto pb-5")}>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="lg:w-[500px] md:w-full">
                    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
                        <TabsList className="w-full justify-start rounded-none h-12 bg-transparent p-0">
                            <TabsTrigger
                                value="recent"
                                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                            >
                                Recent
                            </TabsTrigger>
                            <TabsTrigger
                                value="following"
                                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                            >
                                Following
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                        {postsLoading && posts.length === 0 && renderSkeletonCards()}

                        {posts && posts?.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}

                        {/* Show loading for pagination (when loading more posts) */}
                        {postsLoading && posts.length > 0 && (
                            <div className="flex justify-center items-center py-5 gap-2 text-muted-foreground">
                                <Spinner />
                                <span>Loading more posts...</span>
                            </div>
                        )}

                        {!hasMore && posts.length > 0 && (
                            <div className="text-center py-5 text-muted-foreground">
                                No more posts to load
                            </div>
                        )}

                        {posts.length === 0 && !postsLoading && (
                            <>
                                {activeTab === 'following' ? (
                                    <Empty className="py-10">
                                        <EmptyHeader>
                                            <EmptyMedia>
                                                <Users className="h-12 w-12 text-muted-foreground" />
                                            </EmptyMedia>
                                            <EmptyTitle>No posts from people you follow</EmptyTitle>
                                            <EmptyDescription>
                                                Start following users to see their posts in your feed.
                                            </EmptyDescription>
                                        </EmptyHeader>
                                        <EmptyContent>
                                            <Button onClick={() => setActiveTab('recent')}>
                                                Discover Users
                                            </Button>
                                        </EmptyContent>
                                    </Empty>
                                ) : (
                                    <div className="text-center py-10 text-muted-foreground/70">
                                        No posts found
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </Tabs>
            </div>
        </>
    );
}

export default Home;