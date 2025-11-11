import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Loader2, MapPin, Navigation } from 'lucide-react';
import { callApiGateway } from '../firebaseConfig.js';
import MapPostCard from './MapPostCard.jsx';
import useUiStore from '../stores/useUiStore.js';

const MapPostsView = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mapCenter, setMapCenter] = useState({ lat: 40.7589, lng: -73.9851 });
    const [radiusKm, setRadiusKm] = useState(45);
    const [postType, setPostType] = useState('all');
    const [selectedPost, setSelectedPost] = useState(null);
    const [hoveredPost, setHoveredPost] = useState(null);
    const [map, setMap] = useState(null);
    const [locationPosts, setLocationPosts] = useState([]);
    const debounceTimer = useRef(null);
    const cardRefs = useRef({});

    // Get global posts and post management functions
    const { posts, setPosts } = useUiStore();

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
                const newRadius = Math.min(Math.max(radiusKm, 0.1), 500);

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
                (geolocationError) => {
                    console.log('Error getting location:', geolocationError);
                    fetchPosts(mapCenter, radiusKm);
                }
            );
        }
    }, [fetchPosts, radiusKm, map]);

    // Initial load
    useEffect(() => {
        getCurrentLocation();
    }, []);

    return (
        <div className="h-[90vh] mx-2 flex flex-col">
            <div className="flex-1 rounded-lg overflow-hidden border">
                <ResizablePanelGroup direction="horizontal" className="h-full">
                    <ResizablePanel defaultSize={45} minSize={25} maxSize={75}>
                        <div className="h-full flex flex-col">
                            {/* Header */}
                            <div className="p-3 bg-muted/50 border-b flex flex-row gap-2.5">
                                <h2 className="text-lg font-semibold">
                                    {locationPosts.length} Posts in Area
                                </h2>
                                {loading && (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span className="text-sm text-muted-foreground">
                                            Loading posts...
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Posts Grid */}
                            <div className="flex-1 overflow-y-auto p-4 bg-muted/30">
                                {error && (
                                    <Alert className="mb-4">
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                {!loading && locationPosts.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                        <h3 className="text-base font-medium mb-1">
                                            No posts found in this area
                                        </h3>
                                        <p className="text-sm">
                                            Try moving the map or zooming out
                                        </p>
                                    </div>
                                ) : (
                                    <div className="columns-1 sm:columns-2 gap-3 space-y-3">
                                        {locationPosts.map((post) => (
                                            <div
                                                key={post.id}
                                                ref={(el) => {
                                                    if (el) cardRefs.current[post.id] = el;
                                                }}
                                                className="break-inside-avoid mb-3"
                                            >
                                                <MapPostCard
                                                    post={post}
                                                    isSelected={selectedPost?.id === post.id}
                                                    onCardClick={handleCardClick}
                                                    onCardHover={handleCardHover}
                                                    onCardLeave={handleCardLeave}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </ResizablePanel>

                    {/* Resizable Handle */}
                    <ResizableHandle withHandle />

                    {/* Map Panel */}
                    <ResizablePanel defaultSize={55} minSize={25} maxSize={75}>
                        <div className="h-full relative">
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
                                                            <svg width="48" height="60" viewBox="0 0 48 60" xmlns="http://www.w3.org/2000/svg">
                                                                <defs>
                                                                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                                                                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                                                        <feMerge>
                                                                            <feMergeNode in="coloredBlur"/>
                                                                            <feMergeNode in="SourceGraphic"/>
                                                                        </feMerge>
                                                                    </filter>
                                                                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                                                                        <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="rgba(0,0,0,0.25)"/>
                                                                    </filter>
                                                                </defs>
                                                                <circle cx="24" cy="24" r="22" fill="none" stroke="hsl(0, 84%, 60%)" stroke-width="2" opacity="0.6" filter="url(#glow)"/>
                                                                <path d="M24 54 C24 54, 42 34, 42 24 C42 14, 34 6, 24 6 C14 6, 6 14, 6 24 C6 34, 24 54, 24 54 Z"
                                                                      fill="hsl(0, 84%, 60%)" stroke="white" stroke-width="3" filter="url(#shadow)"/>
                                                                <circle cx="24" cy="24" r="10" fill="white"/>
                                                                <rect x="19" y="19" width="10" height="8" rx="1" fill="hsl(0, 84%, 60%)"/>
                                                                <circle cx="21" cy="22" r="1.2" fill="white"/>
                                                                <polygon points="27,25 28.5,23.5 30,25 30,27 19,27 19,25" fill="white"/>
                                                            </svg>
                                                        `),
                                                        scaledSize: new window.google.maps.Size(48, 60),
                                                        anchor: new window.google.maps.Point(24, 54)
                                                    }
                                                    : {
                                                        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                                                            <svg width="36" height="45" viewBox="0 0 36 45" xmlns="http://www.w3.org/2000/svg">
                                                                <defs>
                                                                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                                                                        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.2)"/>
                                                                    </filter>
                                                                </defs>
                                                                <path d="M18 40.5 C18 40.5, 32 25.5, 32 18 C32 10.3, 25.7 4, 18 4 C10.3 4, 4 10.3, 4 18 C4 25.5, 18 40.5, 18 40.5 Z"
                                                                      fill="hsl(221, 83%, 53%)" stroke="white" stroke-width="2" filter="url(#shadow)"/>
                                                                <circle cx="18" cy="18" r="8" fill="white"/>
                                                                <rect x="14" y="14.5" width="8" height="6" rx="0.8" fill="hsl(221, 83%, 53%)"/>
                                                                <circle cx="15.5" cy="16.5" r="0.8" fill="white"/>
                                                                <polygon points="19.5,19 20.5,18 21.5,19 21.5,20.5 14,20.5 14,19" fill="white"/>
                                                            </svg>
                                                        `),
                                                        scaledSize: new window.google.maps.Size(36, 45),
                                                        anchor: new window.google.maps.Point(18, 40.5)
                                                    }
                                            }
                                        />
                                    )
                                ))}
                            </GoogleMap>
                            {/* Current Location Button */}
                            <Button
                                size="icon"
                                onClick={getCurrentLocation}
                                className="absolute bottom-[35px] left-4 z-10 shadow-lg"
                            >
                                <Navigation className="h-4 w-4" />
                            </Button>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    );
};

export default MapPostsView;