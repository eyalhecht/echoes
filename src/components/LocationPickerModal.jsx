import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Box,
    Typography,
    Alert,
    Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InfoIcon from '@mui/icons-material/Info';
import PanToolIcon from '@mui/icons-material/PanTool';

const LocationPickerModal = ({ open, onClose, onSelectLocation, initialLocation }) => {
    const mapRef = useRef(null);
    const [selectedPosition, setSelectedPosition] = useState(
        initialLocation || { lat: 40.7128, lng: -74.0060 }
    );
    const [mapCenter, setMapCenter] = useState(
        initialLocation || { lat: 40.7128, lng: -74.0060 }
    );
    const [hasInteracted, setHasInteracted] = useState(false);

    const mapContainerStyle = {
        width: '100%',
        height: '500px'
    };

    const options = {
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: true,
        fullscreenControl: false,


        // STRICT RESTRICTION: Cannot pan beyond one world
        restriction: {
            latLngBounds: {
                north: 85,      // Almost to the poles
                south: -85,     // Almost to the poles
                west: -180,     // International Date Line
                east: 180,      // International Date Line
            },
            strictBounds: true, // TRUE = Cannot pan outside these bounds at all
        },

        // Additional options to improve UX
        gestureHandling: 'greedy', // One-finger pan on mobile
        scrollwheel: true,         // Enable scroll zoom
    };

    const onLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    const onUnmount = useCallback(() => {
        mapRef.current = null;
    }, []);

    // Handle map drag end to update the selected position
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
        return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon color="primary" />
                    Select Post Location
                </Box>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                {/* Instructions Section */}
                <Alert
                    severity="info"
                    icon={<InfoIcon />}
                    sx={{ mb: 2 }}
                >
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                        Choose the location that your post is about
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        This could be where a photo was taken, where an event happened,
                        or any location relevant to your post content.
                    </Typography>
                </Alert>

                {/* How to use instructions */}
                <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <PanToolIcon fontSize="small" color="primary" />
                        <Typography variant="subtitle2" color="primary">
                            How to select location:
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 3 }}>
                        • The red pin indicates your chosen location
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 3 }}>
                        • Drag the map to move the red pin to your desired location
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 3 }}>
                        • Scroll or use zoom controls (+/-) to get a better view
                    </Typography>
                </Box>

                {/* Current coordinates display */}
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography variant="body2" color="text.secondary">
                        Selected coordinates:
                    </Typography>
                    <Chip
                        label={formatCoordinates(selectedPosition.lat, selectedPosition.lng)}
                        size="small"
                        color={hasInteracted ? "primary" : "default"}
                        variant="outlined"
                    />
                    {!hasInteracted && (
                        <Typography variant="caption" color="text.secondary">
                            (Default location - drag map to change)
                        </Typography>
                    )}
                </Box>
                {/* Success message when location is selected */}
                {hasInteracted && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                        <Typography variant="body2">
                            Great! You've positioned the pin. Click "Confirm Location" to save this selection.
                        </Typography>
                    </Alert>
                )}

                {/* Map Container */}
                <Box sx={{ width: '100%', height: '500px', position: 'relative', border: '2px dashed', borderColor: 'grey.300', borderRadius: 1 }}>
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={mapCenter}
                        zoom={15}
                        options={options}
                        onLoad={onLoad}
                        onUnmount={onUnmount}
                        onDragEnd={onDragEnd}
                    />

                    {/* Static pin in the center of the map */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -100%)',
                            zIndex: 10,
                            pointerEvents: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <LocationOnIcon
                            sx={{
                                fontSize: '3rem',
                                color: 'error.main',
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                                animation: hasInteracted ? 'none' : 'pulse 2s infinite'
                            }}
                        />
                        <Box
                            sx={{
                                width: 15,
                                height: 15,
                                borderRadius: '50%',
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                marginTop: '-8px',
                                filter: 'blur(2px)'
                            }}
                        />
                    </Box>

                    {/* Floating instruction overlay (shows until user interacts) */}
                    {!hasInteracted && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 20,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                zIndex: 15,
                                backgroundColor: 'rgba(0,0,0,0.8)',
                                color: 'white',
                                px: 2,
                                py: 1,
                                borderRadius: 1,
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                animation: 'fadeInOut 3s infinite'
                            }}
                        >
                            <PanToolIcon fontSize="small" />
                            Drag the map to position the pin
                        </Box>
                    )}
                </Box>


            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="secondary" variant="outlined">
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirmSelection}
                    color="primary"
                    variant="contained"
                    disabled={!hasInteracted}
                    startIcon={<LocationOnIcon />}
                >
                    Confirm Location
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LocationPickerModal;