import React, { useState, useCallback, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    Avatar,
    IconButton,
    TextField,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    InputAdornment,
    CardMedia,
    ButtonBase
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareIcon from '@mui/icons-material/Share';
import SendIcon from '@mui/icons-material/Send';
import { format } from 'date-fns';
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
            console.log(processedComments);

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
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xl"
            fullWidth
            PaperProps={{
                sx: { height: '90vh' }
            }}
        >
            <DialogContent sx={{ p: 0, height: '100%', overflow: 'hidden' }}>
                <Box sx={{ display: 'flex', height: '100%', position: 'relative' }}>
                    <IconButton
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            zIndex: 10,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.7)',
                            }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    {files && files[0] && (
                        <Box sx={{
                            flex: 1,
                            backgroundColor: 'black',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRight: 1,
                            borderColor: 'divider'
                        }}>
                            {type === 'photo' && (
                                <CardMedia
                                    component="img"
                                    image={files[0]}
                                    alt="Post media"
                                    sx={{
                                        maxHeight: '100%',
                                        maxWidth: '100%',
                                        width: 'auto',
                                        height: 'auto',
                                        objectFit: 'contain'
                                    }}
                                />
                            )}
                            {type === 'video' && (
                                <video
                                    controls
                                    src={files[0]}
                                    style={{
                                        maxHeight: '100%',
                                        maxWidth: '100%',
                                        width: 'auto',
                                        height: 'auto'
                                    }}
                                />
                            )}
                        </Box>
                    )}

                    <Box sx={{
                        flex: files && files[0] ? 1 : 2,
                        display: 'flex',
                        maxWidth: "400px",
                        flexDirection: 'column',
                        overflow: 'auto'
                    }}>
                        <Box sx={{ p: 2 }}>
                            {/* User info at the top of right panel */}
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar src={userProfilePicUrl} sx={{ mr: 2 }}>
                                    {userDisplayName?.charAt(0)}
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {userDisplayName}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {formatFirebaseTimestamp(createdAt)}
                                    </Typography>
                                </Box>
                            </Box>

                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {description}
                            </Typography>

                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <IconButton onClick={handleLikeToggle} disabled={isLikeUpdating}>
                                {liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                            </IconButton>
                            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                                {likesCount}
                            </Typography>
                            <IconButton onClick={handleBookmarkToggle} disabled={isBookmarkUpdating}>
                                {bookmarked ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
                            </IconButton>
                            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                                {bookmarksCount}
                            </Typography>
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        {/* Comments */}
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Comments
                        </Typography>
                        
                        {isCommentsLoading && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Loading comments...
                            </Typography>
                        )}
                        
                        {commentError && (
                            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                                {commentError}
                            </Typography>
                        )}
                        
                        {!isCommentsLoading && !commentError && comments.length === 0 && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                No comments yet. Be the first to comment!
                            </Typography>
                        )}

                        <List sx={{ mb: 2, maxHeight: 300, overflowY: 'auto' }}>
                            {comments.map((comment) => (
                                <ListItem key={comment.id} alignItems="flex-start" sx={{ px: 0 }}>
                                    <ListItemAvatar>
                                        <Avatar 
                                            src={comment.userProfilePicUrl || ''}
                                            sx={{ width: 32, height: 32 }}
                                        >
                                            {comment.userDisplayName?.charAt(0) || 'U'}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <ButtonBase
                                                onClick={() => handleNameClick(comment.userId)}
                                                sx={{
                                                    padding: 0,
                                                    justifyContent: 'flex-start',
                                                    '&:hover': {
                                                        backgroundColor: 'transparent',
                                                    }
                                                }}
                                            >
                                                <Typography 
                                                    variant="subtitle2" 
                                                    fontWeight="bold"
                                                    sx={{
                                                        cursor: 'pointer',
                                                        color: 'inherit'
                                                    }}
                                                >
                                                    {comment.userDisplayName || 'Anonymous'}
                                                </Typography>
                                            </ButtonBase>
                                        }
                                        secondary={
                                            <>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                    sx={{ display: 'block' }}
                                                >
                                                    {comment.text}
                                                </Typography>
                                                <Typography variant="caption" display="block" color="text.secondary">
                                                    {formatFirebaseTimestamp(comment.createdAt)}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>

                            {/* Comment input */}
                            {currentUser && (
                                <TextField
                                    fullWidth
                                    placeholder="Add a comment..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleCommentSubmit();
                                        }
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleCommentSubmit}
                                                    disabled={!comment.trim()}
                                                >
                                                    <SendIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}
                            
                            {!currentUser && (
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
                                    Please log in to add comments
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default PostDetailView;