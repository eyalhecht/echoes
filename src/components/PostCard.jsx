import React, { useState, useCallback } from 'react';
import {
    Card,
    CardHeader,
    CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Heart,
    MessageCircle,
    Bookmark,
    MapPin,
    Trash2,
    Send,
    Sparkles, MoreHorizontal,
} from 'lucide-react';
import { format, formatDistanceToNowStrict, isToday, isYesterday } from 'date-fns';
import { usePostInteractions } from '../hooks/usePostInteractions';
import PostMap from "./PostMap.jsx";
import PostDetailView from "./PostDetailView.jsx";
import useUiStore from "../stores/useUiStore.js";
import { useAuthStore } from "../stores/useAuthStore.js";
import { callApiGateway } from "../firebaseConfig.js";

function PostCard({ post }) {
    const {
        liked,
        likesCount,
        isLikeUpdating,
        bookmarked,
        bookmarksCount,
        isBookmarkUpdating,
        handleLikeToggle,
        handleBookmarkToggle,
    } = usePostInteractions(post.id);

    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [locationModal, setLocationModal] = useState(false);
    const [detailViewOpen, setDetailViewOpen] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const setActiveSidebarItem = useUiStore((state) => state.setActiveSidebarItem);
    const setActiveProfileView = useUiStore((state) => state.setActiveProfileView);
    const deletePost = useUiStore(state => state.deletePost);
    const currentUser = useAuthStore((state) => state.user);

    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState('');
    const [isCommentsLoading, setIsCommentsLoading] = useState(false);
    const [commentError, setCommentError] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const [hasCommentsFetched, setHasCommentsFetched] = useState(false);
    const [showAiInsights, setShowAiInsights] = useState(false);

    const {
        id: postId,
        userDisplayName,
        userProfilePicUrl,
        description,
        type,
        files,
        location,
        year,
        commentsCount: actualCommentsCount,
        userId,
        createdAt,
    } = post;

    const MAX_DESCRIPTION_LENGTH = 150;
    const shouldTruncate = description?.length > MAX_DESCRIPTION_LENGTH;

    const getDisplayedText = () => {
        if (!description) return '';
        if (!shouldTruncate || isDescriptionExpanded) {
            return description;
        }
        return description.substring(0, MAX_DESCRIPTION_LENGTH) + '...';
    };

    const formatFirebaseTimestamp = (firebaseTimestamp) => {
        if (!firebaseTimestamp || typeof firebaseTimestamp._seconds !== 'number') {
            return 'Invalid Date';
        }
        const date = new Date(firebaseTimestamp._seconds * 1000 + firebaseTimestamp._nanoseconds / 1000000);
        const now = new Date();
        if (isToday(date)) {
            return formatDistanceToNowStrict(date, { addSuffix: true });
        } else if (isYesterday(date)) {
            return `Yesterday at ${format(date, 'h:mm a')}`;
        } else if (Math.abs(date.getTime() - now.getTime()) < 7 * 24 * 60 * 60 * 1000) {
            return format(date, 'EEEE \'at\' h:mm a');
        } else {
            return format(date, 'MMM dd, yyyy');
        }
    };

    const handleNameClick = (userId) => {
        setActiveSidebarItem('Profile')
        setActiveProfileView(userId)
    }

    const handleDeleteClick = async () => {
        await deletePost(postId);
    };

    // Helper function to safely render year data
    const formatYear = (yearData) => {
        if (!yearData) return null;
        return yearData[0]

    };

    const renderMedia = () => {
        if (!files || files.length === 0) {
            return null;
        }

        const firstFile = files[0];

        if (type === 'photo' || type === 'document' || type === 'item') {
            return (
                <div className="flex justify-center px-4 sm:px-6">
                    {/* This is the "polaroid" wrapper for the image */}
                    <div className="relative bg-white p-4 shadow-xl border border-gray-200 max-w-full z-10">
                        {formatYear(year) && imageLoaded && (
                            <div className="absolute bottom-2 right-2 text-gray-700 text-xs italic bg-white/80 px-3 py-1 rounded-md shadow-sm border border-gray-200 z-20 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in-0">
                                {formatYear(year)}
                            </div>

                        )}
                        <img
                            src={firstFile}
                            alt="Post media"
                            className="w-full max-h-[400px] object-contain"
                            onLoad={() => setImageLoaded(true)}
                            onError={() => setImageLoaded(false)}
                        />
                        {/* Empty space at bottom for polaroid effect */}
                        <div className="h-10"></div>
                    </div>
                </div>
            );
        }

        if (type === 'video') {
            return (
                <div className="relative w-full">
                    <video
                        controls
                        src={firstFile}
                        className="max-h-96 w-full"
                        onLoadedData={() => setImageLoaded(true)}
                        onError={() => setImageLoaded(false)}
                    />
                    {year && imageLoaded && (
                        <div className="absolute bottom-12 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold backdrop-blur border border-white/20 transition-opacity duration-300 animate-in fade-in-0">
                            {formatYear(year)}
                        </div>
                    )}
                </div>
            );
        }

        return null;
    };

    const fetchComments = useCallback(async () => {
        setIsCommentsLoading(true);
        setCommentError(null);
        try {
            const result = await callApiGateway({
                action: 'getComments',
                payload: { postId }
            });
            const processedComments = result.data.comments.map(comment => ({
                ...comment,
                createdAt: comment.createdAt?.toDate ? comment.createdAt.toDate() : comment.createdAt
            }));
            setComments(processedComments);
            setHasCommentsFetched(true);
        } catch (err) {
            console.error("Error fetching comments:", err);
            setCommentError("Failed to load comments due to an unexpected error.");
        } finally {
            setIsCommentsLoading(false);
        }
    }, [postId]);

    const handleAddComment = async () => {
        if (!newCommentText.trim() || !currentUser) {
            setCommentError("Comment cannot be empty and you must be logged in.");
            return;
        }

        try {
            await callApiGateway({
                action: 'addComment',
                payload: {
                    postId,
                    text: newCommentText.trim()
                }
            });
            setNewCommentText('');
            setCommentError(null);
            fetchComments();
        } catch (err) {
            console.error("Error adding comment:", err);
            setCommentError("Failed to add comment.");
        }
    };

    const handleToggleComments = () => {
        if (!showComments && !hasCommentsFetched) {
            fetchComments();
        }
        setShowComments(!showComments);
    };

    return (
        <>
            <Card className="w-[360px] md:w-[500px] rounded-lg shadow-lg">
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={userProfilePicUrl || ''} />
                        <AvatarFallback>{userDisplayName ? userDisplayName.charAt(0) : 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 ml-3">
                        <button
                            onClick={() => handleNameClick(userId)}
                            className="text-sm font-semibold hover:underline text-left"
                        >
                            {userDisplayName || 'Anonymous User'}
                        </button>
                        <p className="text-xs text-muted-foreground">
                            {formatFirebaseTimestamp(createdAt)}
                        </p>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        {currentUser?.uid && userId === currentUser.uid && (
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleDeleteClick}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Post
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        )}
                    </DropdownMenu>
                </CardHeader>

                <div
                    className="cursor-pointer"
                    onClick={() => setDetailViewOpen(true)}
                    onKeyDown={(e) => {
                        if (e.key === ' ') {
                            setDetailViewOpen(true)
                        }
                    }}
                    tabIndex={0}
                >
                    {renderMedia()}
                </div>

                <CardContent className="pt-4">
                    <div className="flex items-start gap-2 mb-2">
                        <p className="text-sm flex-1 whitespace-pre-wrap">
                            {getDisplayedText()}
                        </p>

                        {post.AiMetadata && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowAiInsights(!showAiInsights)}
                                className={`p-1 transition-all ${showAiInsights ? 'text-foreground' : 'text-blue-600 hover:scale-110'}`}
                            >
                                <Sparkles className="h-5 w-5" />
                            </Button>
                        )}
                    </div>

                    {shouldTruncate && (
                        <Button
                            variant="link"
                            size="sm"
                            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                            className="p-0 h-auto text-xs mb-4"
                        >
                            {isDescriptionExpanded ? 'Read less' : 'Read more'}
                        </Button>
                    )}

                    {/* AI Insights Panel */}
                    {post.AiMetadata && showAiInsights && (
                        <div className="mt-4 mb-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-2 mb-3 opacity-80">
                                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                                <span className="text-xs text-blue-600 font-medium uppercase tracking-wider">
                                    AI Analysis
                                </span>
                            </div>

                            {post.AiMetadata.description && (
                                <div className="mb-4">
                                    <p className="text-sm italic text-muted-foreground leading-relaxed">
                                        "{post.AiMetadata.description}"
                                    </p>
                                </div>
                            )}

                            {post.AiMetadata.cultural_context && (
                                <div className="mb-3">
                                    <p className="text-xs text-muted-foreground font-medium mb-1">
                                        Cultural Context
                                    </p>
                                    <p className="text-xs text-foreground">
                                        {post.AiMetadata.cultural_context}
                                    </p>
                                </div>
                            )}

                            {post.AiMetadata.people_identified && post.AiMetadata.people_identified.length > 0 && (
                                <div className="mb-3">
                                    <p className="text-xs text-muted-foreground font-medium mb-1">
                                        People Identified
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                        {post.AiMetadata.people_identified.map((person, index) => (
                                            <Badge
                                                key={index}
                                                variant="outline"
                                                className="text-xs h-5 border-blue-300 text-blue-600"
                                            >
                                                {person}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {post.AiMetadata.location && post.AiMetadata.location !== 'Unknown location' && (
                                <div className="mb-3">
                                    <p className="text-xs text-muted-foreground font-medium mb-1">
                                        AI-Detected Location
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-3.5 w-3.5 text-blue-600" />
                                        {post.AiMetadata?.location ? (
                                            <div className="flex flex-wrap gap-1">
                                                {post.AiMetadata.location
                                                    .split(',')
                                                    .map(loc => loc.trim())
                                                    .filter(Boolean)
                                                    .map((loc, i) => (
                                                        <Badge key={i} variant="outline" className="text-xs">
                                                            {loc}
                                                        </Badge>
                                                    ))}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            )}

                            {post.AiMetadata.date_estimate && post.AiMetadata.date_estimate !== 'Unknown period' && (
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium mb-1">
                                        Estimated Period
                                    </p>
                                    <p className="text-xs text-foreground">
                                        {post.AiMetadata.date_estimate}
                                        {post.AiMetadata.date_confidence && post.AiMetadata.date_confidence !== 'unknown' && (
                                            <span className="text-muted-foreground ml-1">
                                                ({post.AiMetadata.date_confidence})
                                            </span>
                                        )}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="pb-2 flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleLikeToggle}
                                className={`h-8 w-8 ${liked ? 'text-red-500' : ''}`}
                                disabled={isLikeUpdating}
                            >
                                <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
                            </Button>
                            <span className="text-sm">{likesCount}</span>
                        </div>

                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleToggleComments}
                                className="h-8 w-8"
                            >
                                <MessageCircle className="h-5 w-5" />
                            </Button>
                            <span className="text-sm">{actualCommentsCount}</span>
                        </div>

                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleBookmarkToggle}
                                className={`h-8 w-8 ${bookmarked ? 'text-blue-600' : ''}`}
                                disabled={isBookmarkUpdating}
                            >
                                <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-current' : ''}`} />
                            </Button>
                            <span className="text-sm">{bookmarksCount}</span>
                        </div>

                        {location && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setLocationModal(true)}
                                className="h-8 w-8"
                            >
                                <MapPin className="h-5 w-5" />
                            </Button>
                        )}
                    </div>

                    <div
                        className={`
                            border-t 
                            transition-all duration-300 ease-in-out overflow-hidden
                            ${showComments ? 'max-h-[500px] opacity-100 pt-4' : 'max-h-0 opacity-0'}
                        `}
                    >
                        <h4 className="font-semibold mb-4">Comments</h4>
                            {isCommentsLoading && (
                                <p className="text-sm text-muted-foreground">Loading comments...</p>
                            )}
                            {commentError && (
                                <p className="text-sm text-destructive">{commentError}</p>
                            )}
                            {!isCommentsLoading && !commentError && comments.length === 0 && (
                                <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
                            )}
                            <div className="max-h-48 overflow-y-auto mb-4 space-y-3">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="flex gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={comment.userProfilePicUrl || ''} />
                                            <AvatarFallback>{comment.userDisplayName?.charAt(0) || 'U'}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <button
                                                onClick={() => handleNameClick(comment.userId)}
                                                className="text-sm font-semibold hover:underline"
                                            >
                                                {comment.userDisplayName || 'Anonymous'}
                                            </button>
                                            <p className="text-sm text-foreground mt-1">{comment.text}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {formatFirebaseTimestamp(comment.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {currentUser && (
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add a comment..."
                                        value={newCommentText}
                                        onChange={(e) => setNewCommentText(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleAddComment();
                                            }
                                        }}
                                        className="flex-1"
                                    />
                                    <Button
                                        size="icon"
                                        onClick={handleAddComment}
                                        disabled={!newCommentText.trim()}
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                </CardContent>
            </Card>

            {/* Location Modal */}
            <Dialog open={locationModal} onOpenChange={setLocationModal}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Post Location</DialogTitle>
                    </DialogHeader>
                    <PostMap center={{lat: location?._latitude, lng: location?._longitude}}/>
                </DialogContent>
            </Dialog>

            {/* Detail View */}
            {detailViewOpen && (
                <PostDetailView
                    post={post}
                    open={detailViewOpen}
                    onClose={() => setDetailViewOpen(false)}
                />
            )}
        </>
    );
}

export default PostCard;