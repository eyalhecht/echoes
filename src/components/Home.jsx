import React, { useEffect, useCallback } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import {callApiGateway} from "../firebaseConfig.js";
import PostCard from "./PostCard.jsx";
import useUiStore from "../stores/useUiStore.js";
import SuggestedUsers from "./SuggestedUsers.jsx";

function Home() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
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
                    lastPostId: lastDocId // Use the actual last document ID
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
    }, [hasMore, postsLoading, lastDocId, addPosts, setLastDocId, setHasMore, setPostsLoading]);

    // Load initial posts
    useEffect(() => {
        const getPosts = async () => {
            setPostsLoading(true);
            try {
                const response = await callApiGateway({
                    action: 'getFeed',
                    payload: {
                        limit: 10,
                        lastPostId: null // Start from beginning
                    }
                });
                setPosts(response.data.posts);
                setLastDocId(response.data.lastDocId);
                setHasMore(response.data.hasMore);
                console.log("Initial posts loaded:", response.data);
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

    return (
        <>
            {!isMobile && <SuggestedUsers />}
            <Box sx={{ 
                maxWidth: '600px', 
                margin: '0 auto', 
                marginLeft: isMobile ? 'auto' : '280px', // Responsive margin
                paddingBottom: '20px' ,
                gap: "10px",
                display: "flex",
                flexDirection: 'column',
            }}>
                {posts && posts?.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}

                {postsLoading && (
                    <Box sx={{
                        textAlign: 'center',
                        padding: '20px',
                        color: '#666'
                    }}>
                        Loading more posts...
                    </Box>
                )}

                {!hasMore && posts.length > 0 && (
                    <Box sx={{
                        textAlign: 'center',
                        padding: '20px',
                        color: '#666'
                    }}>
                        No more posts to load
                    </Box>
                )}

                {posts.length === 0 && !postsLoading && (
                    <Box sx={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#999'
                    }}>
                        No posts found
                    </Box>
                )}
            </Box>
        </>
    );
}

export default Home;