import React, { useEffect, useRef } from "react";

const StreetViewDisplay = ({ coords, width = "100%", height = "300px" }) => {
    const streetRef = useRef(null);

    useEffect(() => {
        if (!coords || typeof coords._latitude !== "number" || typeof coords._longitude !== "number") return;
        if (!window.google?.maps) return;

        const panorama = new window.google.maps.StreetViewPanorama(streetRef.current, {
            position: { lat: coords._latitude, lng: coords._longitude },
            pov: { heading: 0, pitch: 0 },
            zoom: 1,
        });

        return () => {
            if (panorama) panorama.setVisible(false);
        };
    }, [coords]);

    return <div ref={streetRef} style={{ width, height, borderRadius: "8px" }} />;
};

export default StreetViewDisplay;
