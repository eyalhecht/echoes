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
    Modal,
    styled
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { format } from 'date-fns';
import { usePostInteractions } from '../hooks/usePostInteractions';
import PostMap from "./PostMap.jsx";
import CloseIcon from "@mui/icons-material/Close";

// Memphis-style components - Different approach
const MemphisCard = styled(Card)(({ theme }) => ({
    maxWidth: 600,
    margin: '30px auto',
    borderRadius: 0,
    backgroundColor: '#F0F8FF',
    position: 'relative',
    overflow: 'visible',
    boxShadow: 'none',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: -15,
        left: -15,
        right: 15,
        bottom: 15,
        background: 'repeating-linear-gradient(45deg, #FFB6C1, #FFB6C1 10px, #87CEEB 10px, #87CEEB 20px)',
        zIndex: -2,
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        top: -8,
        left: -8,
        right: 8,
        bottom: 8,
        backgroundColor: '#000',
        zIndex: -1,
    }
}));

const MemphisHeader = styled(CardHeader)(({ theme }) => ({
    backgroundColor: '#FFD700',
    borderBottom: '4px solid #000',
    '& .MuiCardHeader-avatar': {
        marginRight: '20px',
    }
}));

const BrutalAvatar = styled(Avatar)(({ theme }) => ({
    width: 56,
    height: 56,
    fontSize: '24px',
    fontFamily: '"Arial Black", sans-serif',
    backgroundColor: '#FF1493',
    color: '#000',
    border: '3px solid #000',
    boxShadow: '4px 4px 0px #000',
}));

const GeometricDecoration = styled(Box)(({ theme }) => ({
    position: 'absolute',
    width: '60px',
    height: '60px',
    backgroundColor: '#40E0D0',
    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
    border: '3px solid #000',
}));

const InteractionBar = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    padding: '12px',
    backgroundColor: '#98FB98',
    borderTop: '4px solid #000',
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'repeating-linear-gradient(90deg, #000 0px, #000 5px, transparent 5px, transparent 10px)',
    }
}));

const NeobrutalButton = styled(IconButton)(({ active, color = '#FFD700' }) => ({
    backgroundColor: active ? color : '#FFF',
    border: '3px solid #000',
    borderRadius: '50%',
    padding: '10px',
    transition: 'all 0.1s',
    '&:hover': {
        backgroundColor: color,
        transform: 'translate(-2px, -2px) rotate(15deg)',
        boxShadow: '4px 4px 0px #000',
    },
    '&:active': {
        transform: 'translate(0, 0)',
        boxShadow: '2px 2px 0px #000',
    }
}));

const StatsBox = styled(Box)(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '32px',
    height: '32px',
    padding: '0 8px',
    backgroundColor: '#FFF',
    border: '2px solid #000',
    fontFamily: '"Courier New", monospace',
    fontWeight: 'bold',
    fontSize: '14px',
    position: 'relative',
    clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)',
    '&::after': {
        content: '""',
        position: 'absolute',
        inset: '2px',
        backgroundColor: '#FFD700',
        clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)',
        opacity: 0.3,
        zIndex: -1,
    }
}));

const ReadMoreButton = styled(Button)(({ theme }) => ({
    borderRadius: 0,
    padding: '8px 20px',
    fontFamily: '"Arial Black", sans-serif',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    backgroundColor: '#FF69B4',
    color: '#000',
    border: '3px solid #000',
    boxShadow: '3px 3px 0px #000',
    '&:hover': {
        backgroundColor: '#FF1493',
        transform: 'translate(-1px, -1px)',
        boxShadow: '4px 4px 0px #000',
    },
}));

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
        files,
        location,
        year,
        commentsCount,
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

    // Format the timestamp for display
    const formattedTimestamp = "time here"

    const renderMedia = () => {
        if (!files || files.length === 0) {
            return null; // No files to display
        }

        const firstFile = files[0];
        const mediaContainerStyle = {
            position: 'relative',
            backgroundColor: '#000',
            padding: '4px',
            border: '4px solid #000',
            mb: 0,
        };

        switch (type) {
            case 'photo':
            case 'document':
            case 'item':
                return (
                    <Box sx={mediaContainerStyle}>
                        <CardMedia
                            component="img"
                            image={firstFile}
                            alt="Post media"
                            sx={{
                                maxHeight: 400,
                                width: '100%',
                                objectFit: 'cover',
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 10,
                                right: 10,
                                backgroundColor: '#FFD700',
                                padding: '4px 12px',
                                border: '3px solid #000',
                                fontFamily: '"Arial Black", sans-serif',
                                fontSize: '12px',
                                textTransform: 'uppercase',
                            }}
                        >
                            {type}
                        </Box>
                    </Box>
                );
            case 'video':
                return (
                    <Box sx={mediaContainerStyle}>
                        <CardMedia
                            component="video"
                            controls
                            src={firstFile}
                            sx={{
                                maxHeight: 400,
                                width: '100%',
                            }}
                        />
                    </Box>
                );
            case 'youtube':
                const getYouTubeEmbedUrl = (url) => {
                    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
                    const videoId = videoIdMatch ? videoIdMatch[1] : url.split('/').pop();
                    return `https://www.youtube.com/embed/${videoId}`;
                };

                return (
                    <Box sx={mediaContainerStyle}>
                        <iframe
                            width="100%"
                            height="315"
                            src={getYouTubeEmbedUrl(firstFile)}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ display: 'block' }}
                        />
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <MemphisCard>
                {/* Geometric decorations */}
                <GeometricDecoration sx={{ top: -20, right: 30 }} />
                <Box
                    sx={{
                        position: 'absolute',
                        top: -25,
                        left: 40,
                        width: 50,
                        height: 50,
                        backgroundColor: '#9370DB',
                        borderRadius: '50%',
                        border: '3px solid #000',
                        zIndex: 2,
                    }}
                />

                <MemphisHeader
                    avatar={
                        <BrutalAvatar
                            src={userProfilePicUrl || ''}
                            alt={userDisplayName}
                        >
                            {!userProfilePicUrl && (userDisplayName ? userDisplayName.charAt(0).toUpperCase() : 'U')}
                        </BrutalAvatar>
                    }
                    action={
                        <IconButton
                            sx={{
                                backgroundColor: '#87CEEB',
                                border: '3px solid #000',
                                borderRadius: 0,
                                '&:hover': {
                                    backgroundColor: '#00BFFF',
                                }
                            }}
                        >
                            <MoreVertIcon />
                        </IconButton>
                    }
                    title={
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: '"Arial Black", sans-serif',
                                textTransform: 'uppercase',
                                letterSpacing: '-1px',
                                textShadow: '2px 2px 0px #FFF',
                            }}
                        >
                            {userDisplayName || 'Anonymous'}
                        </Typography>
                    }
                    subheader={
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                            <Typography
                                sx={{
                                    fontFamily: '"Courier New", monospace',
                                    backgroundColor: '#000',
                                    color: '#FFF',
                                    padding: '2px 8px',
                                    fontSize: '12px',
                                }}
                            >
                                {formattedTimestamp}
                            </Typography>
                            {year && year.length > 0 && (
                                <Typography
                                    sx={{
                                        backgroundColor: '#FF1493',
                                        padding: '2px 8px',
                                        fontWeight: 'bold',
                                        fontSize: '12px',
                                        border: '2px solid #000',
                                    }}
                                >
                                    {year.join('-')}
                                </Typography>
                            )}
                        </Box>
                    }
                />

                {renderMedia()}

                <CardContent
                    sx={{
                        backgroundColor: '#FFF',
                        position: 'relative',
                        padding: 3,
                    }}
                >
                    {/* Decorative dots pattern */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: 100,
                            height: 100,
                            backgroundImage: 'radial-gradient(circle, #FFB6C1 20%, transparent 20%)',
                            backgroundSize: '15px 15px',
                            opacity: 0.5,
                        }}
                    />

                    <Typography
                        variant="body1"
                        sx={{
                            marginBottom: 2,
                            whiteSpace: 'pre-wrap',
                            fontFamily: '"Georgia", serif',
                            fontSize: '16px',
                            lineHeight: 1.8,
                            position: 'relative',
                            zIndex: 1,
                        }}
                    >
                        {getDisplayedText()}
                    </Typography>

                    {shouldTruncate && (
                        <ReadMoreButton
                            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                            sx={{ mb: 2 }}
                        >
                            {isDescriptionExpanded ? '← Show Less' : 'Read More →'}
                        </ReadMoreButton>
                    )}
                </CardContent>

                <InteractionBar>
                    <NeobrutalButton
                        active={liked}
                        onClick={handleLikeToggle}
                        disabled={isLikeUpdating}
                        color="#FF69B4"
                    >
                        {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </NeobrutalButton>
                    <StatsBox>{likesCount}</StatsBox>

                    <NeobrutalButton color="#87CEEB">
                        <ChatBubbleOutlineIcon />
                    </NeobrutalButton>
                    <StatsBox>{commentsCount || 0}</StatsBox>

                    <NeobrutalButton
                        active={bookmarked}
                        onClick={handleBookmarkToggle}
                        disabled={isBookmarkUpdating}
                        color="#9370DB"
                    >
                        {bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                    </NeobrutalButton>
                    <StatsBox>{bookmarksCount}</StatsBox>

                    {location && (
                        <NeobrutalButton
                            onClick={() => setLocationModal(true)}
                            color="#40E0D0"
                            sx={{ ml: 'auto' }}
                        >
                            <LocationOnIcon />
                        </NeobrutalButton>
                    )}
                </InteractionBar>
            </MemphisCard>

            {/* Location Modal */}
            {location && (
                <Modal
                    open={locationModal}
                    onClose={() => setLocationModal(false)}
                    BackdropProps={{
                        sx: {
                            backgroundColor: 'rgba(255, 215, 0, 0.5)',
                        }
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: { xs: '90%', sm: 500 },
                            backgroundColor: '#F0F8FF',
                            border: '5px solid #000',
                            boxShadow: '10px 10px 0px #FF1493',
                            '&:focus': { outline: 'none' }
                        }}
                    >
                        <Box
                            sx={{
                                backgroundColor: '#40E0D0',
                                p: 2,
                                borderBottom: '5px solid #000',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    fontFamily: '"Arial Black", sans-serif',
                                    textTransform: 'uppercase',
                                    textShadow: '2px 2px 0px #000',
                                    color: '#FFF'
                                }}
                            >
                                Location
                            </Typography>
                            <IconButton
                                onClick={() => setLocationModal(false)}
                                sx={{
                                    backgroundColor: '#FFD700',
                                    border: '3px solid #000',
                                    borderRadius: 0,
                                    '&:hover': {
                                        backgroundColor: '#FFA500',
                                    }
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <PostMap
                            center={{ lat: location?._lat, lng: location?._long }}
                            height="400px"
                            zoom={15}
                        />
                    </Box>
                </Modal>
            )}
        </>
    );
}

export default PostCard;