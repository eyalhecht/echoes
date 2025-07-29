import React, { useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
import {callApiGateway} from "../firebaseConfig.js";
import PostCard from "./PostCard.jsx";
import useUiStore from "../stores/useUiStore.js";

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
            
            // Trigger when user is within 200px of the bottom
            const nearBottom = scrollTop + windowHeight >= documentHeight - 200;
            
            if (nearBottom && hasMore && !postsLoading) {
                console.log('Scroll triggered load more');
                loadMorePosts();
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMorePosts, hasMore, postsLoading]);

    return (
        <Box sx={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '20px' }}>
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
    );
}

export default Home;