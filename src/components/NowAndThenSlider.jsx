import React, { useEffect, useRef, useState, useCallback } from 'react';

const NowAndThenSlider = ({
    imageUrl,
    coords,
    height = 400,
    initialHeading = 0,
    isAuthor = false,
    onHeadingSave,
}) => {
    const [sliderPct, setSliderPct] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [svStatus, setSvStatus] = useState('loading'); // 'loading' | 'ok' | 'error'
    const [currentHeading, setCurrentHeading] = useState(initialHeading);
    const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved'
    const containerRef = useRef(null);
    const streetViewRef = useRef(null);
    const panoramaRef = useRef(null);

    // More than 3° off from saved heading = user has rotated
    const headingDirty = svStatus === 'ok' && Math.abs(currentHeading - initialHeading) > 3;
    const hasCustomHeading = initialHeading !== 0;

    useEffect(() => {
        if (!coords || !streetViewRef.current || !window.google?.maps) return;

        const sv = new window.google.maps.StreetViewService();
        sv.getPanorama(
            { location: { lat: coords._latitude, lng: coords._longitude }, radius: 100 },
            (data, status) => {
                if (status !== window.google.maps.StreetViewStatus.OK) {
                    setSvStatus('error');
                    return;
                }

                const panorama = new window.google.maps.StreetViewPanorama(streetViewRef.current, {
                    position: { lat: coords._latitude, lng: coords._longitude },
                    pov: { heading: initialHeading, pitch: 0 },
                    zoom: 1,
                    addressControl: false,
                    showRoadLabels: false,
                    fullscreenControl: false,
                    zoomControl: true,
                });

                window.google.maps.event.addListenerOnce(panorama, 'pano_changed', () => {
                    setSvStatus('ok');
                    setCurrentHeading(Math.round(initialHeading));
                });

                panorama.addListener('pov_changed', () => {
                    setCurrentHeading(Math.round(panorama.getPov().heading + 360) % 360);
                });

                panoramaRef.current = panorama;
            }
        );

        return () => {
            if (panoramaRef.current) {
                window.google.maps.event.clearInstanceListeners(panoramaRef.current);
                panoramaRef.current.setVisible(false);
                panoramaRef.current = null;
            }
        };
    }, [coords, initialHeading]);

    const handleSaveHeading = async () => {
        if (!onHeadingSave || saveStatus === 'saving') return;
        setSaveStatus('saving');
        try {
            await onHeadingSave(currentHeading);
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2500);
        } catch {
            setSaveStatus('idle');
        }
    };

    const getSliderPct = useCallback((clientX) => {
        if (!containerRef.current) return sliderPct;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        return (x / rect.width) * 100;
    }, [sliderPct]);

    useEffect(() => {
        if (!isDragging) return;
        const onMove = (e) => setSliderPct(getSliderPct(e.clientX));
        const onUp = () => setIsDragging(false);
        const onTouchMove = (e) => { e.preventDefault(); setSliderPct(getSliderPct(e.touches[0].clientX)); };
        const onTouchEnd = () => setIsDragging(false);

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        window.addEventListener('touchmove', onTouchMove, { passive: false });
        window.addEventListener('touchend', onTouchEnd);
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
        };
    }, [isDragging, getSliderPct]);

    const rightClip = 100 - sliderPct;

    return (
        <div style={{ position: 'relative' }}>
            <div
                ref={containerRef}
                style={{
                    position: 'relative',
                    height,
                    overflow: 'hidden',
                    borderRadius: 8,
                    cursor: isDragging ? 'ew-resize' : 'default',
                    userSelect: 'none',
                    background: '#111',
                }}
            >
                {/* THEN — historical photo */}
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt="Then"
                        draggable={false}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            pointerEvents: 'none',
                        }}
                    />
                )}

                {/* NOW — street view, clipped to left portion */}
                <div
                    ref={streetViewRef}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        clipPath: `inset(0 ${rightClip}% 0 0)`,
                    }}
                />

                {/* Loading overlay */}
                {svStatus === 'loading' && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        clipPath: `inset(0 ${rightClip}% 0 0)`,
                        background: 'rgba(0,0,0,0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 5,
                    }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Loading street view…</span>
                    </div>
                )}

                {/* Error state */}
                {svStatus === 'error' && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        clipPath: `inset(0 ${rightClip}% 0 0)`,
                        background: '#1c1c1c',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        zIndex: 5,
                    }}>
                        <span style={{ fontSize: 28, opacity: 0.5 }}>📍</span>
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, textAlign: 'center', padding: '0 24px', lineHeight: 1.4 }}>
                            No street view available for this location
                        </span>
                    </div>
                )}

                {/* "Drag to rotate" hint — shown when no custom heading is saved yet */}
                {svStatus === 'ok' && !hasCustomHeading && !headingDirty && (
                    <div style={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        background: 'rgba(0,0,0,0.65)',
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: 4,
                        fontSize: 11,
                        pointerEvents: 'none',
                        zIndex: 15,
                        clipPath: `inset(0 ${rightClip}% 0 0)`,
                    }}>
                        ↔ Drag to rotate
                    </div>
                )}

                {/* Divider line + handle */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: `${sliderPct}%`,
                        width: 2,
                        transform: 'translateX(-50%)',
                        background: 'white',
                        boxShadow: '0 0 8px rgba(0,0,0,0.5)',
                        zIndex: 20,
                        cursor: 'ew-resize',
                    }}
                    onMouseDown={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onTouchStart={(e) => { e.preventDefault(); setIsDragging(true); }}
                >
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 38,
                        height: 38,
                        background: 'white',
                        borderRadius: '50%',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                    }}>
                        <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderRight: '5px solid #666' }} />
                        <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '5px solid #666' }} />
                    </div>
                </div>

                {/* THEN label */}
                <div style={{
                    position: 'absolute',
                    bottom: 10,
                    left: 10,
                    background: 'rgba(0,0,0,0.55)',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    pointerEvents: 'none',
                    zIndex: 10,
                }}>
                    THEN
                </div>

                {/* NOW label */}
                <div style={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    background: 'rgba(0,0,0,0.55)',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    pointerEvents: 'none',
                    zIndex: 10,
                }}>
                    NOW
                </div>
            </div>

            {/* Save heading bar — shown below the slider for post authors */}
            {isAuthor && svStatus === 'ok' && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: 8,
                    paddingTop: 8,
                    minHeight: 32,
                }}>
                    {headingDirty && saveStatus === 'idle' && (
                        <button
                            onClick={handleSaveHeading}
                            style={{
                                fontSize: 11,
                                padding: '3px 10px',
                                borderRadius: 4,
                                background: 'hsl(var(--primary))',
                                color: 'hsl(var(--primary-foreground))',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: 600,
                                letterSpacing: '0.02em',
                            }}
                        >
                            Save this angle
                        </button>
                    )}
                    {saveStatus === 'saving' && (
                        <span style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))' }}>Saving…</span>
                    )}
                    {saveStatus === 'saved' && (
                        <span style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))' }}>✓ Angle saved</span>
                    )}
                </div>
            )}
        </div>
    );
};

export default NowAndThenSlider;
