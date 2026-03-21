import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, X, Search } from 'lucide-react';
import { Spinner } from "@/components/ui/spinner";
import { callApiGateway } from '../firebaseConfig.js';
import MapPostCard from './MapPostCard.jsx';
import { MapPhotoMarkerOverlay, MapClusterMarkerOverlay } from './MapPhotoMarker.jsx';
import { MAP_STYLE_LIGHT, MAP_STYLE_DARK } from './mapStyle.js';
import useUiStore from '../stores/useUiStore.js';
import { useIsMobile } from '../hooks/use-mobile.jsx';
import { useSearchParams, useNavigate } from 'react-router-dom';

const DEFAULT_CENTER = { lat: 40.7589, lng: -73.9851 };
const mapContainerStyle = { width: '100%', height: '100%' };
function getMapStyle() {
    return document.documentElement.classList.contains('dark') ? MAP_STYLE_DARK : MAP_STYLE_LIGHT;
}

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    styles: getMapStyle(),
};

const ERA_OPTIONS = [
    { label: 'All eras', min: -Infinity, max: Infinity },
    { label: 'Pre-1900', min: -Infinity, max: 1899 },
    { label: '1900–1950', min: 1900, max: 1950 },
    { label: '1950–2000', min: 1951, max: 2000 },
    { label: '2000s+', min: 2001, max: Infinity },
];

// Compute geographic clusters from posts at the current zoom level.
// Uses a simple greedy approach: at low zoom, nearby posts merge into one cluster marker.
function computeClusters(posts, zoom) {
    // At zoom 15+, no clustering — show every post individually
    const threshold = zoom >= 15 ? 0 : 0.005 * Math.pow(2, 14 - zoom);
    if (threshold === 0) {
        return posts.map(p => ({
            posts: [p],
            lat: p.location._latitude,
            lng: p.location._longitude,
            id: p.id,
        }));
    }

    const assigned = new Set();
    const result = [];

    for (let i = 0; i < posts.length; i++) {
        if (assigned.has(i)) continue;
        const pi = posts[i];
        const group = [pi];
        assigned.add(i);

        for (let j = i + 1; j < posts.length; j++) {
            if (assigned.has(j)) continue;
            const pj = posts[j];
            const dLat = Math.abs(pi.location._latitude - pj.location._latitude);
            const dLng = Math.abs(pi.location._longitude - pj.location._longitude);
            if (dLat <= threshold && dLng <= threshold) {
                group.push(pj);
                assigned.add(j);
            }
        }

        const lat = group.reduce((s, p) => s + p.location._latitude, 0) / group.length;
        const lng = group.reduce((s, p) => s + p.location._longitude, 0) / group.length;
        result.push({ posts: group, lat, lng, id: group.length > 1 ? `cluster-${i}` : pi.id });
    }
    return result;
}

const MapPostsView = () => {
    const isMobile = useIsMobile();
    const [loading, setLoading] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [hoveredPostId, setHoveredPostId] = useState(null);
    const [locationPosts, setLocationPosts] = useState([]);
    const [showSearchPill, setShowSearchPill] = useState(false);
    const [eraIndex, setEraIndex] = useState(0); // index into ERA_OPTIONS
    const [mapZoom, setMapZoom] = useState(12);
    const mapRef = useRef(null);
    const cardRefs = useRef({});
    const initialCenterRef = useRef(DEFAULT_CENTER);
    const hasFetchedInitially = useRef(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const searchQuery = searchParams.get('q') ?? '';

    // Filter posts by selected era (client-side, no refetch)
    const filteredPosts = useMemo(() => {
        const era = ERA_OPTIONS[eraIndex];
        if (era.min === -Infinity && era.max === Infinity) return locationPosts;
        return locationPosts.filter(p => {
            const year = p.year?.[0];
            if (!year) return true; // no year data → always show
            return year >= era.min && year <= era.max;
        });
    }, [locationPosts, eraIndex]);

    // Show era filter only if at least one post has year data
    const hasYearData = useMemo(() => locationPosts.some(p => p.year?.[0]), [locationPosts]);

    // Cluster filtered posts based on current zoom level
    const clusters = useMemo(() => computeClusters(filteredPosts, mapZoom), [filteredPosts, mapZoom]);

    const mergeIntoStore = useCallback((posts) => {
        const { posts: existing, setPosts } = useUiStore.getState();
        const existingIds = new Set(existing.map(p => p.id));
        const newPosts = posts.filter(p => !existingIds.has(p.id));
        if (newPosts.length > 0) setPosts([...existing, ...newPosts]);
    }, []);

    const normalizePosts = useCallback((raw) => raw.map(post => ({
        ...post,
        likedByCurrentUser: post.likedByCurrentUser || false,
        likesCount: post.likesCount || 0,
        bookmarkedByCurrentUser: post.bookmarkedByCurrentUser || false,
        bookmarksCount: post.bookmarksCount || 0,
        isLikeUpdating: false,
        isBookmarkUpdating: false,
    })), []);

    const fetchPosts = useCallback(async (center, radius) => {
        setLoading(true);
        try {
            const response = await callApiGateway({
                action: 'getPostsByLocation',
                payload: { center, radiusKm: radius, limit: 50 }
            });
            const posts = normalizePosts(response.data.posts);
            mergeIntoStore(posts);
            setLocationPosts(posts);
            hasFetchedInitially.current = true;
        } catch (err) {
            console.error('Error fetching posts:', err);
        } finally {
            setLoading(false);
        }
    }, [normalizePosts, mergeIntoStore]);

    const fetchPostsByQuery = useCallback(async (q) => {
        setLoading(true);
        try {
            const response = await callApiGateway({
                action: 'searchPosts',
                payload: { query: q, limit: 50 }
            });
            const allPosts = response.data.posts || [];
            const withLocation = allPosts.filter(p => p.location?._latitude && p.location?._longitude);
            const posts = normalizePosts(withLocation);
            mergeIntoStore(posts);
            setLocationPosts(posts);
            hasFetchedInitially.current = true;

            if (posts[0] && mapRef.current) {
                const first = posts[0];
                initialCenterRef.current = { lat: first.location._latitude, lng: first.location._longitude };
                mapRef.current.panTo(initialCenterRef.current);
                mapRef.current.setZoom(5);
            }
        } catch (err) {
            console.error('Error fetching posts by query:', err);
        } finally {
            setLoading(false);
        }
    }, [normalizePosts, mergeIntoStore]);

    const getCurrentLocation = useCallback(() => {
        if (!navigator.geolocation) {
            fetchPosts(DEFAULT_CENTER, 45);
            return;
        }
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

    // Called on every pan/zoom — track zoom level and show the pill
    const handleMapMoved = useCallback(() => {
        if (!hasFetchedInitially.current) return;
        if (mapRef.current) setMapZoom(mapRef.current.getZoom() ?? 12);
        setShowSearchPill(true);
    }, []);

    const handleMarkerClick = useCallback((post) => {
        setSelectedPost(post);
        cardRefs.current[post.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, []);

    const handleClusterClick = useCallback((cluster) => {
        if (cluster.posts.length === 1) {
            handleMarkerClick(cluster.posts[0]);
            return;
        }
        const map = mapRef.current;
        if (!map || !window.google?.maps) return;
        const bounds = new window.google.maps.LatLngBounds();
        cluster.posts.forEach(p => {
            bounds.extend({ lat: p.location._latitude, lng: p.location._longitude });
        });
        map.fitBounds(bounds, 80);
    }, [handleMarkerClick]);

    const handleSearchThisArea = useCallback(() => {
        const map = mapRef.current;
        if (!map) return;
        setShowSearchPill(false);

        const bounds = map.getBounds();
        const center = map.getCenter();
        if (!bounds || !center) return;

        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        const radiusKm = Math.max(ne.lat() - sw.lat(), ne.lng() - sw.lng()) * 111 / 2;
        const clampedRadius = Math.min(Math.max(radiusKm, 0.1), 500);

        if (searchQuery) setSearchParams({});
        fetchPosts({ lat: center.lat(), lng: center.lng() }, clampedRadius);
    }, [fetchPosts, searchQuery, setSearchParams]);

    const handleCardClick = useCallback((post) => {
        setSelectedPost(post);
        if (mapRef.current && post.location?._latitude && post.location?._longitude) {
            mapRef.current.panTo({ lat: post.location._latitude, lng: post.location._longitude });
        }
    }, []);

    useEffect(() => {
        if (searchQuery) {
            fetchPostsByQuery(searchQuery);
        } else {
            getCurrentLocation();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Shared card panel content
    const cardPanelContent = (
        <div className="h-full flex flex-col">
            {/* Panel header */}
            <div className="p-3 bg-muted/50 border-b flex flex-col gap-2">
                <div className="flex flex-row gap-2.5 items-center">
                    <div className="flex-1 min-w-0">
                        {searchQuery ? (
                            <div>
                                <h2 className="text-sm font-semibold truncate">
                                    &ldquo;{searchQuery}&rdquo;
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} with location
                                </p>
                            </div>
                        ) : (
                            <h2 className="text-sm font-semibold">
                                {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} in area
                            </h2>
                        )}
                    </div>
                    {loading && <Spinner size="sm" />}
                    {searchQuery && !loading && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 flex-shrink-0"
                            onClick={() => navigate('/map')}
                            title="Clear search"
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    )}
                </div>

                {/* Era filter — only shown when posts have year data */}
                {hasYearData && (
                    <div className="flex gap-1 flex-wrap">
                        {ERA_OPTIONS.map((era, i) => (
                            <button
                                key={era.label}
                                onClick={() => setEraIndex(i)}
                                className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                                    eraIndex === i
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'bg-background text-muted-foreground border-border hover:border-foreground/30'
                                }`}
                            >
                                {era.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Card list */}
            <div className="flex-1 overflow-y-auto p-3 bg-muted/30">
                {!loading && filteredPosts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <h3 className="text-base font-medium mb-1">No posts found</h3>
                        <p className="text-sm">
                            {eraIndex !== 0
                                ? 'Try a different era filter or pan the map'
                                : 'Pan the map and tap "Search this area"'}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {filteredPosts.map((post) => (
                            <div
                                key={post.id}
                                ref={(el) => { if (el) cardRefs.current[post.id] = el; }}
                            >
                                <MapPostCard
                                    post={post}
                                    isSelected={selectedPost?.id === post.id}
                                    onCardClick={handleCardClick}
                                    onCardHover={setHoveredPostId}
                                    onCardHoverEnd={() => setHoveredPostId(null)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    // Shared map panel content
    const mapPanelContent = (
                        <div className="h-full relative">
                            <GoogleMap
                                mapContainerStyle={mapContainerStyle}
                                center={initialCenterRef.current}
                                zoom={12}
                                options={mapOptions}
                                onLoad={(m) => { mapRef.current = m; }}
                                onUnmount={() => { mapRef.current = null; }}
                                onDragEnd={handleMapMoved}
                                onZoomChanged={handleMapMoved}
                            >
                                {clusters.map((cluster) =>
                                    cluster.posts.length === 1 ? (
                                        <MapPhotoMarkerOverlay
                                            key={cluster.id}
                                            post={cluster.posts[0]}
                                            isSelected={selectedPost?.id === cluster.posts[0].id}
                                            isHovered={hoveredPostId === cluster.posts[0].id}
                                            onClick={() => handleMarkerClick(cluster.posts[0])}
                                        />
                                    ) : (
                                        <MapClusterMarkerOverlay
                                            key={cluster.id}
                                            cluster={cluster}
                                            onClick={() => handleClusterClick(cluster)}
                                        />
                                    )
                                )}
                            </GoogleMap>

                            {/* Search this area pill */}
                            {showSearchPill && (
                                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
                                    <Button
                                        data-testid="search-area-pill"
                                        size="sm"
                                        variant="secondary"
                                        className="shadow-lg rounded-full gap-1.5 px-4"
                                        onClick={handleSearchThisArea}
                                    >
                                        <Search className="h-3.5 w-3.5" />
                                        Search this area
                                    </Button>
                                </div>
                            )}

                            <Button
                                size="icon"
                                onClick={getCurrentLocation}
                                className="absolute bottom-[35px] left-4 z-10 shadow-lg"
                                title="Go to my location"
                            >
                                <Navigation className="h-4 w-4" />
                            </Button>
                        </div>
    );

    return (
        <div className="h-[90vh] mx-2 flex flex-col">
            <div className="flex-1 rounded-lg overflow-hidden border">
                {/* On mobile: map on top, cards below. On desktop: cards left, map right. */}
                <ResizablePanelGroup direction={isMobile ? "vertical" : "horizontal"} className="h-full">
                    {isMobile ? (
                        <>
                            <ResizablePanel defaultSize={60} minSize={30} maxSize={80}>
                                {mapPanelContent}
                            </ResizablePanel>
                            <ResizableHandle withHandle />
                            <ResizablePanel defaultSize={40} minSize={20} maxSize={70}>
                                {cardPanelContent}
                            </ResizablePanel>
                        </>
                    ) : (
                        <>
                            <ResizablePanel defaultSize={25} minSize={25} maxSize={75}>
                                {cardPanelContent}
                            </ResizablePanel>
                            <ResizableHandle withHandle />
                            <ResizablePanel defaultSize={75} minSize={25} maxSize={75}>
                                {mapPanelContent}
                            </ResizablePanel>
                        </>
                    )}
                </ResizablePanelGroup>
            </div>
        </div>
    );
};

export default MapPostsView;
