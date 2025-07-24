import React, { useState, useCallback } from 'react';
import {
    Box,
    Typography,
    Avatar,
    Card,
    CardHeader,
    CardContent,
    CardMedia,
    IconButton,
    Button,
    Modal,
    ButtonBase,
    Menu,
    MenuItem,
    TextField,
    List, ListItem, ListItemText, ListItemAvatar, Divider,
    Collapse
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/BookmarkBorder'; // Corrected bookmark icon
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import {format, formatDistanceToNowStrict, isToday, isYesterday} from 'date-fns';
import { usePostInteractions } from '../hooks/usePostInteractions';
import PostMap from "./PostMap.jsx";
import PostDetailView from "./PostDetailView.jsx";
import useUiStore from "../stores/useUiStore.js";
import {useAuthStore} from "../stores/useAuthStore.js";
import {callApiGateway} from "../firebaseConfig.js";

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
    const [anchorEl, setAnchorEl] = useState(null); // State for menu anchor
    const setActiveSidebarItem = useUiStore((state) => state.setActiveSidebarItem);
    const setActiveProfileView = useUiStore((state) => state.setActiveProfileView);
    const deletePost = useUiStore(state => state.deletePost);
    const currentUser = useAuthStore((state) => state.user);

    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState('');
    const [isCommentsLoading, setIsCommentsLoading] = useState(false);
    const [commentError, setCommentError] = useState(null);
    const [showComments, setShowComments] = useState(false); // Controls visibility of comments section
    const [hasCommentsFetched, setHasCommentsFetched] = useState(false); // Tracks if comments have been fetched for this post

    const {
        id: postId,
        userDisplayName,
        userProfilePicUrl,
        description,
        type,
        files, // This will be an array of URLs, or a single YouTube URL
        location,
        year,
        commentsCount: actualCommentsCount,
        userId,
        createdAt,
        // postId, userId, updatedAt are also there but not directly displayed here
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
            return format(date, 'EEEE \'at\' h:mm a'); // E.g., "Monday at 10:00 AM"
        } else {
            return format(date, 'MMM dd, yyyy'); // E.g., "Jul 15, 2025"
        }
    };

    const handleNameClick = (userId) => {
        setActiveSidebarItem('Profile')
        setActiveProfileView(userId)
    }

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDeleteClick = async () => {
        await deletePost(postId);
        handleMenuClose();
    };

    const renderMedia = () => {
        if (!files || files.length === 0) {
            return null; // No files to display
        }

        const firstFile = files[0]; // For simplicity, display the first file/URL

        switch (type) {
            case 'photo':
            case 'document': // Display documents as images for now, or you'd use an icon
            case 'item': // Similar to document, perhaps just show an image
                return <CardMedia component="img" image={firstFile} alt="Post media" sx={{ maxHeight: 400, objectFit: 'contain', margin: 'auto' }} />;
            case 'video':
                // For videos, use the <video> tag
                return (
                    <CardMedia component="video" controls src={firstFile} sx={{ maxHeight: 400, width: '100%' }} />
                );
            case 'youtube':
                // For YouTube, embed using an iframe
                // You'll need to extract the video ID from the googleusercontent.com/youtube.com/2 URL if it's not a standard youtube.com/watch?v=...
                // Assuming firstFile is the direct embed URL or extractable video ID
                // const youtubeEmbedUrl = firstFile.includes('youtube.com/embed/')
                //     ? firstFile
                //     : `https://www.youtube.com/embed/${firstFile.split('/').pop()}`; // Basic extraction

                return (
                    <CardMedia>
                        <iframe
                            width="100%"
                            height="315"
                            src={youtubeEmbedUrl}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </CardMedia>
                );
            default:
                return null;
        }
    };

    const fetchComments = useCallback(async () => {
        setIsCommentsLoading(true);
        setCommentError(null);
        try {
            const result = await callApiGateway({
                action: 'getComments',
                payload: {
                    postId
                }
            });
            const processedComments = result.data.comments.map(comment => ({
                ...comment,
                createdAt: comment.createdAt?.toDate ? comment.createdAt.toDate() : comment.createdAt
            }));
            console.log(processedComments)

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
        <Card
            sx={{
            maxWidth: 600, // Max width for a typical post card
            margin: '16px auto', // Center the card and add some vertical spacing
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            backgroundColor: 'white',
        }}>
            <CardHeader
                avatar={
                    <Avatar src={userProfilePicUrl || ''} alt={userDisplayName ? userDisplayName.charAt(0) : 'U'} />
                }
                action={
                    <>
                        <IconButton aria-label="settings" onClick={(event) => {
                            setAnchorEl(event.currentTarget);
                        }}>
                            <MoreVertIcon />
                        </IconButton>

                            {currentUser?.uid && userId === currentUser.uid && (
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                    disableScrollLock
                                >
                                <MenuItem onClick={handleDeleteClick}>
                                    <DeleteIcon sx={{ mr: 1 }} /> Delete Post
                                </MenuItem>
                                </Menu>
                            )}
                    </>
                }
                title={
                    <ButtonBase
                        onClick={() => handleNameClick(userId)}
                        sx={{
                            padding: 0,
                            justifyContent: 'flex-start',
                            '&:hover': {
                                backgroundColor: 'transparent',
                            }
                        }}
                    >
                        <Typography tabIndex={0} variant="subtitle1" fontWeight="bold"
                                    sx={{
                                        cursor: 'pointer',
                                        color: 'inherit' // Ensures the text color comes from the parent
                                    }}
                        >
                            {userDisplayName || 'Anonymous User'}
                        </Typography>
                    </ButtonBase>
                }
                subheader={
                    <>
                        <Typography variant="body2" color="text.secondary">
                            {formatFirebaseTimestamp(createdAt)}
                        </Typography>
                        {year && year.length > 0 && (
                            <Typography variant="caption" color="text.secondary">
                                Year(s): {year.join(', ')}
                            </Typography>
                        )}
                    </>
                }
            />
            <Box
                tabIndex={0}
                onKeyDown={(e)=>{
                    if (e.key === ' ') {
                        setDetailViewOpen(true)
                    }
                }}
                onClick={() => setDetailViewOpen(true)}
            >
            {renderMedia()}
            </Box>
            <CardContent>
                <Typography
                    variant="body1"
                    color="text.primary"
                    sx={{
                        marginBottom: shouldTruncate ? '8px' : '16px',
                        whiteSpace: 'pre-wrap' // Preserve line breaks
                    }}
                >
                    {getDisplayedText()}
                </Typography>

                {shouldTruncate && (
                    <Button
                        variant="text"
                        size="small"
                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                        sx={{
                            padding: 0,
                            marginBottom: '16px',
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: 'transparent',
                                textDecoration: 'underline'
                            }
                        }}
                    >
                        {isDescriptionExpanded ? 'Read less' : 'Read more'}
                    </Button>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton
                        aria-label="like"
                        onClick={handleLikeToggle}
                        sx={{
                            color: liked ? 'red' : 'inherit',
                            '&:disabled': {
                                opacity: 0.6
                            }
                        }}
                    >
                        {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                    <Typography variant="body2">{likesCount}</Typography>

                        <IconButton aria-label="comment" onClick={handleToggleComments}>
                            <ChatBubbleOutlineIcon />
                        </IconButton>
                        <Typography variant="body2">{actualCommentsCount}</Typography> {/* Using actualCommentsCount from post prop */}

                    <IconButton
                        aria-label="bookmark"
                        onClick={handleBookmarkToggle}
                        sx={{
                            color: bookmarked ? '#1976d2' : 'inherit',
                            '&:disabled': {
                                opacity: 0.6
                            }
                        }}
                    >
                        {bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                    </IconButton>
                    <Typography variant="body2">{bookmarksCount}</Typography>
                    {location && <Box>
                        <IconButton onClick={() => setLocationModal(true)} aria-label="comment">
                            <LocationOnIcon/>
                        </IconButton>
                        <Modal
                            open={locationModal}
                            onClose={() => setLocationModal(false)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 400,
                                bgcolor: 'white',
                            }}>
                                <PostMap center={{lat: location?._latitude, lng: location?._longitude}}/>

                            </Box>
                        </Modal>
                    </Box>}
                </Box>

                    <Collapse in={showComments}>
                        <Box sx={{ mt: 3, borderTop: '1px solid #eee', pt: 2 }}>
                            <Typography variant="h6" gutterBottom>Comments</Typography>
                            {isCommentsLoading && <Typography variant="body2" color="text.secondary">Loading comments...</Typography>}
                            {commentError && <Typography variant="body2" color="error">{commentError}</Typography>}

                            {!isCommentsLoading && !commentError && comments.length === 0 && (
                                <Typography variant="body2" color="text.secondary">No comments yet. Be the first to comment!</Typography>
                            )}

                            <List sx={{ maxHeight: 200, overflowY: 'auto', mb: 2 }}>
                                {comments.map((comment) => (
                                    <React.Fragment key={comment.id}>
                                        <ListItem alignItems="flex-start">
                                            <ListItemAvatar>
                                                <Avatar alt={comment.userDisplayName?.charAt(0) || 'U'} src={comment.userProfilePicUrl || ''} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                onClick={() => handleNameClick(comment.userId)}
                                                primary={
                                                    <ButtonBase
                                                        component="span"
                                                        variant="subtitle2"
                                                        color="text.primary"
                                                        fontWeight="bold"
                                                        sx={{ display: 'inline' }}
                                                    >
                                                        {comment.userDisplayName || 'Anonymous'}
                                                    </ButtonBase>
                                                }
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography
                                                            sx={{ display: 'block' }}
                                                            component="span"
                                                            variant="body2"
                                                            color="text.primary"
                                                        >
                                                            {comment.text}
                                                        </Typography>
                                                        <Typography
                                                            component="span"
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            {formatFirebaseTimestamp(comment.createdAt)}
                                                        </Typography>
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItem>
                                        <Divider variant="inset" component="li" />
                                    </React.Fragment>
                                ))}
                            </List>

                            {currentUser && (
                                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        placeholder="Add a comment..."
                                        value={newCommentText}
                                        onChange={(e) => setNewCommentText(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleAddComment();
                                            }
                                        }}
                                    />
                                    <IconButton color="primary" onClick={handleAddComment} disabled={!newCommentText.trim()}>
                                        <SendIcon />
                                    </IconButton>
                                </Box>
                            )}
                        </Box>
                    </Collapse>
            </CardContent>
        </Card>
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