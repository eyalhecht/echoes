import React, { useState, useCallback, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    Dialog as LocationDialog,
    DialogContent as LocationDialogContent,
    DialogHeader as LocationDialogHeader,
    DialogTitle as LocationDialogTitle,
} from "@/components/ui/dialog";
import {
    Heart,
    Bookmark,
    Send,
    X,
    Sparkles,
    MapPin,
    MessageCircle,
} from 'lucide-react';
import { format } from 'date-fns'; // Still used for format Firebase Timestamp
import { usePostInteractions } from '../hooks/usePostInteractions';
import { callApiGateway } from '../firebaseConfig.js';
import { useAuthStore } from '../stores/useAuthStore.js';
import useUiStore from '../stores/useUiStore.js';
import {formatFirebaseTimestamp} from "./utils.js";
import PostMap from "./PostMap.jsx";
import StreetViewDisplay from "@/components/StreetViewDisplay.jsx";

const PostDetailView = ({ post, open, onClose }) => {
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

    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [isCommentsLoading, setIsCommentsLoading] = useState(false);
    const [commentError, setCommentError] = useState(null);
    const [hasCommentsFetched, setHasCommentsFetched] = useState(false);
    const [showAiInsights, setShowAiInsights] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [locationModal, setLocationModal] = useState(false);
    const [showMapInModal, setShowMapInModal] = useState(true);
    
    const currentUser = useAuthStore((state) => state.user);
    const setActiveSidebarItem = useUiStore((state) => state.setActiveSidebarItem);
    const setActiveProfileView = useUiStore((state) => state.setActiveProfileView);

    if (!post) return null;

    const {
        userDisplayName,
        userProfilePicUrl,
        description,
        type,
        files,
        year,
        location,
        createdAt,
        commentsCount,
    } = post;

    const fetchComments = useCallback(async () => {
        setIsCommentsLoading(true);
        setCommentError(null);
        try {
            const result = await callApiGateway({
                action: 'getComments',
                payload: {
                    postId: post.id
                }
            });
            const processedComments = result.data.comments.map(comment => ({
                ...comment,
                createdAt: comment.createdAt?.toDate ? comment.createdAt.toDate() : comment.createdAt
            }));
            setComments(processedComments);
            setHasCommentsFetched(true);
        } catch (err) {
            console.error("Error fetching comments via Cloud Function:", err);
            if (err.code && err.message) {
                setCommentError(`Failed to load comments: ${err.message}`);
            } else {
                setCommentError("Failed to load comments due to an unexpected error.");
            }
        } finally {
            setIsCommentsLoading(false);
        }
    }, [post.id]);

    const handleAddComment = async () => {
        if (!comment.trim() || !currentUser) {
            setCommentError("Comment cannot be empty and you must be logged in.");
            return;
        }

        try {
            await callApiGateway({
                action: 'addComment',
                payload: {
                    postId: post.id,
                    text: comment.trim()
                }
            });
            setComment('');
            setCommentError(null);
            fetchComments();
        } catch (err) {
            console.error("Error adding comment:", err);
            setCommentError("Failed to add comment.");
        }
    };

    const handleNameClick = (userId) => {
        setActiveSidebarItem('Profile');
        setActiveProfileView(userId);
    };

    useEffect(() => {
        if (open && post && !hasCommentsFetched) {
            fetchComments();
        }
    }, [open, post, hasCommentsFetched, fetchComments]);

    const handleCommentSubmit = () => {
        handleAddComment();
    };

    const formatYear = (yearData) => {
        if (!yearData) return null;
        return yearData[0];
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="p-1 max-w-none w-[90vw] h-[90vh] flex flex-col md:flex-row"
                onPointerDownOutside={(e) => e.preventDefault()}
            >
                {/* Custom Close Button - Mobile Only */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="absolute right-2 top-2 z-50 bg-background/80 hover:bg-background border border-border/50 backdrop-blur-sm md:hidden"
                >
                    <X className="h-4 w-4" />
                </Button>

                <div className="flex flex-col md:flex-row h-full w-full relative">
                    {files && files[0] && (
                        <div className="flex-shrink-0 bg-black flex justify-center items-center rounded h-1/2 md:h-full md:flex-1 relative">
                            {type === 'photo' || type === 'document' || type === 'item' ? (
                                <div className="relative max-h-full max-w-full">
                                    {formatYear(year) && imageLoaded && (
                                        <div className="absolute bottom-2 right-2 text-gray-700 text-xs italic bg-white/80 px-3 py-1 rounded-md shadow-sm border border-gray-200 z-20 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in-0">
                                            {formatYear(year)}
                                        </div>
                                    )}
                                    <img
                                        src={files[0]}
                                        alt="Post media"
                                        className="max-h-full max-w-full w-auto h-auto object-contain"
                                        onLoad={() => setImageLoaded(true)}
                                        onError={() => setImageLoaded(false)}
                                    />
                                </div>
                            ) : type === 'video' ? (
                                <div className="relative max-h-full max-w-full">
                                    {year && imageLoaded && (
                                        <div className="absolute bottom-12 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold backdrop-blur border border-white/20 transition-opacity duration-300 animate-in fade-in-0">
                                            {formatYear(year)}
                                        </div>
                                    )}
                                    <video
                                        controls
                                        src={files[0]}
                                        className="max-h-full max-w-full w-auto h-auto"
                                        onLoadedData={() => setImageLoaded(true)}
                                        onError={() => setImageLoaded(false)}
                                    />
                                </div>
                            ) : null}
                        </div>
                    )}

                    <div className={`flex flex-col overflow-auto h-1/2 md:h-full ${files && files[0] ? 'md:flex-1 md:max-w-[400px]' : 'w-full'}`}>
                        <div className="p-4 flex-grow flex flex-col"> {/* Added flex-grow to ensure content pushes input to bottom */}
                            {/* User info */}
                            <div className="flex items-center mb-4">
                                <Avatar className="mr-3 w-10 h-10">
                                    <AvatarImage src={userProfilePicUrl || ''} />
                                    <AvatarFallback>{userDisplayName?.charAt(0) || 'U'}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-base font-semibold">
                                        {userDisplayName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatFirebaseTimestamp(createdAt)}
                                    </p>
                                </div>
                            </div>

                            <p className="text-sm mb-4 whitespace-pre-wrap">
                                {description}
                            </p>

                            {/* AI Insights Panel */}
                            {post.AiMetadata && (
                                <div className="mb-4">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowAiInsights(!showAiInsights)}
                                        className={`mb-3 transition-all ${showAiInsights ? 'text-foreground' : 'text-blue-600'}`}
                                    >
                                        <Sparkles className="h-4 w-4 mr-2" />
                                        AI Analysis
                                    </Button>

                                    {showAiInsights && (
                                        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
                                            <div className="flex items-center gap-2 mb-3 opacity-80">
                                                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                                                <span className="text-xs text-blue-600 font-medium uppercase tracking-wider">
                                                    AI Analysis
                                                </span>
                                            </div>

                                            {post.AiMetadata.description && (
                                                <div className="mb-4">
                                                    <div className="text-xs text-muted-foreground font-medium mb-2 opacity-80">
                                                        Historical Analysis
                                                    </div>
                                                    <p className="text-sm text-foreground leading-relaxed">
                                                        {post.AiMetadata.description}
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
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1 mb-4">
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleLikeToggle}
                                        disabled={isLikeUpdating}
                                        className="h-8 w-8"
                                    >
                                        <Heart className={`h-5 w-5 ${liked ? 'text-red-500 fill-current' : ''}`} />
                                    </Button>
                                    <span className="text-sm">{likesCount}</span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <div className="h-8 w-8 flex items-center justify-center">
                                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <span className="text-sm">{commentsCount}</span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleBookmarkToggle}
                                        disabled={isBookmarkUpdating}
                                        className="h-8 w-8"
                                    >
                                        <Bookmark className={`h-5 w-5 ${bookmarked ? 'text-blue-600 fill-current' : ''}`} />
                                    </Button>
                                    <span className="text-sm">{bookmarksCount}</span>
                                </div>

                                {location && (
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setLocationModal(true);
                                                setShowMapInModal(true);
                                            }}
                                            className="h-8 w-8"
                                        >
                                            <MapPin className="h-5 w-5" />
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <Separator className="my-4" />

                            {/* Comments Section */}
                            <p className="text-base font-semibold mb-2">
                                Comments
                            </p>

                            {isCommentsLoading && (
                                <p className="text-sm text-muted-foreground mb-4">
                                    Loading comments...
                                </p>
                            )}

                            {commentError && (
                                <p className="text-sm text-destructive mb-4">
                                    {commentError}
                                </p>
                            )}

                            {!isCommentsLoading && !commentError && comments.length === 0 && (
                                <p className="text-sm text-muted-foreground mb-4">
                                    No comments yet. Be the first to comment!
                                </p>
                            )}

                            <div className="mb-4 max-h-[300px] overflow-y-auto space-y-3">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="flex items-start gap-3">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={comment.userProfilePicUrl || ''} />
                                            <AvatarFallback>{comment.userDisplayName?.charAt(0) || 'U'}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <button
                                                onClick={() => handleNameClick(comment.userId)}
                                                className="text-sm font-semibold hover:underline text-left"
                                            >
                                                {comment.userDisplayName || 'Anonymous'}
                                            </button>
                                            <p className="text-sm text-foreground mt-1 whitespace-pre-wrap">
                                                {comment.text}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {formatFirebaseTimestamp(comment.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div> {/* End of p-4 flex-grow div */}

                        {/* Comment Input Section (sticky to bottom) */}
                        {currentUser ? (
                            <div className="p-4 border-t border-border flex items-center gap-2">
                                <Input
                                    placeholder="Add a comment..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleCommentSubmit();
                                        }
                                    }}
                                    className="flex-1"
                                />
                                <Button
                                    size="icon"
                                    onClick={handleCommentSubmit}
                                    disabled={!comment.trim()}
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="p-4 border-t border-border">
                                <p className="text-sm text-muted-foreground text-center">
                                    Please log in to add comments
                                </p>
                            </div>
                        )}
                    </div> {/* End of right panel */}
                </div>
            </DialogContent>

            <LocationDialog open={locationModal} onOpenChange={setLocationModal}>
                <LocationDialogContent className="max-w-md py-7">
                    <LocationDialogHeader className="flex flex-row justify-between items-center mb-4">
                        <LocationDialogTitle>{showMapInModal ? 'Location Map' : 'Street View'}</LocationDialogTitle>
                        {location && (
                            <div className="flex gap-2">
                                <Button
                                    variant={showMapInModal ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setShowMapInModal(true)}
                                >
                                    Map
                                </Button>
                                <Button
                                    variant={!showMapInModal ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setShowMapInModal(false)}
                                >
                                    Street View
                                </Button>
                            </div>
                        )}
                    </LocationDialogHeader>

                    {location ? (
                        <>
                            {showMapInModal ? (
                                <PostMap center={{ lat: location._latitude, lng: location._longitude }} />
                            ) : (
                                <StreetViewDisplay coords={post.location}/>
                            )}
                        </>
                    ) : (
                        <p className="text-sm text-muted-foreground">Location data not available for this post.</p>
                    )}
                </LocationDialogContent>
            </LocationDialog>
        </Dialog>
    );
};

export default PostDetailView;