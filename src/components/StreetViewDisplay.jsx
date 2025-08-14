import React from "react";

const StreetViewDisplay = ({ coords, width = "100%", height = "300px", heading = 0, pitch = 0, fov = 90 }) => {
    if (!coords || typeof coords._latitude !== "number" || typeof coords._longitude !== "number") {
        return null;
    }
    const { _latitude, _longitude } = coords;
    const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_MAPS_API_KEY;
    const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${_latitude},${_longitude}&heading=${heading}&pitch=${pitch}&fov=${fov}&key=${GOOGLE_MAPS_API_KEY}`;
    return (
        <div style={{ width, height }}>
            <img
                src={streetViewUrl}
                alt="Streeasdt View"
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
            />
        </div>
    );
};

export default StreetViewDisplay;
