import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { callApiGateway } from '../firebaseConfig.js';

// Google Maps component using your existing PostMap structure
const MapComponent = ({ center, zoom, posts, onMarkerClick, onBoundsChanged }) => {    const [map, setMap] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null);

    const mapContainerStyle = {
        width: '100%',
        height: '100%'
    };
console.log("render")
    const options = {
        disableDefaultUI: true,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
    };

    const onLoad = useCallback((map) => {
        setMap(map);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    // Handle map bounds change (when user pans/zooms)
    const onBoundsChanged2 = useCallback(() => { // <--- THIS `onBoundsChanged` is a new local constant
        if (map) {
            const bounds = map.getBounds();
            const center = map.getCenter();
            const zoom = map.getZoom();

            if (bounds && center) {
                const ne = bounds.getNorthEast();
                const sw = bounds.getSouthWest();

                // Calculate approximate radius from bounds
                const latDiff = ne.lat() - sw.lat();
                const lngDiff = ne.lng() - sw.lng();
                const radiusKm = Math.max(latDiff, lngDiff) * 111 / 2; // Rough conversion to km

                // !!! PROBLEM LINE !!!
                // You are calling the `onBoundsChanged` local constant here,
                // but you intend to call the `onBoundsChanged` prop.
                // The local constant `onBoundsChanged` is being defined at this very moment,
                // so it's not fully initialized yet when you try to use it within itself.
                onBoundsChanged({
                    center: { lat: center.lat(), lng: center.lng() },
                    radiusKm: Math.min(Math.max(radiusKm, 1), 50) // Clamp between 1-50km
                });
            }
        }
    }, []); //
    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={zoom}
            options={options}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onBoundsChanged={onBoundsChanged2}
            onDragEnd={onBoundsChanged2}
            onZoomChanged={onBoundsChanged2}
        >
            {/* Post Markers */}
            {posts.map((post, index) => (
                post.location && post.location._latitude && post.location._longitude && (
                    <Marker
                        key={post.id}
                        position={{
                            lat: post.location._latitude,
                            lng: post.location._longitude
                        }}
                        title={post.userDisplayName}
                        onClick={() => {
                            setSelectedMarker(post);
                            onMarkerClick(post);
                        }}
                        icon={{
                            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="16" cy="12" r="8" fill="#ff4444" stroke="white" stroke-width="2"/>
                                    <path d="M16 4 L16 20 L8 12 Z" fill="#ff4444"/>
                                    <text x="16" y="16" text-anchor="middle" fill="white" font-size="12">📷</text>
                                </svg>
                            `),
                            scaledSize: new window.google.maps.Size(32, 32),
                            anchor: new window.google.maps.Point(16, 32)
                        }}
                    />
                )
            ))}

            {/* Info Window for Selected Marker */}
            {selectedMarker && (
                <InfoWindow
                    position={{
                        lat: selectedMarker.location._latitude,
                        lng: selectedMarker.location._longitude
                    }}
                    onCloseClick={() => setSelectedMarker(null)}
                >
                    <div style={{ maxWidth: '200px' }}>
                        <h4 style={{ margin: '0 0 8px 0' }}>{selectedMarker.userDisplayName}</h4>
                        <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
                            {selectedMarker.description.substring(0, 100)}
                            {selectedMarker.description.length > 100 ? '...' : ''}
                        </p>
                        {selectedMarker.files && selectedMarker.files[0] && (
                            <img
                                src={selectedMarker.files[0]}
                                alt="Post preview"
                                style={{
                                    width: '100%',
                                    height: '80px',
                                    objectFit: 'cover',
                                    borderRadius: '4px',
                                    marginBottom: '8px'
                                }}
                            />
                        )}
                        <div style={{ fontSize: '12px', color: '#666' }}>
                            {selectedMarker.distanceKm?.toFixed(1)}km away • {selectedMarker.likesCount || 0} likes
                        </div>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
};

const PostPreviewCard = ({ post, onClick }) => (
    <div
        style={{
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            marginBottom: '16px'
        }}
        onClick={() => onClick(post)}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
        }}
    >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 16px 8px 16px' }}>
            <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#ccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px',
                fontSize: '14px',
                fontWeight: 'bold',
                color: 'white'
            }}>
                {post.userDisplayName?.charAt(0) || 'U'}
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                    {post.userDisplayName || 'Anonymous'}
                </div>
                <div style={{ color: '#666', fontSize: '12px' }}>
                    {post.distanceKm?.toFixed(1)}km away
                </div>
            </div>
        </div>

        {/* Image */}
        {post.files && post.files[0] && (
            <img
                src={post.files[0]}
                alt="Post preview"
                style={{
                    width: '100%',
                    height: '120px',
                    objectFit: 'cover',
                    display: 'block'
                }}
            />
        )}

        {/* Content */}
        <div style={{ padding: '12px 16px 16px 16px' }}>
            <p style={{
                margin: '0 0 12px 0',
                fontSize: '14px',
                lineHeight: '1.4',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
            }}>
                {post.description}
            </p>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{
                    backgroundColor: '#f0f0f0',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    border: '1px solid #ddd'
                }}>
                    {post.likesCount || 0} likes
                </span>
                {post.year && post.year.length > 0 && (
                    <span style={{
                        backgroundColor: '#e3f2fd',
                        color: '#1976d2',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        border: '1px solid #90caf9'
                    }}>
                        {post.year.join(', ')}
                    </span>
                )}
            </div>
        </div>
    </div>
);

const LoadingSpinner = () => (
    <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: '8px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: 1000
    }}>
        <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid #f3f3f3',
            borderTop: '2px solid #1976d2',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
        }}></div>
        <span style={{ fontSize: '14px' }}>Loading posts...</span>
        <style>{`
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `}</style>
    </div>
);

const MapPostsView = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    // Map state
    const [mapCenter, setMapCenter] = useState({ lat: 40.7589, lng: -73.9851 }); // NYC default
    const [mapZoom, setMapZoom] = useState(12);
    const [radiusKm, setRadiusKm] = useState(5);
    const [postType, setPostType] = useState('all');

    // Debounce timer
    const debounceTimer = useRef(null);

    // Real API call using your callApiGateway
    const fetchPostsByLocation = useCallback(async (center, radius) => {
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
            console.log('Got posts for:',  response);

            let filteredPosts = response.data.posts;

            // Apply post type filter
            if (postType !== 'all') {
                filteredPosts = filteredPosts.filter(post => post.type === postType);
            }

            setPosts(filteredPosts);
        } catch (err) {
            console.error('Error fetching posts by location:', err);
            setError('Failed to load posts for this area');
        } finally {
            setLoading(false);
        }
    }, [postType]);

    const debouncedFetchPosts = useCallback((center, radius) => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            fetchPostsByLocation(center, radius);
        }, 1000);
    }, [fetchPostsByLocation]);

    const handleBoundsChanged = useCallback((newBounds) => {
        setMapCenter(newBounds.center);
        const newRadius = newBounds.radiusKm || radiusKm;
        setRadiusKm(newRadius);
        debouncedFetchPosts(newBounds.center, newRadius);
    }, [radiusKm, debouncedFetchPosts]);

    const handleMarkerClick = (post) => {
        setSelectedPost(post);
        console.log('Marker clicked:', post.userDisplayName);
    };

    const handlePostPreviewClick = (post) => {
        setSelectedPost(post);
        console.log('Post preview clicked:', post.userDisplayName);
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newCenter = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setMapCenter(newCenter);
                    fetchPostsByLocation(newCenter, radiusKm);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setError('Could not get your location');
                }
            );
        } else {
            setError('Geolocation is not supported by this browser');
        }
    };

    // Initial load
    useEffect(() => {
        fetchPostsByLocation(mapCenter, radiusKm);
    }, []);

    // Handle filter changes
    useEffect(() => {
        if (posts.length > 0) {
            fetchPostsByLocation(mapCenter, radiusKm);
        }
    }, [postType]);

    return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <div style={{
                    padding: '16px',
                    backgroundColor: '#f5f1e8',
                    borderBottom: '1px solid #e8dcc0'
                }}>
                    <h2 style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>
                        Explore Posts by Location
                    </h2>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                        Discover posts from around the world • {posts.length} posts in this area
                    </p>
                </div>

                {/* Main Content */}
                <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                    {/* Map Section */}
                    <div style={{ flex: 2, position: 'relative' }}>
                        <MapComponent
                            center={mapCenter}
                            zoom={mapZoom}
                            posts={posts}
                            onBoundsChanged={handleBoundsChanged}
                            onMarkerClick={handleMarkerClick}
                        />

                        {/* Loading overlay */}
                        {loading && <LoadingSpinner />}

                        {/* Error overlay */}
                        {error && (
                            <div style={{
                                position: 'absolute',
                                top: '16px',
                                left: '16px',
                                right: '16px',
                                backgroundColor: '#ffebee',
                                border: '1px solid #f44336',
                                borderRadius: '8px',
                                padding: '12px',
                                color: '#c62828',
                                zIndex: 1000
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>{error}</span>
                                    <button
                                        onClick={() => setError(null)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '16px'
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Control buttons */}
                        <button
                            onClick={getCurrentLocation}
                            style={{
                                position: 'absolute',
                                bottom: '80px',
                                right: '16px',
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                backgroundColor: '#1976d2',
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                fontSize: '18px',
                                zIndex: 1000
                            }}
                            title="Get current location"
                        >
                            📍
                        </button>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            style={{
                                position: 'absolute',
                                bottom: '16px',
                                right: '16px',
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                backgroundColor: '#1976d2',
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                fontSize: '18px',
                                zIndex: 1000
                            }}
                            title="Open filters"
                        >
                            ⚙️
                        </button>
                    </div>

                    {/* Posts Sidebar - keeping same as before */}
                    <div style={{
                        flex: 1,
                        backgroundColor: '#fafafa',
                        borderLeft: '1px solid #e0e0e0',
                        overflow: 'auto',
                        padding: '16px'
                    }}>
                        <h3 style={{ margin: '0 0 16px 0', fontWeight: 'bold' }}>
                            Posts in Area ({posts.length})
                        </h3>

                        {posts.length === 0 && !loading ? (
                            <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                                <p style={{ margin: '0 0 8px 0', color: '#666' }}>
                                    No posts found in this area
                                </p>
                                <p style={{ margin: 0, color: '#999', fontSize: '12px' }}>
                                    Try zooming out or moving to a different location
                                </p>
                            </div>
                        ) : (
                            posts.map(post => (
                                <PostPreviewCard
                                    key={post.id}
                                    post={post}
                                    onClick={handlePostPreviewClick}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Filter Panel and other modals remain the same as before */}
                {showFilters && (
                    <div style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '24px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        zIndex: 1001,
                        minWidth: '300px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ margin: 0 }}>Map Filters</h3>
                            <button
                                onClick={() => setShowFilters(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '18px'
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                                Search Radius: {radiusKm}km
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="50"
                                value={radiusKm}
                                onChange={(e) => setRadiusKm(Number(e.target.value))}
                                onMouseUp={() => fetchPostsByLocation(mapCenter, radiusKm)}
                                style={{ width: '100%' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
                                <span>1km</span>
                                <span>25km</span>
                                <span>50km</span>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                                Post Type
                            </label>
                            <select
                                value={postType}
                                onChange={(e) => setPostType(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px'
                                }}
                            >
                                <option value="all">All Types</option>
                                <option value="photo">Photos</option>
                                <option value="video">Videos</option>
                                <option value="document">Documents</option>
                                <option value="item">Items</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Background overlay for modals */}
                {(showFilters || selectedPost) && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            zIndex: 1000
                        }}
                        onClick={() => {
                            setShowFilters(false);
                            setSelectedPost(null);
                        }}
                    />
                )}
            </div>
    );
};

export default MapPostsView;