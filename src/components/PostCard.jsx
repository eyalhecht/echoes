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
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Heart,
    MessageCircle,
    Bookmark,
    MapPin,
    Trash2,
    Send,
    MoreHorizontal,
} from 'lucide-react';
import { format, formatDistanceToNowStrict, isToday, isYesterday } from 'date-fns';
import { usePostInteractions } from '../hooks/usePostInteractions';
import PostMap from "./PostMap.jsx";
import PostDetailView from "./PostDetailView.jsx";
import useUiStore from "../stores/useUiStore.js";
import { useAuthStore } from "../stores/useAuthStore.js";
import { callApiGateway } from "../firebaseConfig.js";
import NowAndThenSlider from "@/components/NowAndThenSlider.jsx";
import SharePost from "@/components/SharePost.jsx";
import Professor from "@/components/Professor.jsx";
import { useNavigate } from 'react-router-dom';

function PostCard({ post }) {
    const navigate = useNavigate();
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
    const [locationModal, setLocationModal] = useState(false); // Controls the unified location modal
    const [imageLoaded, setImageLoaded] = useState(false);
    const [polaroidWidth, setPolaroidWidth] = useState(null);
    const [modalTab, setModalTab] = useState('compare'); // 'compare' | 'map'
    const deletePost = useUiStore(state => state.deletePost);
    const currentUser = useAuthStore((state) => state.user);

    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState('');
    const [isCommentsLoading, setIsCommentsLoading] = useState(false);
    const [commentError, setCommentError] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const [hasCommentsFetched, setHasCommentsFetched] = useState(false);
    const [showFullAiDesc, setShowFullAiDesc] = useState(false);

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
        navigate(`/profile/${userId}`);
    };

    const handleDeleteClick = async () => {
        await deletePost(postId);
    };

    const formatYear = (yearData) => {
        if (!yearData) return null;
        return yearData[0];
    };

    const renderMedia = () => {
        if (!files || files.length === 0) {
            return null;
        }

        const firstFile = files[0];

        if (type === 'photo' || type === 'document' || type === 'item') {
            return (
                <div className="flex justify-center px-4 sm:px-6">
                    <div
                        className="text-left relative bg-white p-4 shadow-xl border border-gray-200"
                        style={polaroidWidth ? { width: polaroidWidth } : { maxWidth: '100%' }}
                    >
                        <div className="relative">
                            {formatYear(year) && imageLoaded && (
                                <div className="absolute bottom-2 right-2 text-gray-700 text-xs italic bg-white/80 px-3 py-1 rounded-md shadow-sm border border-gray-200 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in-0">
                                    {formatYear(year)}
                                </div>
                            )}
                            <img
                                src={firstFile}
                                alt="Post media"
                                className="block max-h-[400px] max-w-full"
                                onLoad={(e) => {
                                    setImageLoaded(true);
                                    setPolaroidWidth(e.target.offsetWidth + 32); // +32 for p-4 on both sides
                                }}
                                onError={() => setImageLoaded(false)}
                            />
                        </div>
                        <div className="pt-2 pb-1 min-h-[40px]">
                            {description && (
                                <p
                                    style={{ fontFamily: "'Kalam', cursive", fontSize: '0.95rem' }}
                                    className={`text-gray-600 leading-snug ${!isDescriptionExpanded ? 'line-clamp-2' : ''}`}
                                >
                                    {description}
                                </p>
                            )}
                        </div>
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
            <TooltipProvider>
            <Card className="w-full rounded-lg shadow-lg bg-sidebar">
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
                    {currentUser?.uid && userId === currentUser.uid && <DropdownMenu>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>More options</p>
                            </TooltipContent>
                        </Tooltip>
                        {currentUser?.uid && userId === currentUser.uid && (
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleDeleteClick}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Post
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        )}
                    </DropdownMenu>}
                </CardHeader>

                <div
                    className="cursor-pointer"
                    onClick={() => {
                        window.history.pushState({}, '', `?post=${postId}`);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === ' ') {
                            window.history.pushState({}, '', `?post=${postId}`);
                        }
                    }}
                    tabIndex={0}
                >
                    {renderMedia()}
                </div>

                <CardContent className="pt-4">

                    {(!files || files.length === 0) && description && (
                        <p className="text-sm whitespace-pre-wrap mb-2"
                           style={{ fontFamily: "'Kalam', cursive", fontSize: '1.1rem' }}>
                            {getDisplayedText()}
                        </p>
                    )}
                    {shouldTruncate && (
                        <Button
                            variant="link"
                            size="sm"
                            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                            className="p-0 h-auto text-xs mb-2"
                        >
                            {isDescriptionExpanded ? 'Read less' : 'Read more'}
                        </Button>
                    )}

                    {/* Professor's historical analysis card — always visible */}
                    {post.AiMetadata && (() => {
                        const date = post.AiMetadata.date_estimate && post.AiMetadata.date_estimate !== 'Unknown period'
                            ? post.AiMetadata.date_estimate : null;
                        const loc = post.AiMetadata.location && post.AiMetadata.location !== 'Unknown location'
                            ? (typeof post.AiMetadata.location === 'string'
                                ? post.AiMetadata.location
                                : Object.values(post.AiMetadata.location).filter(Boolean).join(', '))
                            : null;
                        const people = post.AiMetadata.people_identified?.length > 0
                            ? post.AiMetadata.people_identified : null;
                        if (!post.AiMetadata.description && !date && !loc && !people) return null;
                        return (
                            <div className="mb-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/10 border border-amber-200/70 dark:border-amber-800/30 p-2.5">
                                <div className="flex gap-2.5">
                                    <Professor size={30} className="flex-shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <span className="text-[9px] font-mono tracking-widest text-amber-700 dark:text-amber-500 uppercase block mb-1">
                                            Historical Analysis
                                        </span>
                                        {post.AiMetadata.description && (
                                            <div className="mb-2">
                                                <p className={`text-xs text-foreground leading-relaxed italic ${showFullAiDesc ? '' : 'line-clamp-3'}`}>
                                                    {post.AiMetadata.description}
                                                </p>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setShowFullAiDesc(v => !v); }}
                                                    className="text-[10px] text-amber-700 dark:text-amber-500 hover:underline mt-0.5"
                                                >
                                                    {showFullAiDesc ? 'show less' : 'show more'}
                                                </button>
                                            </div>
                                        )}
                                        {(date || loc) && (
                                            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mb-1.5">
                                                {date && (
                                                    <span className="text-[10px] text-muted-foreground">
                                                        <span className="font-medium text-foreground">{date}</span>
                                                    </span>
                                                )}
                                                {loc && (
                                                    <span className="text-[10px] text-muted-foreground truncate">
                                                        {loc}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        {people && (
                                            <div className="flex flex-wrap gap-1">
                                                {people.slice(0, 3).map((person, i) => (
                                                    <Badge
                                                        key={i}
                                                        variant="outline"
                                                        className="text-[10px] h-4 px-1.5 border-amber-300 text-amber-800 dark:border-amber-700 dark:text-amber-400"
                                                    >
                                                        {typeof person === 'object' ? person.name : person}
                                                    </Badge>
                                                ))}
                                                {people.length > 3 && (
                                                    <span className="text-[10px] text-muted-foreground self-center">
                                                        +{people.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleLikeToggle}
                                        className={`h-8 w-8 ${liked ? 'text-red-500' : ''}`}
                                        disabled={isLikeUpdating}
                                    >
                                        <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{liked ? 'Unlike' : 'Like'}</p>
                                </TooltipContent>
                            </Tooltip>
                            <span className="text-sm">{likesCount}</span>
                        </div>

                        <div className="flex items-center gap-1">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleToggleComments}
                                        className="h-8 w-8"
                                    >
                                        <MessageCircle className="h-5 w-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{showComments ? 'Hide comments' : 'Show comments'}</p>
                                </TooltipContent>
                            </Tooltip>
                            <span className="text-sm">{actualCommentsCount}</span>
                        </div>

                        <div className="flex items-center gap-1">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleBookmarkToggle}
                                        className={`h-8 w-8 ${bookmarked ? 'text-blue-600' : ''}`}
                                        disabled={isBookmarkUpdating}
                                    >
                                        <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-current' : ''}`} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{bookmarked ? 'Remove bookmark' : 'Bookmark'}</p>
                                </TooltipContent>
                            </Tooltip>
                            <span className="text-sm">{bookmarksCount}</span>
                        </div>

                        {location && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setLocationModal(true);
                                            setModalTab('compare');
                                        }}
                                        className="h-8 w-8"
                                    >
                                        <MapPin className="h-5 w-5" /> {/* Icon to open the combined modal */}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>View location</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                        <SharePost postId={postId} />
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

            <Dialog open={locationModal} onOpenChange={setLocationModal}>
                <DialogContent className="max-w-lg py-7">
                    <DialogHeader className="mb-4">
                        <div className="flex items-center justify-between">
                            <DialogTitle>Now &amp; Then</DialogTitle>
                            {location && files?.length > 0 && (
                                <div className="flex gap-2">
                                    <Button
                                        variant={modalTab === 'compare' ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setModalTab('compare')}
                                    >
                                        Now &amp; Then
                                    </Button>
                                    <Button
                                        variant={modalTab === 'map' ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setModalTab('map')}
                                    >
                                        Map
                                    </Button>
                                </div>
                            )}
                        </div>
                    </DialogHeader>

                    {location ? (
                        <>
                            {modalTab === 'compare' && files?.length > 0 ? (
                                <NowAndThenSlider
                                    imageUrl={files[0]}
                                    coords={location}
                                    height={400}
                                />
                            ) : (
                                <PostMap center={{ lat: location._latitude, lng: location._longitude }} height="400px" />
                            )}
                        </>
                    ) : (
                        <p className="text-sm text-muted-foreground">Location data not available for this post.</p>
                    )}
                </DialogContent>
            </Dialog>

            {/* Detail View */}
            </TooltipProvider>
        </>
    );
}

export default PostCard;