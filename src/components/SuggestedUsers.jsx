import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Button, CircularProgress, Paper } from '@mui/material';
import { callApiGateway } from '../firebaseConfig.js';
import { useAuthStore } from '../stores/useAuthStore.js';
import useUiStore from '../stores/useUiStore.js';

const SuggestedUsers = () => {
    const currentUser = useAuthStore(state => state.user);
    const setActiveProfileView = useUiStore(state => state.setActiveProfileView);
    const setActiveSidebarItem = useUiStore((state) => state.setActiveSidebarItem);

    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [followingStates, setFollowingStates] = useState({});

    // Fetch suggested users
    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            if (!currentUser?.uid) return;
            
            setLoading(true);
            try {
                const response = await callApiGateway({
                    action: 'getSuggestedUsers',
                    payload: { limit: 5 }
                });

                if (response?.data?.suggestedUsers) {
                    setSuggestedUsers(response.data.suggestedUsers);
                }
            } catch (error) {
                console.error('Error fetching suggested users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestedUsers();
    }, [currentUser?.uid]);

    // Handle follow/unfollow
    const handleFollowToggle = async (targetUserId, isCurrentlyFollowing) => {
        if (!currentUser?.uid) return;

        // Optimistic update
        setFollowingStates(prev => ({
            ...prev,
            [targetUserId]: !isCurrentlyFollowing
        }));

        try {
            await callApiGateway({
                action: isCurrentlyFollowing ? 'unfollowUser' : 'followUser',
                payload: { targetUserId }
            });
        } catch (error) {
            console.error('Error toggling follow:', error);
            // Revert optimistic update on error
            setFollowingStates(prev => ({
                ...prev,
                [targetUserId]: isCurrentlyFollowing
            }));
        }
    };

    const handleProfileClick = (userId) => {
        setActiveSidebarItem('Profile')
        setActiveProfileView(userId);
    };

    if (loading) {
        return (
            <Paper sx={{
                position: 'fixed',
                top: '20px',
                right: '20px', // Changed to right side
                width: '320px',
                height: '400px',
                borderRadius: '12px',
                padding: '20px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <CircularProgress size={30} />
            </Paper>
        );
    }

    if (suggestedUsers.length === 0) {
        return null; // Don't show if no suggestions
    }

    return (
        <Paper sx={{
            position: 'fixed',
            top: '20px',
            right: '20px', // Changed to right side
            width: '320px',
            maxHeight: '500px',
            borderRadius: '12px',
            padding: '20px',
            backgroundColor: '#fff',
            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
            overflowY: 'auto'
        }}>
            {/* Header */}
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '16px' 
            }}>
                <Typography variant="h6" sx={{ 
                    fontWeight: 'bold',
                    fontSize: '16px',
                    color: '#2d2d2d'
                }}>
                    Suggested for you
                </Typography>
            </Box>

            {/* Suggested Users List */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {suggestedUsers.map((user) => {
                    const isFollowing = followingStates[user.userId] || false;
                    
                    return (
                        <Box 
                            key={user.userId} 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                padding: '8px 0'
                            }}
                        >
                            {/* User Info */}
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '12px',
                                flex: 1,
                                cursor: 'pointer'
                            }}
                                 onClick={() => handleProfileClick(user.userId)}

                            >
                                <Avatar
                                    src={user.profilePictureUrl}
                                    alt={user.displayName}
                                    sx={{ width: 44, height: 44 }}
                                />
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{ 
                                            fontWeight: '600',
                                            fontSize: '14px',
                                            color: '#2d2d2d',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {user.displayName}
                                    </Typography>
                                    <Typography 
                                        variant="caption" 
                                        sx={{ 
                                            color: '#666',
                                            fontSize: '12px'
                                        }}
                                    >
                                        {user.reason}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Follow Button */}
                            <Button
                                variant={isFollowing ? "outlined" : "contained"}
                                size="small"
                                onClick={() => handleFollowToggle(user.userId, isFollowing)}
                                sx={{
                                    minWidth: '70px',
                                    height: '32px',
                                    textTransform: 'none',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                }}
                            >
                                {isFollowing ? 'Following' : 'Follow'}
                            </Button>
                        </Box>
                    );
                })}
            </Box>
        </Paper>
    );
};

export default SuggestedUsers;