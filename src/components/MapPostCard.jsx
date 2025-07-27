import React, { useState } from 'react';
import {
    Box,
    Typography,
    Avatar,
    Card,
    CardContent,
    Button,
    Modal,
    ButtonBase,
    IconButton
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { formatDistanceToNowStrict, isToday, isYesterday, format } from 'date-fns';
import PostCard from './PostCard.jsx';
import useUiStore from "../stores/useUiStore.js";
import { usePostInteractions } from '../hooks/usePostInteractions';

const MapPostCard = ({ 
    post, 
    isSelected = false, 
    onCardClick, 
    onCardHover, 
    onCardLeave 
}) => {
    const [fullPostOpen, setFullPostOpen] = useState(false);
    const setActiveSidebarItem = useUiStore((state) => state.setActiveSidebarItem);
    const setActiveProfileView = useUiStore((state) => state.setActiveProfileView);

    const {
        liked,
        likesCount,
    } = usePostInteractions(post.id);

    const {
        id: postId,
        userDisplayName,
        userProfilePicUrl,
        description,
        files,
        userId,
        createdAt,
        distanceKm
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
        if (onCardClick) {
            onCardClick(post);
        }
    };

    const truncateText = (text, maxLength = 80) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <>
            <Card
                sx={{
                    width: '100%',
                    height: 140,
                    cursor: 'pointer',
                    mb: 1,
                    borderRadius: '8px',
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
                <CardContent sx={{ p: 1.5, height: '100%', '&:last-child': { pb: 1.5 } }}>
                    <Box sx={{ display: 'flex', height: '100%', gap: 1.5 }}>
                        {/* Image */}
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '6px',
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
                                <Typography variant="caption" color="text.secondary">
                                    No image
                                </Typography>
                            )}
                        </Box>

                        {/* Content */}
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                            {/* Header */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Avatar 
                                    src={userProfilePicUrl || ''} 
                                    alt={userDisplayName ? userDisplayName.charAt(0) : 'U'}
                                    sx={{ width: 24, height: 24 }}
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
                                        variant="subtitle2" 
                                        fontWeight="bold"
                                        sx={{
                                            cursor: 'pointer',
                                            color: 'inherit',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {userDisplayName || 'Anonymous User'}
                                    </Typography>
                                </ButtonBase>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <IconButton size="small" sx={{ p: 0.5 }}>
                                        {liked ? (
                                            <FavoriteIcon sx={{ fontSize: 16, color: 'red' }} />
                                        ) : (
                                            <FavoriteBorderIcon sx={{ fontSize: 16 }} />
                                        )}
                                    </IconButton>
                                    <Typography variant="caption" color="text.secondary">
                                        {likesCount}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Description */}
                            <Typography 
                                variant="body2" 
                                color="text.primary"
                                sx={{ 
                                    mb: 0.5,
                                    flex: 1,
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    lineHeight: 1.3
                                }}
                            >
                                {truncateText(description)}
                            </Typography>

                            {/* Footer */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="caption" color="text.secondary">
                                    📍 {distanceKm ? `${distanceKm.toFixed(1)}km` : 'Unknown'} • {formatFirebaseTimestamp(createdAt)}
                                </Typography>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFullPostOpen(true);
                                    }}
                                    sx={{
                                        fontSize: '10px',
                                        padding: '2px 8px',
                                        minWidth: 'auto',
                                        height: 24
                                    }}
                                >
                                    View Full
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Full Post Modal */}
            <Modal
                open={fullPostOpen}
                onClose={() => setFullPostOpen(false)}
                aria-labelledby="full-post-modal"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2
                }}
            >
                <Box sx={{
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    backgroundColor: 'transparent',
                    outline: 'none'
                }}>
                    <PostCard post={post} />
                </Box>
            </Modal>
        </>
    );
};

export default MapPostCard;