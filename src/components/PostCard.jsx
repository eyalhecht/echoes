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
    Collapse,
    Chip
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
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
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
    const [showAiInsights, setShowAiInsights] = useState(false); // Controls AI insights panel

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
            return null;
        }

        const firstFile = files[0];

        if (type === 'photo' || type === 'document' || type === 'item') {
            return (
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    paddingInline: "10px"
                }}>
                    <Box sx={{
                        backgroundColor: 'white',
                        padding: '20px 20px 80px 20px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.45)',
                        width: '100%'
                    }}>
                        <Box sx={{ position: 'relative' }}>
                            <CardMedia
                                component="img"
                                image={firstFile}
                                alt="Post media"
                                sx={{ 
                                    width: '100%',
                                    maxHeight:500,
                                    objectFit: 'cover'
                                }}
                            />
                            {year && year.length > 0 && (
                                <Box sx={{
                                    position: 'absolute',
                                    bottom: -50, // Position in the white Polaroid footer
                                    right: 10,
                                    color: '#666',
                                    fontSize: '12px',
                                    fontFamily: 'serif',
                                    fontStyle: 'italic'
                                }}>
                                    {year.join(', ')}
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>
            );
        }

        // Keep video as original
        if (type === 'video') {
            return (
                <Box sx={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                    <CardMedia
                        component="video"
                        controls
                        src={firstFile}
                        sx={{ maxHeight: 400, width: '100%' }}
                    />
                    {year && year.length > 0 && (
                        <Box sx={{
                            position: 'absolute',
                            bottom: 48, // Higher up to avoid video controls
                            right: 8,
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            backdropFilter: 'blur(4px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                            {year.join(', ')}
                        </Box>
                    )}
                </Box>
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
            maxWidth: 500,
            borderRadius: '5px',
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
                sx={{ cursor: 'pointer' }}
            >
            {renderMedia()}
            </Box>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: shouldTruncate ? 1 : 2 }}>
                    <Typography
                        variant="body1"
                        color="text.primary"
                        sx={{
                            flex: 1,
                            whiteSpace: 'pre-wrap' // Preserve line breaks
                        }}
                    >
                        {getDisplayedText()}
                    </Typography>
                    
                    {post.AiMetadata && (
                        <IconButton 
                            size="large"
                            onClick={() => setShowAiInsights(!showAiInsights)}
                            sx={{
                                color: showAiInsights ? 'black' : '#1976d2',
                                padding: '4px',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    color: '#1976d2',
                                    transform: 'scale(1.3)'
                                }
                            }}
                            aria-label="AI insights"
                        >
                            <AutoAwesomeIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                    )}
                </Box>

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

                {/* AI Insights Panel */}
                {post.AiMetadata && (
                    <Collapse in={showAiInsights}>
                        <Box sx={{
                            mt: 2,
                            mb: 2,
                            p: 2,
                            bgcolor: 'rgba(25, 118, 210, 0.04)',
                            borderRadius: '12px',
                            border: '1px solid rgba(25, 118, 210, 0.12)',
                            position: 'relative'
                        }}>
                            {/* AI Badge */}
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1, 
                                mb: 1.5,
                                opacity: 0.8
                            }}>
                                <AutoAwesomeIcon sx={{ fontSize: 14, color: '#1976d2' }} />
                                <Typography variant="caption" sx={{ 
                                    color: '#1976d2', 
                                    fontWeight: 'medium',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    AI Analysis
                                </Typography>
                            </Box>

                            {/* AI Description */}
                            {post.AiMetadata.description && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" sx={{ 
                                        fontStyle: 'italic',
                                        color: 'text.secondary',
                                        lineHeight: 1.5
                                    }}>
                                        "{post.AiMetadata.description}"
                                    </Typography>
                                </Box>
                            )}

                            {/* Cultural Context */}
                            {post.AiMetadata.cultural_context && (
                                <Box sx={{ mb: 1.5 }}>
                                    <Typography variant="caption" sx={{ 
                                        color: 'text.secondary',
                                        fontWeight: 'medium',
                                        display: 'block',
                                        mb: 0.5
                                    }}>
                                        Cultural Context
                                    </Typography>
                                    <Typography variant="body2" sx={{ 
                                        color: 'text.primary',
                                        fontSize: '13px'
                                    }}>
                                        {post.AiMetadata.cultural_context}
                                    </Typography>
                                </Box>
                            )}

                            {/* People Identified */}
                            {post.AiMetadata.people_identified && post.AiMetadata.people_identified.length > 0 && (
                                <Box sx={{ mb: 1.5 }}>
                                    <Typography variant="caption" sx={{ 
                                        color: 'text.secondary',
                                        fontWeight: 'medium',
                                        display: 'block',
                                        mb: 0.5
                                    }}>
                                        People Identified
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {post.AiMetadata.people_identified.map((person, index) => (
                                            <Chip
                                                key={index}
                                                label={person}
                                                size="small"
                                                variant="outlined"
                                                sx={{
                                                    fontSize: '11px',
                                                    height: '20px',
                                                    borderColor: 'rgba(25, 118, 210, 0.3)',
                                                    color: '#1976d2'
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            )}

                            {/* AI-Detected Location */}
                            {post.AiMetadata.location && post.AiMetadata.location !== 'Unknown location' && (
                                <Box sx={{ mb: 1.5 }}>
                                    <Typography variant="caption" sx={{
                                        color: 'text.secondary',
                                        fontWeight: 'medium',
                                        display: 'block',
                                        mb: 0.5
                                    }}>
                                        AI-Detected Location
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocationOnIcon sx={{ fontSize: 14, color: '#1976d2' }} />
                                        <Typography variant="body2" sx={{
                                            color: 'text.primary',
                                            fontSize: '13px'
                                        }}>
                                            {post.AiMetadata.location_confidence && post.AiMetadata.location_confidence !== 'unknown' && (
                                                <Typography component="span" sx={{
                                                    color: 'text.secondary',
                                                    fontSize: '12px',
                                                    ml: 1
                                                }}>
                                                    {post.AiMetadata.location}
                                                </Typography>
                                            )}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}

                            {/* Time Period */}
                            {post.AiMetadata.date_estimate && post.AiMetadata.date_estimate !== 'Unknown period' && (
                                <Box>
                                    <Typography variant="caption" sx={{ 
                                        color: 'text.secondary',
                                        fontWeight: 'medium',
                                        display: 'block',
                                        mb: 0.5
                                    }}>
                                        Estimated Period
                                    </Typography>
                                    <Typography variant="body2" sx={{ 
                                        color: 'text.primary',
                                        fontSize: '13px'
                                    }}>
                                        {post.AiMetadata.date_estimate}
                                        {post.AiMetadata.date_confidence && post.AiMetadata.date_confidence !== 'unknown' && (
                                            <Typography component="span" sx={{ 
                                                color: 'text.secondary',
                                                fontSize: '12px',
                                                ml: 1
                                            }}>
                                                ({post.AiMetadata.date_confidence})
                                            </Typography>
                                        )}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Collapse>
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