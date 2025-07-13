// src/components/Profile.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // For getting userId from URL
import { Box, Typography, Button, CircularProgress, Avatar } from '@mui/material';
import PostCard from './PostCard.jsx'; // Assuming PostCard is in a sibling directory or adjust path
import {useAuthStore} from "../stores/useAuthStore.js";
import {callApiGateway} from "../firebaseConfig.js"; // For optimized selectors

const Profile = ({targetUserId}) => {
    const currentUser = useAuthStore(state => state.user);

    const toggleFollow = async (userId, isFollowing)=>{
        return await callApiGateway({
            action: isFollowing ? 'unfollowUser' : 'followUser',
            payload: { targetUserId: targetUserId }
        });
    }

    const [profileData, setProfileData] = useState(null);
    const [userPosts, setUserPosts] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followActionLoading, setFollowActionLoading] = useState(false);

    // Determine the user ID for the profile being viewed
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

    // --- Fetch User Posts ---
    // src/components/Profile.jsx (updated snippet)

    useEffect(() => {
        // Define the async function INSIDE useEffect
        const loadUserPosts = async () => {
            if (!targetUserId) {
                console.warn("loadUserPosts called without targetUserId.");
                return;
            }

            try {
                const response = await callApiGateway({
                    action: 'getUserPosts',
                    payload: {
                        userId: targetUserId, // Make sure to pass the userId!
                        limit: 20
                    }
                });
                console.log("Fetched user posts data:", response.data); // Log the actual data
                // You would then typically update your state with this data
                // For example, if you're managing user-specific posts locally in the component:
                // setProfilePosts(response.data.posts);
                // setHasMoreUserPosts(response.data.hasMore);

                // However, your store's fetchUserPosts handles this perfectly already!
                // So, you should just call the store's action here:
                // fetchUserPosts(targetUserId, true); // Call the store action for initial load
            } catch (error) {
                console.error("Error fetching user posts:", error);
                // Handle error state
            }
        };

        // Call the async function
        const response = loadUserPosts();
        setUserPosts(response.posts)

    }, [targetUserId]); // Dependency array is correct: re-run when targetUserId changes

    // --- Infinite Scroll for User Posts ---
    // const handleScroll = useCallback(() => {
    //     if (window.innerHeight + document.documentElement.scrollTop >=
    //         document.documentElement.offsetHeight - 500 && // Trigger earlier
    //         !userPostsLoading &&
    //         hasMoreUserPosts &&
    //         targetUserId // Ensure we have a target user
    //     ) {
    //         fetchUserPosts(targetUserId);
    //     }
    // }, [userPostsLoading, hasMoreUserPosts, fetchUserPosts, targetUserId]);
    //
    // useEffect(() => {
    //     window.addEventListener('scroll', handleScroll);
    //     return () => window.removeEventListener('scroll', handleScroll);
    // }, [handleScroll]);

    // --- Follow/Unfollow Handler ---
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
                    src={profileData?.profilePictureUrl || '/default-avatar.png'} // Use a default avatar if none
                    alt={profileData.displayName}
                    sx={{ width: 100, height: 100, mr: 3 }}
                />
                <Box>
                    <Typography variant="h4" component="h1">{profileData.displayName}</Typography>
                    <Typography variant="body1" color="text.secondary">@{profileData.username}</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>{profileData.bio || 'No bio available.'}</Typography>
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <Typography variant="body2">
                            **{profileData.postsCount || 0}** posts
                        </Typography>
                        <Typography variant="body2">
                            **{profileData.followersCount || 0}** followers
                        </Typography>
                        <Typography variant="body2">
                            **{profileData.followingCount || 0}** following
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
                            {followActionLoading ? <CircularProgress size={24} /> : (isFollowing ? 'Unfollow' : 'Follow')}
                        </Button>
                    )}
                </Box>
            </Box>

            {/* User Posts Section */}
            {/*<Typography variant="h5" component="h2" sx={{ mb: 3 }}>Posts</Typography>*/}
            {/*{userPosts?.length === 0  ? (*/}
            {/*    <Typography sx={{ textAlign: 'center', color: '#666' }}>*/}
            {/*        {isCurrentUserProfile ? "You haven't posted anything yet." : `${profileData.displayName} hasn't posted anything yet.`}*/}
            {/*    </Typography>*/}
            {/*) : (*/}
            {/*    userPosts?.map((post) => (*/}
            {/*        <PostCard key={post.id} post={post} />*/}
            {/*    ))*/}
            {/*)}*/}
            {/*{userPostsLoading && (*/}
            {/*    <Box sx={{ textAlign: 'center', py: 3 }}>*/}
            {/*        <CircularProgress size={30} />*/}
            {/*        <Typography color="text.secondary" sx={{ mt: 1 }}>Loading more posts...</Typography>*/}
            {/*    </Box>*/}
            {/*)}*/}
            {/*{userPosts.length > 0 && (*/}
            {/*    <Box sx={{ textAlign: 'center', py: 3, color: '#666' }}>*/}
            {/*        You've reached the end of their posts.*/}
            {/*    </Box>*/}
            {/*)}*/}
        </Box>
    );
};

export default Profile;