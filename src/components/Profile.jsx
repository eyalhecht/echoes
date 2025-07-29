import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography, Button, CircularProgress, Avatar, Paper, useMediaQuery, useTheme, IconButton } from '@mui/material';
import { useAuthStore } from "../stores/useAuthStore.js";
import { callApiGateway } from "../firebaseConfig.js";
import PostCard from "./PostCard.jsx";
import { LogoutOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Profile = ({ targetUserId }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const currentUser = useAuthStore(state => state.user);

    const toggleFollow = async (userId, isFollowing)=>{
        return await callApiGateway({
            action: isFollowing ? 'unfollowUser' : 'followUser',
            payload: { targetUserId: targetUserId }
        });
    }

    const [profileData, setProfileData] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [profileLoading, setProfileLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followActionLoading, setFollowActionLoading] = useState(false);
    const [userPostsLoading, setUserPostsLoading] = useState(true);
    
    const [lastPostId, setLastPostId] = useState(null);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const [loadingMorePosts, setLoadingMorePosts] = useState(false);

    const isCurrentUserProfile = currentUser?.uid === targetUserId;

    // --- Fetch Profile Data ---
    useEffect(() => {
        const loadProfile = async () => {
            if (!targetUserId) {
                setProfileLoading(false);
                return;
            }

            setProfileLoading(true);
            try {
                const data = await callApiGateway({
                    action: 'getProfile',
                    payload: {
                        profileUserId: targetUserId,
                    }
                });
                if (data) {
                    setProfileData(data.data.profile);
                    setIsFollowing(data.data.profile.followers?.includes(currentUser?.uid) || false);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setProfileLoading(false);
            }
        };
        loadProfile();
    }, [targetUserId]);

    const loadMorePosts = useCallback(async (isInitial = false) => {
        if (!targetUserId) {
            console.warn("loadMorePosts called without targetUserId.");
            return;
        }

        if (!isInitial && (!hasMorePosts || loadingMorePosts)) return;
        const loading = isInitial ? setUserPostsLoading : setLoadingMorePosts;
        loading(true);

        try {
            const response = await callApiGateway({
                action: 'getUserPosts',
                payload: {
                    profileUserId: targetUserId,
                    limit: 10,
                    lastPostId: isInitial ? null : lastPostId
                }
            });

            console.log("Fetched user posts response:", response);

            if (response && response.data.posts) {
                if (isInitial) {
                    setUserPosts(response.data.posts);
                } else {
                    setUserPosts(prevPosts => [...prevPosts, ...response.data.posts]);
                }
                setLastPostId(response.data.lastDocId);
                setHasMorePosts(response.data.hasMore);
            } else {
                if (isInitial) {
                    setUserPosts([]);
                }
                setHasMorePosts(false);
            }
        } catch (error) {
            console.error("Error fetching user posts:", error);
            if (isInitial) {
                setUserPosts([]);
            }
            setHasMorePosts(false);
        } finally {
            loading(false);
        }
    }, [targetUserId, hasMorePosts, loadingMorePosts, lastPostId]);

    // Load initial posts
    useEffect(() => {
        if (targetUserId) {
            // Reset states when targetUserId changes
            setUserPosts([]);
            setLastPostId(null);
            setHasMorePosts(true);
            setLoadingMorePosts(false);
            
            loadMorePosts(true);
        }
    }, [targetUserId]);

    // Infinite scroll handler
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            // Trigger when user is within 200px of the bottom
            const nearBottom = scrollTop + windowHeight >= documentHeight - 200;
            
            if (nearBottom && hasMorePosts && !loadingMorePosts && !userPostsLoading) {
                console.log('Profile scroll triggered load more posts');
                loadMorePosts(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMorePosts, hasMorePosts, loadingMorePosts, userPostsLoading]);

    const handleLogout = async () => {
        try {
            await useAuthStore.getState().logout();
            navigate('/login');
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    const handleToggleFollow = async () => {
        if (!currentUser?.uid) {
            alert('You must be logged in to follow/unfollow.');
            return;
        }
        if (!profileData || followActionLoading) return;

        setFollowActionLoading(true);
        const success = await toggleFollow(profileData.userId, isFollowing);
        if (success) {
            setIsFollowing(!isFollowing);
            setProfileData(prev => ({
                ...prev,
                followersCount: isFollowing ? (prev.followersCount - 1) : (prev.followersCount + 1)
            }));
        }
        setFollowActionLoading(false);
    };

    if (profileLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: '900px', margin: '0 auto', p: 0, paddingBottom: '20px' }}>
            <Paper sx={{
                p: 3,
                mx: 2,
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                position: 'relative',
            }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                    <Avatar
                        src={profileData?.profilePictureUrl || '/default-avatar.png'}
                        alt={profileData.displayName}
                        sx={{
                            width: 100,
                            height: 100,
                            border: '4px solid white',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                    />
                    <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                                {profileData.displayName}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {/* Logout button for current user on mobile */}
                                {isCurrentUserProfile && isMobile && (
                                    <IconButton
                                        onClick={handleLogout}
                                        sx={{
                                            color: '#8B4513',
                                            '&:hover': {
                                                backgroundColor: 'rgba(139, 69, 19, 0.1)'
                                            }
                                        }}
                                        title="Logout"
                                    >
                                        <LogoutOutlined />
                                    </IconButton>
                                )}
                                {/* Follow button for other users */}
                                {!isCurrentUserProfile && currentUser?.uid && (
                                    <Button
                                        variant={isFollowing ? 'outlined' : 'contained'}
                                        color="primary"
                                        onClick={handleToggleFollow}
                                        disabled={followActionLoading}
                                        sx={{ minWidth: '100px' }}
                                    >
                                        {followActionLoading ? (
                                            <CircularProgress size={20} />
                                        ) : (
                                            isFollowing ? 'Unfollow' : 'Follow'
                                        )}
                                    </Button>
                                )}
                            </Box>
                        </Box>

                        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                            @{profileData.username || 'user'}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
                            {profileData.bio || 'No bio available.'}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 4 }}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c2c2c' }}>
                                    {profileData.postsCount || 0}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Posts
                                </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c2c2c' }}>
                                    {profileData.followersCount || 0}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Followers
                                </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c2c2c' }}>
                                    {profileData.followingCount || 0}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Following
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Paper>

            <Box sx={{ p: 2, mt: 2 }}>
                {userPostsLoading ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <CircularProgress size={30} />
                        <Typography color="text.secondary" sx={{ mt: 1 }}>Loading posts...</Typography>
                    </Box>
                ) : userPosts.length === 0 ? (
                    <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#f9f9f9' }}>
                        <Typography sx={{ color: '#666' }}>
                            {isCurrentUserProfile ? "You haven't posted anything yet." : `${profileData.displayName} hasn't posted anything yet.`}
                        </Typography>
                    </Paper>
                ) : (
                    <Box sx={{display: "flex", flexDirection: "column", gap: "10px"}}>
                        {userPosts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                        
                        {loadingMorePosts && (
                            <Box sx={{
                                textAlign: 'center',
                                padding: '20px',
                                color: '#666'
                            }}>
                                Loading more posts...
                            </Box>
                        )}
                        
                        {!hasMorePosts && userPosts.length > 0 && (
                            <Box sx={{
                                textAlign: 'center',
                                padding: '20px',
                                color: '#666'
                            }}>
                                No more posts to load
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default Profile;