import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '@mui/material'; // Keep this for breakpoint detection
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { callApiGateway } from '../firebaseConfig.js';
import { useAuthStore } from '../stores/useAuthStore.js';
import { SuggestedUsersSkeleton } from "@/components/SuggestedUsersSkeleton.jsx";
import { useNavigate } from 'react-router-dom';

const SuggestedUsers = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 768px)'); // Using direct media query
    const currentUser = useAuthStore(state => state.user);

    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [followingStates, setFollowingStates] = useState({});

    // Fetch suggested users
    useEffect(() => {
        if (isMobile) {
            setLoading(false);
            return;
        }

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
    }, [currentUser?.uid, isMobile]);

    if (isMobile) {
        return null;
    }

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
        navigate(`/profile/${userId}`);
    };

    if (loading) {
        return <SuggestedUsersSkeleton />;
    }

    if (suggestedUsers.length === 0) {
        return null;
    }

    return (
        <Card className="fixed top-[68px] right-5 w-[280px] max-h-[500px] shadow-lg overflow-y-auto">
            <CardHeader className="pb-4">
                <h3 className="text-base font-bold">
                    Suggested for you
                </h3>
            </CardHeader>

            <CardContent className="space-y-3 pt-0">
                {suggestedUsers.map((user) => {
                    const isFollowing = followingStates[user.userId] || false;

                    return (
                        <div
                            key={user.userId}
                            className="flex items-center justify-between py-2"
                        >
                            {/* User Info */}
                            <div
                                className="flex items-center gap-3 flex-1 cursor-pointer min-w-0"
                                onClick={() => handleProfileClick(user.userId)}
                            >
                                <Avatar className="h-11 w-11">
                                    <AvatarImage
                                        src={user.profilePictureUrl}
                                        alt={user.displayName}
                                    />
                                    <AvatarFallback>
                                        {user.displayName?.charAt(0) || 'U'}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">
                                        {user.displayName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {user.reason}
                                    </p>
                                </div>
                            </div>

                            {/* Follow Button */}
                            <Button
                                variant={isFollowing ? "outline" : "default"}
                                size="sm"
                                onClick={() => handleFollowToggle(user.userId, isFollowing)}
                                className="min-w-[70px] h-8 text-xs font-semibold"
                            >
                                {isFollowing ? 'Following' : 'Follow'}
                            </Button>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
};

export default SuggestedUsers;