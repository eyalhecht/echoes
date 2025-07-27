import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Fab,
    Divider
} from '@mui/material';
import {
    MyLocation as MyLocationIcon,
} from '@mui/icons-material';
import { callApiGateway } from '../firebaseConfig.js';
import MapPostCard from './MapPostCard.jsx';
import useUiStore from '../stores/useUiStore.js';

const MapPostsView = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mapCenter, setMapCenter] = useState({ lat: 40.7589, lng: -73.9851 });
    const [radiusKm, setRadiusKm] = useState(5);
    const [postType, setPostType] = useState('all');
    const [selectedPost, setSelectedPost] = useState(null);
    const [hoveredPost, setHoveredPost] = useState(null);
    const [map, setMap] = useState(null);
    const [locationPosts, setLocationPosts] = useState([]); // Local state for location-filtered posts
    const debounceTimer = useRef(null);
    const cardRefs = useRef({});

    // Get global posts and post management functions
    const { posts, updatePost, setPosts } = useUiStore();

    const mapContainerStyle = {
        width: '100%',
        height: '100%'
    };

    const mapOptions = {
        disableDefaultUI: true,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
    };

    const onLoad = useCallback((mapInstance) => {
        setMap(mapInstance);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    const fetchPosts = useCallback(async (center, radius, type = postType) => {
        setLoading(true);
        setError(null);

        try {
            console.log('Fetching posts for:', center, 'radius:', radius);

            const response = await callApiGateway({
                action: 'getPostsByLocation',
                payload: {
                    center,
                    radiusKm: radius,
                    limit: 50
                }
            });

            let filteredPosts = response.data.posts;

            if (type !== 'all') {
                filteredPosts = filteredPosts.filter(post => post.type === type);
            }

            // Ensure all posts have proper interaction properties
            const normalizedPosts = filteredPosts.map(post => ({
                ...post,
                likedByCurrentUser: post.likedByCurrentUser || false,
                likesCount: post.likesCount || 0,
                bookmarkedByCurrentUser: post.bookmarkedByCurrentUser || false,
                bookmarksCount: post.bookmarksCount || 0,
                isLikeUpdating: false,
                isBookmarkUpdating: false
            }));

            // Add location posts to global store if they don't exist
            const existingPostIds = new Set(posts.map(p => p.id));
            const newPosts = normalizedPosts.filter(post => !existingPostIds.has(post.id));
            
            if (newPosts.length > 0) {
                const updatedGlobalPosts = [...posts, ...newPosts];
                setPosts(updatedGlobalPosts);
                console.log('Added', newPosts.length, 'new posts to global store');
            }

            // Use normalized posts for location display
            setLocationPosts(normalizedPosts);
            console.log('Got posts:', normalizedPosts.length);
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError('Failed to load posts for this area');
        } finally {
            setLoading(false);
        }
    }, [postType, posts, setPosts]);
    const handleMapChange = useCallback(() => {
        if (!map) return;

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            const bounds = map.getBounds();
            const center = map.getCenter();

            if (bounds && center) {
                const ne = bounds.getNorthEast();
                const sw = bounds.getSouthWest();
                const radiusKm = Math.max(ne.lat() - sw.lat(), ne.lng() - sw.lng()) * 111 / 2;

                const newCenter = { lat: center.lat(), lng: center.lng() };
                const newRadius = Math.min(Math.max(radiusKm, 1), 50);

                setMapCenter(newCenter);
                setRadiusKm(newRadius);
                fetchPosts(newCenter, newRadius);
            }
        }, 500);
    }, [map, fetchPosts]);

    const handleMarkerClick = useCallback((post) => {
        setSelectedPost(post);
        console.log('Marker clicked:', post.userDisplayName);
        
        // Scroll to corresponding card
        if (cardRefs.current[post.id]) {
            cardRefs.current[post.id].scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, []);

    const handleCardClick = useCallback((post) => {
        setSelectedPost(post);
        
        if (map && post.location?._latitude && post.location?._longitude) {
            const position = {
                lat: post.location._latitude,
                lng: post.location._longitude
            };
            map.panTo(position);
        }
        
        console.log('Card clicked:', post.userDisplayName);
    }, [map]);

    const handleCardHover = useCallback((post) => {
        setHoveredPost(post);
    }, []);

    const handleCardLeave = useCallback(() => {
        setHoveredPost(null);
    }, []);

    const getCurrentLocation = useCallback(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newCenter = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setMapCenter(newCenter);
                    if (map) {
                        map.panTo(newCenter);
                    }
                    fetchPosts(newCenter, radiusKm);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setError('Could not get your location');
                }
            );
        }
    }, [fetchPosts, radiusKm, map]);

    // Initial load
    useEffect(() => {
        fetchPosts(mapCenter, radiusKm);
    }, []);

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, bgcolor: '#f5f1e8', borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h5" gutterBottom>
                    Explore Posts by Location
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {locationPosts.length} posts found in this area
                </Typography>
            </Box>

            <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                <Box sx={{
                    width: '40%', 
                    borderRight: 1, 
                    borderColor: 'divider',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Box sx={{ p: 2, bgcolor: '#fafafa', borderBottom: 1, borderColor: 'divider' }}>
                        <Typography variant="h6" gutterBottom>
                            Posts in Area
                        </Typography>
                        {loading && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CircularProgress size={16} />
                                <Typography variant="body2" color="text.secondary">
                                    Loading posts...
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    <Box sx={{
                        flex: 1, 
                        overflowY: 'auto', 
                        p: 2,
                        backgroundColor: '#fafafa'
                    }}>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}
                        
                        {!loading && locationPosts.length === 0 ? (
                            <Box sx={{ 
                                textAlign: 'center', 
                                py: 4,
                                color: 'text.secondary'
                            }}>
                                <Typography variant="body1" gutterBottom>
                                    No posts found in this area
                                </Typography>
                                <Typography variant="body2">
                                    Try moving the map or zooming out
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: 1.5,
                                width: '100%'
                            }}>
                                {locationPosts.map((post) => (
                                    <Box 
                                        key={post.id}
                                        ref={(el) => {
                                            if (el) cardRefs.current[post.id] = el;
                                        }}
                                    >
                                        <MapPostCard
                                            post={post}
                                            isSelected={selectedPost?.id === post.id}
                                            onCardClick={handleCardClick}
                                            onCardHover={handleCardHover}
                                            onCardLeave={handleCardLeave}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* Right Panel - Map */}
                <Box sx={{ flex: 1, position: 'relative' }}>
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={mapCenter}
                        zoom={12}
                        options={mapOptions}
                        onLoad={onLoad}
                        onUnmount={onUnmount}
                        onDragEnd={handleMapChange}
                        onZoomChanged={handleMapChange}
                    >
                        {/* Markers */}
                        {locationPosts.map((post) => (
                            post.location?._latitude && post.location?._longitude && (
                                <Marker
                                    key={post.id}
                                    position={{
                                        lat: post.location._latitude,
                                        lng: post.location._longitude
                                    }}
                                    onClick={() => handleMarkerClick(post)}
                                    icon={
                                        selectedPost?.id === post.id || hoveredPost?.id === post.id
                                            ? {
                                                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                                                    <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                                                        <circle cx="15" cy="15" r="12" fill="#1976d2" stroke="white" stroke-width="3"/>
                                                    </svg>
                                                `),
                                                scaledSize: new window.google.maps.Size(30, 30),
                                                anchor: new window.google.maps.Point(15, 15)
                                            }
                                            : undefined
                                    }
                                />
                            )
                        ))}

                        {/* Info Window */}
                        {selectedPost && (
                            <InfoWindow
                                position={{
                                    lat: selectedPost.location._latitude,
                                    lng: selectedPost.location._longitude
                                }}
                                onCloseClick={() => setSelectedPost(null)}
                            >
                                <Box sx={{ maxWidth: 200 }}>
                                    <Typography variant="h6" gutterBottom>
                                        {selectedPost.userDisplayName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {selectedPost.description.substring(0, 100)}
                                        {selectedPost.description.length > 100 ? '...' : ''}
                                    </Typography>
                                    {selectedPost.files?.[0] && (
                                        <img
                                            src={selectedPost.files[0]}
                                            alt="Post preview"
                                            style={{
                                                width: '100%',
                                                height: 80,
                                                objectFit: 'cover',
                                                borderRadius: 4,
                                                marginBottom: 8
                                            }}
                                        />
                                    )}
                                    <Typography variant="caption" color="text.secondary">
                                        {selectedPost.distanceKm?.toFixed(1)}km away • {selectedPost.likesCount || 0} likes
                                    </Typography>
                                </Box>
                            </InfoWindow>
                        )}
                    </GoogleMap>

                    {/* Current Location Button */}
                    <Fab
                        color="primary"
                        size="small"
                        onClick={getCurrentLocation}
                        sx={{
                            position: 'absolute',
                            bottom: 16,
                            right: 16,
                            zIndex: 1000
                        }}
                    >
                        <MyLocationIcon />
                    </Fab>
                </Box>
            </Box>
        </Box>
    );
};

export default MapPostsView;