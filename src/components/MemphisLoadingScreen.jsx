// src/components/MemphisLoadingScreen.jsx
import React from 'react';
import { Box, Typography, CircularProgress, styled, keyframes } from '@mui/material';

// Memphis-style animations
const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

// Memphis-style components
const MemphisLoadingContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFA500',
    position: 'relative',
    overflow: 'hidden',
}));

const FloatingShape = styled(Box)(({ delay = 0 }) => ({
    position: 'absolute',
    animation: `${bounce} 3s ease-in-out ${delay}s infinite`,
}));

const RotatingShape = styled(Box)(({ speed = 10 }) => ({
    position: 'absolute',
    animation: `${rotate} ${speed}s linear infinite`,
}));

const LoadingText = styled(Typography)(({ theme }) => ({
    fontFamily: '"Arial Black", sans-serif',
    fontSize: '32px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#000',
    textShadow: '4px 4px 0px #FF1493',
    letterSpacing: '-1px',
    zIndex: 10,
    marginBottom: '30px',
}));

const MemphisCircularProgress = styled(CircularProgress)(({ theme }) => ({
    '& .MuiCircularProgress-circle': {
        strokeLinecap: 'square',
        strokeWidth: 6,
    },
}));

// Main Component
const MemphisLoadingScreen = ({ text = "Loading Application...", subtext = "PLEASE WAIT" }) => {
    // Split text if needed
    const mainText = text.split(' ')[0] || "Loading";
    const secondaryText = text.split(' ').slice(1).join(' ') || "";

    return (
        <MemphisLoadingContainer>
            {/* Animated Memphis shapes */}
            <FloatingShape sx={{ top: 50, left: 100, delay: 0 }}>
                <Box
                    sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        backgroundColor: '#FF69B4',
                        border: '4px solid #000',
                    }}
                />
            </FloatingShape>

            <FloatingShape sx={{ bottom: 100, right: 150, delay: 0.5 }}>
                <Box
                    sx={{
                        width: 0,
                        height: 0,
                        borderLeft: '60px solid transparent',
                        borderRight: '60px solid transparent',
                        borderBottom: '100px solid #40E0D0',
                        filter: 'drop-shadow(3px 3px 0px #000)',
                    }}
                />
            </FloatingShape>

            <FloatingShape sx={{ top: 200, right: 100, delay: 1 }}>
                <Box
                    sx={{
                        width: 100,
                        height: 100,
                        backgroundColor: '#9370DB',
                        transform: 'rotate(45deg)',
                        border: '4px solid #000',
                    }}
                />
            </FloatingShape>

            <RotatingShape sx={{ bottom: 150, left: 80, speed: 8 }}>
                <Box
                    sx={{
                        width: 120,
                        height: 120,
                        backgroundImage: `repeating-conic-gradient(#000 0% 25%, #fff 0% 50%)`,
                        backgroundSize: '30px 30px',
                        opacity: 0.7,
                    }}
                />
            </RotatingShape>

            <Box
                sx={{
                    position: 'absolute',
                    top: '30%',
                    left: '10%',
                    width: 250,
                    height: 80,
                    backgroundColor: '#FFD700',
                    backgroundImage: `radial-gradient(circle, #000 2px, transparent 2px)`,
                    backgroundSize: '20px 20px',
                    transform: 'rotate(-15deg)',
                    border: '4px solid #000',
                    zIndex: 0,
                }}
            />

            <Box
                sx={{
                    position: 'absolute',
                    bottom: '25%',
                    right: '15%',
                    width: 200,
                    height: 50,
                    backgroundColor: '#87CEEB',
                    clipPath: 'polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%)',
                    border: '3px solid #000',
                    zIndex: 0,
                }}
            />

            {/* Main loading content */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    border: '5px solid #000',
                    p: 5,
                    position: 'relative',
                    zIndex: 10,
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        right: '-10px',
                        bottom: '-10px',
                        backgroundColor: '#32CD32',
                        zIndex: -1,
                    }
                }}
            >
                <LoadingText>{mainText}</LoadingText>
                {secondaryText && (
                    <LoadingText sx={{ fontSize: '24px', textShadow: '3px 3px 0px #00CED1', mb: 3 }}>
                        {secondaryText}
                    </LoadingText>
                )}

                <MemphisCircularProgress
                    size={60}
                    thickness={6}
                    sx={{
                        color: '#000',
                        mb: 3,
                    }}
                />

                <Typography
                    sx={{
                        fontFamily: '"Courier New", monospace',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        animation: `${pulse} 1.5s ease-in-out infinite`,
                    }}
                >
                    {subtext}
                </Typography>
            </Box>

            {/* Extra decorative elements */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 30,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: 1,
                    animation: `${pulse} 2s ease-in-out infinite`,
                }}
            >
                {[...Array(3)].map((_, i) => (
                    <Box
                        key={i}
                        sx={{
                            width: 15,
                            height: 15,
                            backgroundColor: i === 0 ? '#FF1493' : i === 1 ? '#40E0D0' : '#FFD700',
                            border: '2px solid #000',
                            animationDelay: `${i * 0.2}s`,
                        }}
                    />
                ))}
            </Box>
        </MemphisLoadingContainer>
    );
};

export default MemphisLoadingScreen;