import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from 'lucide-react';
import { Spinner } from "@/components/ui/spinner";
import { callApiGateway } from '../firebaseConfig.js';
import MapPostCard from './MapPostCard.jsx';
import { getMarkerIcon } from './mapMarkers.js';
import useUiStore from '../stores/useUiStore.js';

const DEFAULT_CENTER = { lat: 40.7589, lng: -73.9851 };

const mapContainerStyle = { width: '100%', height: '100%' };

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
};

const MapPostsView = () => {
    const [loading, setLoading] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [locationPosts, setLocationPosts] = useState([]);
    const mapRef = useRef(null);
    const debounceTimer = useRef(null);
    const cardRefs = useRef({});
    const initialCenterRef = useRef(DEFAULT_CENTER);

    const fetchPosts = useCallback(async (center, radius) => {
        setLoading(true);
        try {
            const response = await callApiGateway({
                action: 'getPostsByLocation',
                payload: { center, radiusKm: radius, limit: 50 }
            });

            const normalizedPosts = response.data.posts.map(post => ({
                ...post,
                likedByCurrentUser: post.likedByCurrentUser || false,
                likesCount: post.likesCount || 0,
                bookmarkedByCurrentUser: post.bookmarkedByCurrentUser || false,
                bookmarksCount: post.bookmarksCount || 0,
                isLikeUpdating: false,
                isBookmarkUpdating: false,
            }));

            // Merge into global store
            const { posts, setPosts } = useUiStore.getState();
            const existingIds = new Set(posts.map(p => p.id));
            const newPosts = normalizedPosts.filter(p => !existingIds.has(p.id));
            if (newPosts.length > 0) {
                setPosts([...posts, ...newPosts]);
            }

            setLocationPosts(normalizedPosts);
        } catch (err) {
            console.error('Error fetching posts:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleMapChange = useCallback(() => {
        const map = mapRef.current;
        if (!map) return;

        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        debounceTimer.current = setTimeout(() => {
            const bounds = map.getBounds();
            const center = map.getCenter();
            if (!bounds || !center) return;

            const ne = bounds.getNorthEast();
            const sw = bounds.getSouthWest();
            const radiusKm = Math.max(ne.lat() - sw.lat(), ne.lng() - sw.lng()) * 111 / 2;
            const newCenter = { lat: center.lat(), lng: center.lng() };
            const clampedRadius = Math.min(Math.max(radiusKm, 0.1), 500);

            fetchPosts(newCenter, clampedRadius);
        }, 500);
    }, [fetchPosts]);

    const handleMarkerClick = useCallback((post) => {
        setSelectedPost(post);
        cardRefs.current[post.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, []);

    const handleCardClick = useCallback((post) => {
        setSelectedPost(post);
        if (mapRef.current && post.location?._latitude && post.location?._longitude) {
            mapRef.current.panTo({ lat: post.location._latitude, lng: post.location._longitude });
        }
    }, []);

    const getCurrentLocation = useCallback(() => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
                initialCenterRef.current = loc;
                if (mapRef.current) mapRef.current.panTo(loc);
                fetchPosts(loc, 45);
            },
            () => fetchPosts(DEFAULT_CENTER, 45)
        );
    }, [fetchPosts]);

    useEffect(() => {
        getCurrentLocation();
    }, [getCurrentLocation]);

    return (
        <div className="h-[90vh] mx-2 flex flex-col">
            <div className="flex-1 rounded-lg overflow-hidden border">
                <ResizablePanelGroup direction="horizontal" className="h-full">
                    <ResizablePanel defaultSize={45} minSize={25} maxSize={75}>
                        <div className="h-full flex flex-col">
                            <div className="p-3 bg-muted/50 border-b flex flex-row gap-2.5">
                                <h2 className="text-lg font-semibold">
                                    {locationPosts.length} Posts in Area
                                </h2>
                                {loading && (
                                    <div className="flex items-center gap-2">
                                        <Spinner size="sm" />
                                        <span className="text-sm text-muted-foreground">Loading posts...</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 bg-muted/30">
                                {!loading && locationPosts.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                        <h3 className="text-base font-medium mb-1">No posts found in this area</h3>
                                        <p className="text-sm">Try moving the map or zooming out</p>
                                    </div>
                                ) : (
                                    <div className="columns-1 sm:columns-2 gap-3 space-y-3">
                                        {locationPosts.map((post) => (
                                            <div
                                                key={post.id}
                                                ref={(el) => { if (el) cardRefs.current[post.id] = el; }}
                                                className="break-inside-avoid mb-3"
                                            >
                                                <MapPostCard
                                                    post={post}
                                                    isSelected={selectedPost?.id === post.id}
                                                    onCardClick={handleCardClick}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    <ResizablePanel defaultSize={55} minSize={25} maxSize={75}>
                        <div className="h-full relative">
                            <GoogleMap
                                mapContainerStyle={mapContainerStyle}
                                center={initialCenterRef.current}
                                zoom={12}
                                options={mapOptions}
                                onLoad={(m) => { mapRef.current = m; }}
                                onUnmount={() => { mapRef.current = null; }}
                                onDragEnd={handleMapChange}
                                onZoomChanged={handleMapChange}
                            >
                                {locationPosts.map((post) =>
                                    post.location?._latitude && post.location?._longitude && (
                                        <Marker
                                            key={post.id}
                                            position={{ lat: post.location._latitude, lng: post.location._longitude }}
                                            onClick={() => handleMarkerClick(post)}
                                            icon={getMarkerIcon(selectedPost?.id === post.id)}
                                        />
                                    )
                                )}
                            </GoogleMap>
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
