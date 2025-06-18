import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveSidebarItem } from '../store/slices/uiSlice';
import { Box } from '@mui/material';
import Header from './Header.jsx';

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

const HEADER_HEIGHT = 40;

function Sidebar() {
    const activeSidebarItem = useSelector(state => state.ui.activeSidebarItem);
    const dispatch = useDispatch();
    const items = ['Home', 'Profile', 'Friends', 'Messages', 'Settings'];

    return (
        <Box sx={{
            width: '200px',
            height: '100vh',
            backgroundColor: 'white',
            position: 'fixed',
            left: 0,
            top: HEADER_HEIGHT,
            borderRight: '1px solid #ddd'
        }}>
            {items.map((item) => (
                <Box
                    key={item}
                    onClick={() => dispatch(setActiveSidebarItem(item))}
                    sx={{
                        padding: '16px',
                        cursor: 'pointer',
                        backgroundColor: activeSidebarItem === item ? '#e3f2fd' : 'transparent',
                    }}
                >
                    {item}
                </Box>
            ))}
        </Box>
    );
}

function MainContent() {
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
        <Box sx={{
            marginLeft: '200px',
            marginTop: `${HEADER_HEIGHT}px`,
            minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
            backgroundColor: '#f5f5f5',
            padding: '20px'
        }}>
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
        </Box>
    );
}

export default function Layout() {
    return (
        <Box>
            <Header height={HEADER_HEIGHT} />
            <Sidebar />
            <MainContent />
        </Box>
    );
}
