import React, { useState } from 'react';
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
    CardMedia
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
    const [comments, setComments] = useState([
        {
            id: 1,
            user: 'Jane Doe',
            text: 'This is amazing!',
            timestamp: new Date(Date.now() - 3600000)
        },
        {
            id: 2,
            user: 'Jdane Doe',
            text: 'This is amazing!',
            timestamp: new Date(Date.now() - 3600000)
        }
    ]);

    if (!post) return null;

    const {
        userDisplayName,
        userProfilePicUrl,
        description,
        type,
        files,
        createdAt,
    } = post;

    const formattedTimestamp = "time here"

    const handleCommentSubmit = () => {
        if (comment.trim()) {
            setComments([...comments, {
                id: Date.now(),
                user: 'Current User',
                text: comment,
                timestamp: new Date()
            }]);
            setComment('');
        }
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
                                        {formattedTimestamp}
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
                        <List sx={{ mb: 2 }}>
                            {comments.map((comment) => (
                                <ListItem key={comment.id} alignItems="flex-start" sx={{ px: 0 }}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ width: 32, height: 32 }}>
                                            {comment.user.charAt(0)}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={comment.user}
                                        secondary={
                                            <>
                                                {comment.text}
                                                <Typography variant="caption" display="block">
                                                    {format(comment.timestamp, 'MMM d, h:mm a')}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>

                            {/* Comment input */}
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
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default PostDetailView;