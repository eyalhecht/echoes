import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import {callApiGateway} from "../firebaseConfig.js";
import PostCard from "./PostCard.jsx";
import useUiStore from "../stores/useUiStore.js";

function Home() {
    const { posts, setPosts, setPostsLoading, postsLoading } = useUiStore();

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
                setPosts(response.data.posts)
                console.log("posts", response);
            } catch (error) {
                console.error('Failed to load posts:', error);
            } finally {
                setPostsLoading(false);
            }
        }
        getPosts();
    }, []);

    // Infinite scroll handler
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 1000 && !postsLoading) {
                loadMorePosts();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [postsLoading]);

    const loadMorePosts = async () => {
        setPostsLoading(true);
        const response = await callApiGateway({
            action: 'getFeed',
            payload: {
                limit: 10,
                lastPostId: null // Start from beginning
            }
        });
        setPosts(response.data.posts)
        setPostsLoading(false);
    };

    return (
        <Box sx={{ maxWidth: '600px', margin: '0 auto' }}>
            {posts && posts?.map((post, index) => (
                <PostCard key={index} post={post} />
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
        </Box>
    );
}

export default Home;
