import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Box, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const LocationPickerModal = ({ open, onClose, onSelectLocation, initialLocation }) => {
    const mapRef = useRef(null);
    const [selectedPosition, setSelectedPosition] = useState(
        initialLocation || { lat: 40.7128, lng: -74.0060 }
    );
    const [mapCenter, setMapCenter] = useState(
        initialLocation || { lat: 40.7128, lng: -74.0060 }
    );


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
        }
    }, []);

    const handleConfirmSelection = () => {
        onSelectLocation(selectedPosition);
        onClose();
    };

    console.log("re")

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Select Location
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
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        Drag the map to position the pin at your desired location
                    </Typography>
                </Box>

                <Box sx={{ width: '100%', height: '500px', position: 'relative' }}>
                    <LoadScript googleMapsApiKey={"AIzaSyCTki4LpvWWJ-iFsHViXDL3VE0pk3tOiIU"}>
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={mapCenter}
                            zoom={15}
                            options={options}
                            onLoad={onLoad}
                            onUnmount={onUnmount}
                            onDragEnd={onDragEnd}
                        />
                    </LoadScript>

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
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
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
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleConfirmSelection} color="primary" variant="contained">
                    Confirm Location
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default LocationPickerModal;