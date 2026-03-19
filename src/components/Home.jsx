import React, { useEffect, useCallback } from 'react';
import {callApiGateway} from "../firebaseConfig.js";
import PostCard from "./PostCard.jsx";
import useUiStore from "../stores/useUiStore.js";
// import SuggestedUsers from "./SuggestedUsers.jsx";
import { PostCardSkeleton } from "@/components/PostCardSkeleton.jsx";
import { Spinner } from "@/components/ui/spinner";

function Home() {
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

        console.log('Loading more posts...', { lastDocId, hasMore, postsLoading });
        setPostsLoading(true);
        try {
            const response = await callApiGateway({
                action: 'getFeed',
                payload: {
                    limit: 10,
                    lastPostId: lastDocId,
                }
            });

            addPosts(response.data.posts); // Append to existing posts
            setLastDocId(response.data.lastDocId);
            setHasMore(response.data.hasMore);
        } catch (error) {
            console.error('Failed to load more posts:', error);
        } finally {
            setPostsLoading(false);
        }
    }, [hasMore, postsLoading, lastDocId, addPosts, setLastDocId, setHasMore, setPostsLoading]);

    // Load initial posts
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
                        lastPostId: null,
                    }
                });
                setPosts(response.data.posts);
                setLastDocId(response.data.lastDocId);
                setHasMore(response.data.hasMore);
            } catch (error) {
                console.error('Failed to load posts:', error);
            } finally {
                setPostsLoading(false);
            }
        }
        getPosts();
    }, [setPosts, setLastDocId, setHasMore, setPostsLoading]);

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
            {/* <div className="hidden lg:block">
                <SuggestedUsers />
            </div> */}
            <div className="w-full max-w-2xl mx-auto space-y-4 mt-4">
                {postsLoading && posts.length === 0 && renderSkeletonCards()}

                {posts && posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}

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
                    <div className="text-center py-10 text-muted-foreground/70">
                        No posts found
                    </div>
                )}
            </div>
        </>
    );
}

export default Home;