import React, { useState } from 'react';
import {
    Box,
    Typography,
    Avatar,
    Card,
    CardContent,
    Button,
    ButtonBase,
    IconButton
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { formatDistanceToNowStrict, isToday, isYesterday, format } from 'date-fns';
import PostDetailView from './PostDetailView.jsx';
import useUiStore from "../stores/useUiStore.js";
import { usePostInteractions } from '../hooks/usePostInteractions';

const MapPostCard = ({ 
    post, 
    isSelected = false, 
    onCardClick, 
    onCardHover, 
    onCardLeave 
}) => {
    const [detailViewOpen, setDetailViewOpen] = useState(false);
    const setActiveSidebarItem = useUiStore((state) => state.setActiveSidebarItem);
    const setActiveProfileView = useUiStore((state) => state.setActiveProfileView);

    const {
        liked,
        likesCount,
        bookmarked,
        bookmarksCount,
        handleLikeToggle,
        handleBookmarkToggle
    } = usePostInteractions(post.id);

    const {
        id: postId,
        userDisplayName,
        userProfilePicUrl,
        description,
        files,
        userId,
        createdAt,
        distanceKm,
        commentsCount
    } = post;

    const formatFirebaseTimestamp = (firebaseTimestamp) => {
        if (!firebaseTimestamp || typeof firebaseTimestamp._seconds !== 'number') {
            return 'Invalid Date';
        }
        const date = new Date(firebaseTimestamp._seconds * 1000 + firebaseTimestamp._nanoseconds / 1000000);
        const now = new Date();
        if (isToday(date)) {
            return formatDistanceToNowStrict(date, { addSuffix: true });
        } else if (isYesterday(date)) {
            return `Yesterday`;
        } else if (Math.abs(date.getTime() - now.getTime()) < 7 * 24 * 60 * 60 * 1000) {
            return format(date, 'EEE'); // E.g., "Mon"
        } else {
            return format(date, 'MMM dd'); // E.g., "Jul 15"
        }
    };

    const handleNameClick = (e) => {
        e.stopPropagation();
        setActiveSidebarItem('Profile');
        setActiveProfileView(userId);
    };

    const handleCardClick = () => {
        // Open PostDetailView when card is clicked
        setDetailViewOpen(true);
        
        // Also trigger map interaction if provided
        if (onCardClick) {
            onCardClick(post);
        }
    };

    const truncateText = (text, maxLength = 100) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <>
            <Card
                sx={{
                    width: '100%',
                    height: 180,
                    cursor: 'pointer',
                    mb: 2,
                    borderRadius: '12px',
                    boxShadow: isSelected ? '0 4px 16px rgba(25, 118, 210, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                    border: isSelected ? '2px solid #1976d2' : '1px solid #e0e0e0',
                    transition: 'all 0.2s ease',
                    backgroundColor: isSelected ? '#f3f8ff' : 'white',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        transform: 'translateY(-1px)',
                    }
                }}
                onClick={handleCardClick}
                onMouseEnter={() => onCardHover && onCardHover(post)}
                onMouseLeave={() => onCardLeave && onCardLeave()}
            >
                <CardContent sx={{ p: 2, height: '100%', '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', height: '100%', gap: 2 }}>
                        {/* Image */}
                        <Box
                            sx={{
                                width: 120,
                                height: 120,
                                borderRadius: '8px',
                                overflow: 'hidden',
                                flexShrink: 0,
                                backgroundColor: '#f5f5f5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {files && files[0] ? (
                                <img
                                    src={files[0]}
                                    alt="Post preview"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No image
                                </Typography>
                            )}
                        </Box>

                        {/* Content */}
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                            {/* Header with user info */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                <Avatar
                                    src={userProfilePicUrl || ''}
                                    alt={userDisplayName ? userDisplayName.charAt(0) : 'U'}
                                    sx={{ width: 32, height: 32 }}
                                />
                                <ButtonBase
                                    onClick={handleNameClick}
                                    sx={{
                                        padding: 0,
                                        justifyContent: 'flex-start',
                                        minWidth: 0,
                                        flex: 1,
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                        }
                                    }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight="600"
                                        sx={{
                                            cursor: 'pointer',
                                            color: 'inherit',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            fontSize: '16px'
                                        }}
                                    >
                                        {userDisplayName || 'Anonymous User'}
                                    </Typography>
                                </ButtonBase>
                            </Box>

                            {/* Description */}
                            <Typography
                                variant="body1"
                                color="text.primary"
                                sx={{
                                    mb: 1.5,
                                    flex: 1,
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    lineHeight: 1.4,
                                    fontSize: '14px'
                                }}
                            >
                                {truncateText(description, 100)}
                            </Typography>

                            {/* Interactions Row */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                {/* Like */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <IconButton
                                        size="medium"
                                        sx={{ p: 0.5 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleLikeToggle();
                                        }}
                                    >
                                        {liked ? (
                                            <FavoriteIcon sx={{ fontSize: 20, color: 'red' }} />
                                        ) : (
                                            <FavoriteBorderIcon sx={{ fontSize: 20 }} />
                                        )}
                                    </IconButton>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px', fontWeight: 500 }}>
                                        {likesCount}
                                    </Typography>
                                </Box>

                                {/* Comments */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <ChatBubbleOutlineIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px', fontWeight: 500 }}>
                                        {commentsCount || 0}
                                    </Typography>
                                </Box>

                                {/* Bookmark */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <IconButton
                                        size="medium"
                                        sx={{ p: 0.5 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleBookmarkToggle();
                                        }}
                                    >
                                        {bookmarked ? (
                                            <BookmarkIcon sx={{ fontSize: 20, color: '#1976d2' }} />
                                        ) : (
                                            <BookmarkBorderIcon sx={{ fontSize: 20 }} />
                                        )}
                                    </IconButton>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px', fontWeight: 500 }}>
                                        {bookmarksCount}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Footer with timestamp */}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px' }}>
                                    {formatFirebaseTimestamp(createdAt)}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* PostDetailView Modal */}
            {detailViewOpen && (
                <PostDetailView
                    post={post}
                    open={detailViewOpen}
                    onClose={() => setDetailViewOpen(false)}
                />
            )}
        </>
    );
};

export default MapPostCard;