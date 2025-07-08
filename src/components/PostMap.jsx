import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const PostMap = ({
                          center = { lat: 40.7128, lng: -74.0060 }, // Default to NYC
                          zoom = 15,
                          markers = [], // Array of marker objects with lat, lng, title, etc.
                          height = "400px",
                          width = "100%"
                      }) => {
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [map, setMap] = useState(null);

    const mapContainerStyle = {
        width: width,
        height: height
    };

    const options = {
        disableDefaultUI: true,
        zoomControl: false,
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

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_MAPS_API_KEY} >
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={zoom}
                options={options}
                onLoad={onLoad}
                onUnmount={onUnmount}

            >
                {/* Single Marker Example */}
                <Marker
                    position={center}
                    onClick={() => {
                        setSelectedMarker({
                            position: center,
                            title: "Main Location",
                            description: "This is the main pin location"
                        });
                    }}
                />

                {/* Multiple Markers Example */}
                {markers.map((marker, index) => (
                    <Marker
                        key={index}
                        position={{ lat: marker.lat, lng: marker.lng }}
                        title={marker.title}
                        onClick={() => setSelectedMarker(marker)}
                        icon={marker.icon || undefined} // Custom icon optional
                    />
                ))}

                {/* Info Window for Selected Marker */}
                {selectedMarker && (
                    <InfoWindow
                        position={selectedMarker.position || { lat: selectedMarker.lat, lng: selectedMarker.lng }}
                        onCloseClick={() => setSelectedMarker(null)}
                    >
                        <div>
                            <h3>{selectedMarker.title}</h3>
                            <p>{selectedMarker.description}</p>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </LoadScript>
    );
};

export default PostMap;