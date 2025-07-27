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
                    cursor: 'pointer',
                    mb: 0,
                    borderRadius: '12px',
                    boxShadow: isSelected ? '0 4px 16px rgba(25, 118, 210, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                    border: isSelected ? '2px solid #1976d2' : '1px solid #e0e0e0',
                    transition: 'all 0.2s ease',
                    backgroundColor: isSelected ? '#f3f8ff' : 'white',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        transform: 'translateY(-1px)',
                    },
                    overflow: 'hidden'
                }}
                onClick={handleCardClick}
                onMouseEnter={() => onCardHover && onCardHover(post)}
                onMouseLeave={() => onCardLeave && onCardLeave()}
            >
                <Box
                    sx={{
                        height: 160,
                        width: '100%',
                        position: 'relative',
                        backgroundColor: '#f5f5f5',
                        overflow: 'hidden'
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
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            height: '100%',
                            color: 'text.secondary'
                        }}>
                            <Typography variant="body2">No image</Typography>
                        </Box>
                    )}
                    
                    <IconButton
                        sx={{ 
                            position: 'absolute', 
                            top: 8, 
                            right: 8,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(4px)',
                            width: 32,
                            height: 32,
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 1)',
                                transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s ease'
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleBookmarkToggle();
                        }}
                    >
                        {bookmarked ? (
                            <BookmarkIcon sx={{ fontSize: 18, color: '#1976d2' }} />
                        ) : (
                            <BookmarkBorderIcon sx={{ fontSize: 18, color: '#666' }} />
                        )}
                    </IconButton>
                </Box>

                <CardContent sx={{
                    p: 1.5,
                    '&:last-child': { pb: 1.5 }
                }}>
                    {/* User info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Avatar 
                            src={userProfilePicUrl || ''} 
                            alt={userDisplayName ? userDisplayName.charAt(0) : 'U'}
                            sx={{ width: 28, height: 28 }}
                        />
                        <ButtonBase
                            onClick={handleNameClick}
                            sx={{
                                padding: 0,
                                justifyContent: 'flex-start',
                                flex: 1,
                                textAlign: 'left',
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                }
                            }}
                        >
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography 
                                    variant="subtitle2" 
                                    fontWeight="600"
                                    sx={{
                                        cursor: 'pointer',
                                        color: 'inherit',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        fontSize: '14px',
                                        lineHeight: 1.1
                                    }}
                                >
                                    {userDisplayName || 'Anonymous User'}
                                </Typography>
                                <Typography 
                                    variant="caption" 
                                    color="text.secondary"
                                    sx={{ 
                                        fontSize: '11px',
                                        lineHeight: 1,
                                        display: 'block',
                                        mt: 0.25
                                    }}
                                >
                                    {formatFirebaseTimestamp(createdAt)}
                                </Typography>
                            </Box>
                        </ButtonBase>
                    </Box>

                    <Box sx={{ mb: 1.5 }}>
                        <Typography 
                            variant="body2" 
                            color="text.primary"
                            sx={{ 
                                fontSize: '12px',
                                lineHeight: 1.4,
                                wordWrap: 'break-word'
                            }}
                        >
                            {description || 'No description available'}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {/* Like */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <IconButton 
                                size="small"
                                sx={{ 
                                    p: 0.5,
                                    '&:hover': {
                                        transform: 'scale(1.1)',
                                        backgroundColor: liked ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                                    },
                                    transition: 'all 0.2s ease',
                                    backgroundColor: liked ? 'rgba(255, 0, 0, 0.05)' : 'transparent'
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Like button clicked for post:', post.id);
                                    handleLikeToggle();
                                }}
                            >
                                {liked ? (
                                    <FavoriteIcon sx={{ fontSize: 18, color: '#ff4757' }} />
                                ) : (
                                    <FavoriteBorderIcon sx={{ fontSize: 18, color: '#666' }} />
                                )}
                            </IconButton>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    fontSize: '13px', 
                                    fontWeight: 600, 
                                    color: liked ? '#ff4757' : 'text.primary'
                                }}
                            >
                                {likesCount || 0}
                            </Typography>
                        </Box>

                        {/* Comments */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <ChatBubbleOutlineIcon sx={{ fontSize: 18, color: '#666' }} />
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    fontSize: '13px', 
                                    fontWeight: 600, 
                                    color: 'text.primary'
                                }}
                            >
                                {commentsCount || 0}
                            </Typography>
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