import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Check } from 'lucide-react';

const LocationPickerModal = ({ open, onClose, onSelectLocation, initialLocation }) => {
    const mapRef = useRef(null);
    const [selectedPosition, setSelectedPosition] = useState(
        initialLocation || { lat: 40.7128, lng: -74.0060 }
    );
    const [hasInteracted, setHasInteracted] = useState(false);

    const mapContainerStyle = {
        width: '100%',
        height: '400px'
    };

    const options = {
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: 'greedy',
        scrollwheel: true,
        restriction: {
            latLngBounds: {
                north: 85,
                south: -85,
                west: -180,
                east: 180,
            },
            strictBounds: true,
        },
    };

    const onLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    const onUnmount = useCallback(() => {
        mapRef.current = null;
    }, []);

    const onDragEnd = useCallback(() => {
        if (mapRef.current) {
            const newCenter = mapRef.current.getCenter();
            setSelectedPosition({
                lat: newCenter.lat(),
                lng: newCenter.lng(),
            });
            setHasInteracted(true);
        }
    }, []);

    const handleConfirmSelection = () => {
        onSelectLocation(selectedPosition);
        onClose();
    };

    const formatCoordinates = (lat, lng) => {
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        Select Location
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Current coordinates */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                            Selected coordinates:
                        </span>
                        <Badge variant="outline" className="font-mono">
                            {formatCoordinates(selectedPosition.lat, selectedPosition.lng)}
                        </Badge>
                    </div>

                    {/* Map Container */}
                    <div className="relative rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={selectedPosition}
                            zoom={15}
                            options={options}
                            onLoad={onLoad}
                            onUnmount={onUnmount}
                            onDragEnd={onDragEnd}
                        />

                        {/* Center Pin */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-10 pointer-events-none">
                            <MapPin
                                className={`h-8 w-8 text-red-500 drop-shadow-lg ${
                                    !hasInteracted ? 'animate-bounce' : ''
                                }`}
                            />
                        </div>

                        {/* Instruction overlay */}
                        {!hasInteracted && (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-black/80 text-white text-sm px-3 py-2 rounded-lg animate-pulse">
                                Drag map to position pin
                            </div>
                        )}

                        {/* Success indicator */}
                        {hasInteracted && (
                            <div className="absolute top-4 right-4 z-20 bg-green-500 text-white p-2 rounded-full animate-in fade-in-0 slide-in-from-top-2 duration-300">
                                <Check className="h-4 w-4" />
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmSelection}
                            disabled={!hasInteracted}
                            className="flex-1"
                        >
                            <MapPin className="h-4 w-4 mr-2" />
                            Confirm Location
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default LocationPickerModal;