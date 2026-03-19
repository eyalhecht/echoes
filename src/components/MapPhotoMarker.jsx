import React, { memo, useState } from 'react';
import { OverlayView } from '@react-google-maps/api';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';

// ----- Tooltip -----
function MarkerTooltip({ post }) {
    const year = post.year?.[0] || post.AiMetadata?.date_estimate;
    const desc = post.description;
    if (!year && !desc) return null;
    return (
        <div
            style={{
                position: 'absolute',
                bottom: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginBottom: 8,
                zIndex: 999,
                pointerEvents: 'none',
            }}
            className="bg-popover border rounded-lg shadow-xl px-2.5 py-1.5 max-w-[160px] text-left"
        >
            {year && <p className="text-xs text-muted-foreground font-medium">{year}</p>}
            {desc && <p className="text-xs text-foreground line-clamp-2 mt-0.5 whitespace-normal">{desc}</p>}
        </div>
    );
}

// ----- Individual photo marker -----
const PhotoMarker = memo(function PhotoMarker({ isSelected, isHovered, post, onClick }) {
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const size = isSelected ? 56 : isHovered ? 48 : 40;

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setTooltipVisible(true)}
            onMouseLeave={() => setTooltipVisible(false)}
            style={{
                transform: 'translate(-50%, -100%)',
                cursor: 'pointer',
                position: 'relative',
                zIndex: isSelected ? 100 : isHovered ? 50 : 1,
                userSelect: 'none',
            }}
        >
            {tooltipVisible && <MarkerTooltip post={post} />}

            <div
                className={cn(
                    'rounded-full overflow-hidden shadow-lg transition-[width,height,border-width] duration-150',
                    isSelected ? 'border-[3px] border-primary' : 'border-2 border-white',
                )}
                style={{ width: size, height: size }}
            >
                {post.files?.[0] ? (
                    <img
                        src={post.files[0]}
                        className="w-full h-full object-cover pointer-events-none"
                        alt=""
                        draggable={false}
                    />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                )}
            </div>

            {/* pin tail dot */}
            <div className="flex justify-center -mt-1">
                <div
                    className={cn(
                        'w-2 h-2 rounded-full shadow-sm transition-colors duration-150',
                        isSelected ? 'bg-primary' : 'bg-white border border-gray-300',
                    )}
                />
            </div>
        </div>
    );
}, (prev, next) =>
    prev.isSelected === next.isSelected &&
    prev.isHovered === next.isHovered &&
    prev.post.id === next.post.id
);

// ----- Cluster marker -----
function ClusterMarkerContent({ cluster, onClick }) {
    const preview = cluster.posts[0];
    const count = cluster.posts.length;

    return (
        <div
            onClick={onClick}
            style={{
                transform: 'translate(-50%, -100%)',
                cursor: 'pointer',
                position: 'relative',
                zIndex: 10,
                userSelect: 'none',
            }}
            className="flex flex-col items-center"
        >
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-lg bg-muted">
                {preview?.files?.[0] && (
                    <img
                        src={preview.files[0]}
                        className="w-full h-full object-cover pointer-events-none"
                        alt=""
                        draggable={false}
                    />
                )}
                {/* overlay tint */}
                <div className="absolute inset-0 bg-black/30" />
                {/* count badge */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-sm drop-shadow-lg">{count}</span>
                </div>
            </div>

            {/* pin tail dot */}
            <div className="flex justify-center -mt-1">
                <div className="w-2.5 h-2.5 rounded-full bg-white border border-gray-300 shadow-sm" />
            </div>
        </div>
    );
}

// ----- Public exports -----

export function MapPhotoMarkerOverlay({ post, isSelected, isHovered, onClick }) {
    if (!post.location?._latitude || !post.location?._longitude) return null;
    return (
        <OverlayView
            position={{ lat: post.location._latitude, lng: post.location._longitude }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
            <PhotoMarker
                post={post}
                isSelected={isSelected}
                isHovered={isHovered}
                onClick={onClick}
            />
        </OverlayView>
    );
}

export function MapClusterMarkerOverlay({ cluster, onClick }) {
    return (
        <OverlayView
            position={{ lat: cluster.lat, lng: cluster.lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
            <ClusterMarkerContent cluster={cluster} onClick={onClick} />
        </OverlayView>
    );
}
