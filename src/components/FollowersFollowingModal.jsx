import React, { useState, useEffect, useCallback } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
// ScrollArea not available, we'll use a regular scrollable div
import { Users, UserPlus, AlertCircle } from 'lucide-react';
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { callApiGateway } from "../firebaseConfig.js";
import { useNavigate } from 'react-router-dom';

const FollowersFollowingModal = ({ 
    open, 
    onClose, 
    userId, 
    listType, // 'followers' or 'following'
    initialCount = 0 
}) => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [lastUserId, setLastUserId] = useState(null);

    // Reset state when modal opens or listType changes
    useEffect(() => {
        if (open) {
            setUsers([]);
            setLastUserId(null);
            setHasMore(true);
            setError(null);
            loadUsers(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, listType, userId]);

    const loadUsers = useCallback(async (isInitial = false) => {
        if (!userId || (!isInitial && (!hasMore || loadingMore))) return;

        const setLoadingState = isInitial ? setLoading : setLoadingMore;
        setLoadingState(true);
        setError(null);

        try {
            const action = listType === 'followers' ? 'getFollowersList' : 'getFollowingList';
            const response = await callApiGateway({
                action,
                payload: {
                    profileUserId: userId,
                    limit: 20,
                    lastUserId: isInitial ? null : lastUserId
                }
            });

            if (response && response.data.users) {
                if (isInitial) {
                    setUsers(response.data.users);
                } else {
                    setUsers(prevUsers => [...prevUsers, ...response.data.users]);
                }
                setLastUserId(response.data.lastUserId);
                setHasMore(response.data.hasMore);
            } else {
                if (isInitial) {
                    setUsers([]);
                }
                setHasMore(false);
            }
        } catch (err) {
            console.error(`Error fetching ${listType}:`, err);
            setError(err.message || `Failed to load ${listType} list`);
            if (isInitial) {
                setUsers([]);
            }
            setHasMore(false);
        } finally {
            setLoadingState(false);
        }
    }, [userId, listType, hasMore, loadingMore, lastUserId]);

    // Handle scroll to load more
    const handleScrollToBottom = useCallback(() => {
        if (hasMore && !loadingMore && !loading) {
            loadUsers(false);
        }
    }, [loadUsers, hasMore, loadingMore, loading]);

    const handleUserClick = (clickedUserId) => {
        navigate(`/profile/${clickedUserId}`);
        onClose(); // Close the modal
    };

    const UserItem = ({ user }) => (
        <div className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors">
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar 
                    className="h-12 w-12 cursor-pointer" 
                    onClick={() => handleUserClick(user.userId)}
                >
                    <AvatarImage 
                        src={user.profilePictureUrl || '/default-avatar.png'} 
                        alt={user.displayName} 
                    />
                    <AvatarFallback>
                        {user.displayName?.charAt(0) || 'U'}
                    </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 
                            className="font-semibold truncate cursor-pointer hover:underline"
                            onClick={() => handleUserClick(user.userId)}
                        >
                            {user.displayName}
                        </h3>
                    </div>
                    
                    {user.bio && (
                        <p className="text-sm text-muted-foreground truncate mt-1">
                            {user.bio}
                        </p>
                    )}
                    
                    <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">
                            {user.postsCount} posts
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {user.followersCount} followers
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

    const UserItemSkeleton = () => (
        <div className="flex items-center gap-3 p-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-48 mb-2" />
                <div className="flex gap-3">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-20" />
                </div>
            </div>
        </div>
    );

    const title = listType === 'followers' ? 'Followers' : 'Following';
    const icon = listType === 'followers' ? <Users className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md max-h-[80vh] p-0">
                 <DialogHeader className="p-6 pb-4">
                    <DialogTitle className="flex items-center gap-2">
                        {icon}
                        {title}
                        <Badge variant="secondary">
                            {loading ? '...' : initialCount}
                        </Badge>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 min-h-0">
                    {error ? (
                        <div className="p-6">
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    {error}
                                </AlertDescription>
                            </Alert>
                            <Button 
                                variant="outline" 
                                onClick={() => loadUsers(true)}
                                className="w-full mt-4"
                            >
                                Try Again
                            </Button>
                        </div>
                    ) : (
                        <div 
                            className="max-h-[400px] overflow-y-auto"
                            onScroll={(e) => {
                                const { scrollTop, scrollHeight, clientHeight } = e.target;
                                // Load more when near bottom
                                if (scrollHeight - scrollTop <= clientHeight + 50) {
                                    handleScrollToBottom();
                                }
                            }}
                        >
                            <div className="px-6 pb-6">
                                {loading ? (
                                    // Initial loading skeletons
                                    <div className="space-y-2">
                                        {[...Array(5)].map((_, i) => (
                                            <UserItemSkeleton key={i} />
                                        ))}
                                    </div>
                                ) : users.length === 0 ? (
                                    // Empty state
                                    <div className="text-center py-8">
                                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                                        <p className="text-muted-foreground">
                                            No {listType} yet
                                        </p>
                                    </div>
                                ) : (
                                    // Users list
                                    <div className="space-y-1">
                                        {users.map((user) => (
                                            <UserItem key={user.userId} user={user} />
                                        ))}
                                        
                                        {/* Load more indicator */}
                                        {loadingMore && (
                                            <div className="flex justify-center py-4">
                                                <Spinner size="sm" />
                                            </div>
                                        )}
                                        
                                        {/* End of list indicator */}
                                        {!hasMore && users.length > 0 && (
                                            <div className="text-center py-4">
                                                <p className="text-sm text-muted-foreground">
                                                    No more {listType} to load
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FollowersFollowingModal;