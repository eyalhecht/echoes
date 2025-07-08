// src/components/MemphisBackgroundPattern.jsx
import React from 'react';
import { Box, styled } from '@mui/material';

// --- Memphis BACKGROUND SHAPE COMPONENTS (Moved from MainContent) ---

const MemphisCircle = styled(Box)(({ color, size = 60 }) => ({
    position: 'absolute',
    width: size,
    height: size,
    borderRadius: '50%',
    backgroundColor: color,
    boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
    zIndex: 0,
}));

const MemphisTriangle = styled(Box)(({ color, size = 50, rotation = 0 }) => ({
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeft: `${size / 2}px solid transparent`,
    borderRight: `${size / 2}px solid transparent`,
    borderBottom: `${size * (Math.sqrt(3) / 2)}px solid ${color}`, // Equilateral triangle
    transform: `rotate(${rotation}deg)`,
    boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
    zIndex: 0,
}));

const MemphisRectangle = styled(Box)(({ color, width = 80, height = 15, rotation = 0 }) => ({
    position: 'absolute',
    width: width,
    height: height,
    backgroundColor: color,
    transform: `rotate(${rotation}deg)`,
    boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
    zIndex: 0,
}));

const MemphisSquiggle = styled(Box)(({ color = '#000', size = 60, rotation = 0 }) => ({
    position: 'absolute',
    width: size,
    height: size,
    background: color,
    maskImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20"><path d="M0,10 Q25,0 50,10 T100,10" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round"/></svg>')`,
    maskSize: '100% 100%',
    maskRepeat: 'no-repeat',
    transform: `rotate(${rotation}deg)`,
    boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
    zIndex: 0,
}));

const MemphisDotCluster = styled(Box)(({ color = '#000', size = 80 }) => ({
    position: 'absolute',
    width: size,
    height: size,
    display: 'flex',
    flexWrap: 'wrap',
    overflow: 'hidden',
    zIndex: 0,
    '&::before': {
        content: '""',
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundImage: `radial-gradient(circle at 50% 50%, ${color} 2px, transparent 2.5px)`,
        backgroundSize: '15px 15px',
        opacity: 0.9,
    },
}));

const MemphisZigzag = styled(Box)(({ color = '#000', width = 100, height = 20 }) => ({
    position: 'absolute',
    width: width,
    height: height,
    background: color,
    clipPath: 'polygon(0 0, 10% 100%, 20% 0, 30% 100%, 40% 0, 50% 100%, 60% 0, 70% 100%, 80% 0, 90% 100%, 100% 0)',
    boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
    zIndex: 0,
}));

// Component that renders all the scattered Memphis elements
function MemphisBackgroundPattern() {
    return (
        <>
            {/* Circles */}
            <MemphisCircle color="#FFB6C1" size={70} sx={{ top: '10%', left: '5%', transform: 'rotate(10deg)' }} /> {/* Pink */}
            <MemphisCircle color="#A8DADC" size={80} sx={{ top: '60%', left: '20%', transform: 'rotate(-20deg)' }} /> {/* Teal/Mint */}
            <MemphisCircle color="#FFB6C1" size={50} sx={{ bottom: '5%', right: '15%', transform: 'rotate(5deg)' }} /> {/* Pink */}
            <MemphisCircle color="#A8DADC" size={60} sx={{ top: '30%', right: '5%', transform: 'rotate(25deg)' }} /> {/* Teal/Mint */}
            <MemphisCircle color="#FFB6C1" size={40} sx={{ top: '80%', left: '50%', transform: 'rotate(15deg)' }} /> {/* Pink */}

            {/* Triangles */}
            <MemphisTriangle color="#6CACE4" size={60} rotation={45} sx={{ top: '5%', right: '20%' }} /> {/* Light Blue */}
            <MemphisTriangle color="#FFD700" size={50} rotation={-30} sx={{ bottom: '10%', left: '5%' }} /> {/* Gold/Orange */}
            <MemphisTriangle color="#6CACE4" size={40} rotation={120} sx={{ top: '40%', left: '50%' }} /> {/* Light Blue */}
            <MemphisTriangle color="#FFB6C1" size={30} rotation={0} sx={{ top: '15%', left: '40%' }} /> {/* Small Pink */}

            {/* Rectangles/Dashes */}
            <MemphisRectangle color="#FFB6C1" width={100} height={18} rotation={20} sx={{ top: '20%', left: '10%' }} /> {/* Pink */}
            <MemphisRectangle color="#6CACE4" width={90} height={18} rotation={-15} sx={{ top: '70%', right: '10%' }} /> {/* Light Blue */}
            <MemphisRectangle color="#A8DADC" width={60} height={15} rotation={90} sx={{ bottom: '20%', left: '30%' }} /> {/* Vertical Teal */}

            {/* Squiggles */}
            <MemphisSquiggle color="#000" size={80} rotation={10} sx={{ top: '30%', left: '5%' }} /> {/* Black Squiggle */}
            <MemphisSquiggle color="#A8DADC" size={70} rotation={-20} sx={{ bottom: '30%', right: '5%' }} /> {/* Teal Squiggle */}

            {/* Dot Clusters */}
            <MemphisDotCluster color="#000" size={90} sx={{ top: '5%', left: '60%' }} /> {/* Black Dots */}
            <MemphisDotCluster color="#FFD700" size={70} sx={{ bottom: '50%', left: '5%' }} /> {/* Gold/Orange Dots */}
            <MemphisDotCluster color="#FF1493" size={60} sx={{ top: '25%', right: '30%' }} /> {/* Deep Pink Dots */}

            {/* Zigzags */}
            <MemphisZigzag color="#000" width={120} height={20} sx={{ top: '15%', right: '5%' }} /> {/* Black Zigzag */}
            <MemphisZigzag color="#6CACE4" width={100} height={15} sx={{ bottom: '10%', left: '60%', transform: 'rotate(-10deg)' }} /> {/* Blue Zigzag */}
        </>
    );
}

export default MemphisBackgroundPattern;