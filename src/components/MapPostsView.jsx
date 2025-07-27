import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Fab
} from '@mui/material';
import {
    MyLocation as MyLocationIcon,
} from '@mui/icons-material';
import { callApiGateway } from '../firebaseConfig.js';

const MapPostsView = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mapCenter, setMapCenter] = useState({ lat: 40.7589, lng: -73.9851 });
    const [radiusKm, setRadiusKm] = useState(5);
    const [postType, setPostType] = useState('all');
    const [selectedPost, setSelectedPost] = useState(null);
    const [map, setMap] = useState(null);
    const debounceTimer = useRef(null);

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

            setPosts(filteredPosts);
            console.log('Got posts:', filteredPosts.length);
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError('Failed to load posts for this area');
        } finally {
            setLoading(false);
        }
    }, [postType]);
console.log("asd")
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

    // Handle marker click
    const handleMarkerClick = useCallback((post) => {
        setSelectedPost(post);
        console.log('Marker clicked:', post.userDisplayName);
    }, []);

    // Get current location
    const getCurrentLocation = useCallback(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newCenter = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setMapCenter(newCenter);
                    fetchPosts(newCenter, radiusKm);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setError('Could not get your location');
                }
            );
        }
    }, [fetchPosts, radiusKm]);

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
            </Box>

            <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                <Box sx={{ flex: 2, position: 'relative' }}>
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
                            {posts.map((post) => (
                                post.location?._latitude && post.location?._longitude && (
                                    <Marker
                                        key={post.id}
                                        position={{
                                            lat: post.location._latitude,
                                            lng: post.location._longitude
                                        }}
                                        onClick={() => handleMarkerClick(post)}
                                        icon={{
                                            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                                                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="16" cy="12" r="18" fill="#1976d2" stroke="white" stroke-width="2"/>
                                                    <path d="M16 4 L16 20 L8 12 Z" fill="#1976d2"/>
                                                    <text x="16" y="16" text-anchor="middle" fill="white" font-size="10">📷</text>
                                                </svg>
                                            `)}`,
                                            scaledSize: new window.google.maps.Size(32, 32),
                                            anchor: new window.google.maps.Point(16, 32)
                                        }}
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
                            bottom: 186,
                            right: 16,
                            zIndex: 1000
                        }}
                    >
                        <MyLocationIcon />
                    </Fab>

                    {/* Loading Overlay */}
                    {loading && (
                        <Box sx={{
                            position: 'absolute',
                            top: 16,
                            left: 16,
                            bgcolor: 'background.paper',
                            borderRadius: 1,
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            boxShadow: 2,
                            zIndex: 1000
                        }}>
                            <CircularProgress size={20} />
                            <Typography variant="body2">Loading posts...</Typography>
                        </Box>
                    )}

                    {/* Error Alert */}
                    {error && (
                        <Alert
                            severity="error"
                            onClose={() => setError(null)}
                            sx={{ position: 'absolute', top: 16, left: 16, right: 16, zIndex: 1000 }}
                        >
                            {error}
                        </Alert>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default MapPostsView;