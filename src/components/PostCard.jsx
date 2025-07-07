import React, { useState } from 'react';
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
    Modal
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/BookmarkBorder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { format } from 'date-fns'; // For better date formatting
import { usePostInteractions } from '../hooks/usePostInteractions'; // Import the hook
import PostMap from "./PostMap.jsx"; // Adjust path as needed

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
    } = usePostInteractions(post);

    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [locationModal, setLocationModal] = useState(false);

    const {
        id: postId,
        userDisplayName,
        userProfilePicUrl,
        description,
        type,
        files, // This will be an array of URLs, or a single YouTube URL
        location,
        year,
        commentsCount,
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

    // Format the timestamp for display
    const formattedTimestamp = "time here"

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

    return (
        <Card sx={{
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
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title={
                    <Typography variant="subtitle1" fontWeight="bold">
                        {userDisplayName || 'Anonymous User'}
                    </Typography>
                }
                subheader={
                    <>
                        <Typography variant="body2" color="text.secondary">
                            {formattedTimestamp} {location && `• ${location}`}
                        </Typography>
                        {year && year.length > 0 && (
                            <Typography variant="caption" color="text.secondary">
                                Year(s): {year.join(', ')}
                            </Typography>
                        )}
                    </>
                }
            />
            {renderMedia()}
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

                    <IconButton aria-label="comment">
                        <ChatBubbleOutlineIcon />
                    </IconButton>
                    <Typography variant="body2">{commentsCount}</Typography>

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
                    <IconButton onClick={()=> setLocationModal(true)} aria-label="comment">
                        <LocationOnIcon />
                    </IconButton>
                    <Modal
                        open={locationModal}
                        onClose={()=> setLocationModal(false)}
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
                            <PostMap center={{ lat: location?._latitude, lng: location?._longitude }}/>

                        </Box>
                    </Modal>
                </Box>
            </CardContent>
        </Card>
    );
}

export default PostCard;