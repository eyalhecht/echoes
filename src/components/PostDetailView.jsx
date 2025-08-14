import React, { useState, useCallback, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    Heart,
    Bookmark,
    Send,
} from 'lucide-react';
import { format } from 'date-fns'; // Still used for format Firebase Timestamp
import { usePostInteractions } from '../hooks/usePostInteractions';
import { callApiGateway } from '../firebaseConfig.js';
import { useAuthStore } from '../stores/useAuthStore.js';
import useUiStore from '../stores/useUiStore.js';
import {formatFirebaseTimestamp} from "./utils.js";

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
        createdAt,
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

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="p-1 max-w-none w-[90vw] h-[90vh] flex flex-col md:flex-row"
                onPointerDownOutside={(e) => e.preventDefault()}
            >
                <div className="flex flex-col md:flex-row h-full w-full relative">
                    {files && files[0] && (
                        <div className="flex-shrink-0 bg-black flex justify-center items-center rounded h-1/2 md:h-full md:flex-1">
                            {type === 'photo' && (
                                <img
                                    src={files[0]}
                                    alt="Post media"
                                    className="max-h-full max-w-full w-auto h-auto object-contain"
                                />
                            )}
                            {type === 'video' && (
                                <video
                                    controls
                                    src={files[0]}
                                    className="max-h-full max-w-full w-auto h-auto"
                                />
                            )}
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

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1 mb-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleLikeToggle}
                                    disabled={isLikeUpdating}
                                >
                                    {liked ? <Heart className="h-5 w-5 text-red-500 fill-red-500" /> : <Heart className="h-5 w-5" />}
                                </Button>
                                <span className="text-sm">{likesCount}</span>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleBookmarkToggle}
                                    disabled={isBookmarkUpdating}
                                >
                                    {bookmarked ? <Bookmark className="h-5 w-5 text-blue-600 fill-blue-600" /> : <Bookmark className="h-5 w-5" />}
                                </Button>
                                <span className="text-sm">{bookmarksCount}</span>
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
        </Dialog>
    );
};

export default PostDetailView;