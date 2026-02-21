import React, { useEffect, useState, useCallback } from 'react';
import { useMediaQuery } from '@mui/material'; // Keep this for breakpoint detection
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut } from 'lucide-react';
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "../stores/useAuthStore.js";
import { callApiGateway } from "../firebaseConfig.js";
import PostCard from "./PostCard.jsx";
import FollowersFollowingModal from "./FollowersFollowingModal.jsx"; // Import the new modal
import { useNavigate, useParams } from 'react-router-dom';

const Profile = () => {
    const { userId: targetUserId } = useParams(); // Get userId from URL params
    const effectiveUserId = targetUserId || currentUser?.uid;
    const isMobile = useMediaQuery('(max-width: 768px)');
    const navigate = useNavigate();
    const currentUser = useAuthStore(state => state.user);

    const toggleFollow = async (userId, isFollowing) => {
        return await callApiGateway({
            action: isFollowing ? 'unfollowUser' : 'followUser',
            payload: { targetUserId: effectiveUserId }
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

    // NEW: Modal state for followers/following lists
    const [followersModalOpen, setFollowersModalOpen] = useState(false);
    const [followingModalOpen, setFollowingModalOpen] = useState(false);

    const isCurrentUserProfile = currentUser?.uid === effectiveUserId;

    // --- Fetch Profile Data ---
    useEffect(() => {
        const loadProfile = async () => {
            if (!effectiveUserId) {
                setProfileLoading(false);
                return;
            }

            setProfileLoading(true);
            try {
                const data = await callApiGateway({
                    action: 'getProfile',
                    payload: {
                        profileUserId: effectiveUserId,
                    }
                });
                if (data) {
                    setProfileData(data.data.profile);
                    setIsFollowing(data.data.profile.followers?.includes(currentUser?.uid) || false);
                }
            } catch (err) {
                console.error(err);
                navigate('/home');
            } finally {
                setProfileLoading(false);
            }
        };
        loadProfile();
    }, [effectiveUserId]);

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
        if (effectiveUserId) {
            // Reset states when effectiveUserId changes
            setUserPosts([]);
            setLastPostId(null);
            setHasMorePosts(true);
            setLoadingMorePosts(false);

            loadMorePosts(true);
        }
    }, [effectiveUserId]);

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

    // NEW: Handle followers/following clicks
    const handleFollowersClick = () => {
        if (isCurrentUserProfile) {
            setFollowersModalOpen(true);
        }
    };

    const handleFollowingClick = () => {
        if (isCurrentUserProfile) {
            setFollowingModalOpen(true);
        }
    };

    if (profileLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <Card className="shadow-lg">
                <CardContent className="p-1">
                    <div className="flex items-start gap-6 md:m-3">
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
                                                <Spinner size="sm" />
                                            ) : (
                                                isFollowing ? 'Unfollow' : 'Follow'
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {profileData?.username && <p className="text-muted-foreground mb-3">
                                @{profileData?.username || 'user'}
                            </p>}

                            <p className="text-sm text-gray-600 mb-6">
                                {profileData?.bio}
                            </p>

                            <div className="flex gap-8">
                                <div className="text-center">
                                    <div className="text-xl font-bold">
                                        {profileData?.postsCount || 0}
                                    </div>
                                    <div className="text-sm">
                                        Posts
                                    </div>
                                </div>
                                
                                {/* UPDATED: Make followers clickable for current user only */}
                                <div 
                                    className={`text-center ${
                                        isCurrentUserProfile 
                                            ? 'cursor-pointer hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors' 
                                            : ''
                                    }`}
                                    onClick={handleFollowersClick}
                                    title={isCurrentUserProfile ? 'View followers' : ''}
                                >
                                    <div className="text-xl font-bold">
                                        {profileData?.followersCount || 0}
                                    </div>
                                    <div className="text-sm">
                                        Followers
                                    </div>
                                </div>
                                
                                {/* UPDATED: Make following clickable for current user only */}
                                <div 
                                    className={`text-center ${
                                        isCurrentUserProfile 
                                            ? 'cursor-pointer hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors' 
                                            : ''
                                    }`}
                                    onClick={handleFollowingClick}
                                    title={isCurrentUserProfile ? 'View following' : ''}
                                >
                                    <div className="text-xl font-bold">
                                        {profileData?.followingCount || 0}
                                    </div>
                                    <div className="text-sm">
                                        Following
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-4">
                {userPostsLoading ? (
                    <div className="text-center py-8">
                        <Spinner size="lg" className="mx-auto mb-2" />
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
                    <div className="space-y-4">
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

            {/* NEW: Followers/Following Modals */}
            <FollowersFollowingModal
                open={followersModalOpen}
                onClose={() => setFollowersModalOpen(false)}
                userId={effectiveUserId}
                listType="followers"
                initialCount={profileData?.followersCount || 0}
            />

            <FollowersFollowingModal
                open={followingModalOpen}
                onClose={() => setFollowingModalOpen(false)}
                userId={effectiveUserId}
                listType="following"
                initialCount={profileData?.followingCount || 0}
            />
        </div>
    );
};

export default Profile;