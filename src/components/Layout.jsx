import React, { useState, useEffect } from 'react';
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
        <div style={{
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px'
        }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                {post.user}
            </div>
            <div style={{ marginBottom: '8px', color: '#666', fontSize: '12px' }}>
                {post.timestamp}
            </div>
            <div style={{ lineHeight: '1.5' }}>
                {post.content}
            </div>
        </div>
    );
}

const HEADER_HEIGHT = 40;

function Sidebar() {
    const [activeItem, setActiveItem] = useState('Home');
    const items = ['Home', 'Profile', 'Friends', 'Messages', 'Settings'];

    return (
        <div style={{
            width: '200px',
            height: '100vh',
            backgroundColor: 'white',
            position: 'fixed',
            left: 0,
            top: HEADER_HEIGHT,
            borderRight: '1px solid #ddd'
        }}>
            {items.map((item) => (
                <div
                    key={item}
                    onClick={() => setActiveItem(item)}
                    style={{
                        padding: '16px',
                        cursor: 'pointer',
                        backgroundColor: activeItem === item ? '#e3f2fd' : 'transparent',
                    }}
                >
                    {item}
                </div>
            ))}
        </div>
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
        <div style={{
            marginLeft: '200px',
            marginTop: HEADER_HEIGHT,
            minHeight: `calc(100vh - ${HEADER_HEIGHT})`,
            backgroundColor: '#f5f5f5',
            padding: '20px'
        }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h1 style={{ marginBottom: '20px' }}>Home</h1>

                {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}

                {loading && (
                    <div style={{
                        textAlign: 'center',
                        padding: '20px',
                        color: '#666'
                    }}>
                        Loading more posts...
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Layout() {
    return (
        <div>
            <Header height={HEADER_HEIGHT} />
            <Sidebar />
            <MainContent />
        </div>
    );
}