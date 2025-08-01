import React, { useEffect, useState, useCallback } from 'react';
import { useMediaQuery } from '@mui/material'; // Keep this for breakpoint detection
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, Loader2 } from 'lucide-react';
import { useAuthStore } from "../stores/useAuthStore.js";
import { callApiGateway } from "../firebaseConfig.js";
import PostCard from "./PostCard.jsx";
import { useNavigate } from 'react-router-dom';

const Profile = ({ targetUserId }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const navigate = useNavigate();
    const currentUser = useAuthStore(state => state.user);

    const toggleFollow = async (userId, isFollowing) => {
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
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-0 pb-5">
            <Card className="mx-2 shadow-lg">
                <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                        <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                            <AvatarImage
                                src={profileData?.profilePictureUrl || '/default-avatar.png'}
                                alt={profileData?.displayName}
                            />
                            <AvatarFallback className="text-2xl">
                                {profileData?.displayName?.charAt(0) || 'U'}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <h1 className="text-3xl font-bold">
                                    {profileData?.displayName}
                                </h1>

                                <div className="flex items-center gap-2">
                                    {/* Logout button for current user on mobile */}
                                    {isCurrentUserProfile && isMobile && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleLogout}
                                            className="text-amber-700 hover:bg-amber-100"
                                            title="Logout"
                                        >
                                            <LogOut className="h-5 w-5" />
                                        </Button>
                                    )}

                                    {/* Follow button for other users */}
                                    {!isCurrentUserProfile && currentUser?.uid && (
                                        <Button
                                            variant={isFollowing ? 'outline' : 'default'}
                                            onClick={handleToggleFollow}
                                            disabled={followActionLoading}
                                            className="min-w-[100px]"
                                        >
                                            {followActionLoading ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                isFollowing ? 'Unfollow' : 'Follow'
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <p className="text-muted-foreground mb-3">
                                @{profileData?.username || 'user'}
                            </p>

                            <p className="text-sm text-gray-600 mb-6">
                                {profileData?.bio || 'No bio available.'}
                            </p>

                            <div className="flex gap-8">
                                <div className="text-center">
                                    <div className="text-xl font-bold text-gray-800">
                                        {profileData?.postsCount || 0}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Posts
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl font-bold text-gray-800">
                                        {profileData?.followersCount || 0}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Followers
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl font-bold text-gray-800">
                                        {profileData?.followingCount || 0}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Following
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="p-2 mt-4">
                {userPostsLoading ? (
                    <div className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                        <p className="text-muted-foreground">Loading posts...</p>
                    </div>
                ) : userPosts.length === 0 ? (
                    <Card className="p-8 text-center bg-gray-50">
                        <p className="text-gray-600">
                            {isCurrentUserProfile
                                ? "You haven't posted anything yet."
                                : `${profileData?.displayName} hasn't posted anything yet.`
                            }
                        </p>
                    </Card>
                ) : (
                    <div className="flex flex-col items-center gap-2.5">
                        {userPosts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}

                        {loadingMorePosts && (
                            <div className="text-center py-5 text-gray-600">
                                Loading more posts...
                            </div>
                        )}

                        {!hasMorePosts && userPosts.length > 0 && (
                            <div className="text-center py-5 text-gray-600">
                                No more posts to load
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;