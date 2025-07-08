import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import {callApiGateway} from "../firebaseConfig.js";
import PostCard from "./PostCard.jsx";

const generatePosts = (startId = 1, count = 10) => {
    const posts = [];
    for (let i = 0; i < count; i++) {
        posts.push({
            id: startId + i,
            user: `User ${startId + i}`,
            content: `This is post content number ${startId + i}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
            timestamp: `${Math.floor(Math.random() * 24)} hours ago`
        });
    }
    return posts;
};


function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load initial posts
    useEffect(() => {
        const getPosts = async () => {
            const response = await callApiGateway({
                action: 'getFeed',
                payload: {
                    limit: 10,
                    lastPostId: null // Start from beginning
                }
            });
            setPosts(response.data.posts)
            console.log("posts", response);
        }
        getPosts();
    }, []);

    // Infinite scroll handler
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 1000 && !loading) {
                loadMorePosts();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading]);

    const loadMorePosts = () => {
        setLoading(true);
        // Simulate API call delay
        setTimeout(() => {
            const newPosts = generatePosts(posts.length + 1, 5);
            setPosts(prevPosts => [...prevPosts, ...newPosts]);
            setLoading(false);
        }, 1000);
    };

    return (
        <Box sx={{ maxWidth: '600px', margin: '0 auto' }}>

            {posts.map((post, index) => (
                <PostCard key={index} post={post} />
            ))}

            {loading && (
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
