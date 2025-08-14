import React, { useEffect, useRef } from "react";
const StreetViewDisplay = ({ coords, width = "100%", height = "300px" }) => {
    const streetRef = useRef(null);

    useEffect(() => {
    if (!coords || typeof coords._latitude !== "number" || typeof coords._longitude !== "number") return;

    const { _latitude, _longitude } = coords;
    const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_MAPS_API_KEY;
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.onload = () => {
    new window.google.maps.StreetViewPanorama(streetRef.current, {
            position: { lat: _latitude, lng: _longitude },
            pov: { heading: 0, pitch: 0 },
            zoom: 1,
        });
    };
    document.body.appendChild(script);

    return () => {
            document.body.removeChild(script);
        };
    }, [coords]);

    return <div ref={streetRef} style={{ width, height, borderRadius: "8px" }} />;
};

export default StreetViewDisplay;
