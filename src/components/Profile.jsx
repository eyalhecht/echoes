import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress, Avatar } from '@mui/material';
import { useAuthStore } from "../stores/useAuthStore.js";
import { callApiGateway } from "../firebaseConfig.js";
import PostCard from "./PostCard.jsx";

const Profile = ({ targetUserId }) => {
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

    useEffect(() => {
        const loadUserPosts = async () => {
            if (!targetUserId) {
                console.warn("loadUserPosts called without targetUserId.");
                setUserPostsLoading(false);
                return;
            }

            setUserPostsLoading(true);
            try {
                const response = await callApiGateway({
                    action: 'getUserPosts',
                    payload: {
                        profileUserId: targetUserId, // Fix: Use profileUserId to match backend
                        limit: 20
                    }
                });

                console.log("Fetched user posts response:", response); // Debug log

                if (response && response.data.posts) {
                    setUserPosts(response.data.posts);
                } else {
                    setUserPosts([]);
                }
            } catch (error) {
                console.error("Error fetching user posts:", error);
                setUserPosts([]);
            } finally {
                setUserPostsLoading(false);
            }
        };

        loadUserPosts();
    }, [targetUserId]);

// Updated Frontend handleToggleFollow function for Profile.jsx

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
        <Box sx={{ maxWidth: '800px', margin: '0 auto', p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, borderBottom: '1px solid #eee', pb: 2 }}>
                <Avatar
                    src={profileData?.profilePictureUrl || '/default-avatar.png'}
                    alt={profileData.displayName}
                    sx={{ width: 100, height: 100, mr: 3 }}
                />
                <Box>
                    <Typography variant="h4" component="h1">{profileData.displayName}</Typography>
                    <Typography variant="body1" color="text.secondary">@{profileData.username || 'user'}</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>{profileData.bio || 'No bio available.'}</Typography>
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <Typography variant="body2">
                            <strong>{profileData.postsCount || 0}</strong> posts
                        </Typography>
                        <Typography variant="body2">
                            <strong>{profileData.followersCount || 0}</strong> followers
                        </Typography>
                        <Typography variant="body2">
                            <strong>{profileData.followingCount || 0}</strong> following
                        </Typography>
                    </Box>
                    {/* Follow/Unfollow Button */}
                    {!isCurrentUserProfile && currentUser?.uid && (
                        <Button
                            variant="contained"
                            color={isFollowing ? 'secondary' : 'primary'}
                            onClick={handleToggleFollow}
                            disabled={followActionLoading}
                            sx={{ mt: 2 }}
                        >
                            {followActionLoading ? (
                                <CircularProgress size={24} />
                            ) : (
                                isFollowing ? 'Unfollow' : 'Follow'
                            )}
                        </Button>
                    )}
                </Box>
            </Box>

            {/* User Posts Section */}
            <Typography variant="h5" component="h2" sx={{ mb: 3 }}>Posts</Typography>

            {userPostsLoading ? (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                    <CircularProgress size={30} />
                    <Typography color="text.secondary" sx={{ mt: 1 }}>Loading posts...</Typography>
                </Box>
            ) : userPosts.length === 0 ? (
                <Typography sx={{ textAlign: 'center', color: '#666' }}>
                    {isCurrentUserProfile ? "You haven't posted anything yet." : `${profileData.displayName} hasn't posted anything yet.`}
                </Typography>
            ) : (
                userPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))
            )}
        </Box>
    );
};

export default Profile;