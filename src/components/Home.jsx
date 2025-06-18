import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';

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

function PostCard({ post }) {
    return (
        <Box sx={{
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px'
        }}>
            <Box sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
                {post.user}
            </Box>
            <Box sx={{ marginBottom: '8px', color: '#666', fontSize: '12px' }}>
                {post.timestamp}
            </Box>
            <Box sx={{ lineHeight: '1.5' }}>
                {post.content}
            </Box>
        </Box>
    );
}

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load initial posts
    useEffect(() => {
        setPosts(generatePosts(1, 10));
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
            <h1 style={{ marginBottom: '20px' }}>Home</h1>

            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
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
