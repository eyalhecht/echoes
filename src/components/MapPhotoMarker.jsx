import React, { memo } from 'react';
import { OverlayView } from '@react-google-maps/api';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';

// Rendered as an OverlayView child — must not use hooks that depend on render order
const PhotoMarker = memo(function PhotoMarker({ isSelected, isHovered, post, onClick }) {
    const size = isSelected ? 56 : isHovered ? 48 : 40;

    return (
        <div
            onClick={onClick}
            style={{
                transform: 'translate(-50%, -100%)',
                cursor: 'pointer',
                position: 'relative',
                zIndex: isSelected ? 100 : isHovered ? 50 : 1,
                userSelect: 'none',
            }}
        >
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
                        isSelected
                            ? 'bg-primary'
                            : 'bg-white border border-gray-300',
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

// Wraps PhotoMarker in an OverlayView so it can be used inside <GoogleMap>
export default function MapPhotoMarkerOverlay({ post, isSelected, isHovered, onClick }) {
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
