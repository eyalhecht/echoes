import React from 'react';
import { Box, Typography, useTheme } from '@mui/material'; // Import useTheme
import LogoutButton from "./LogoutButton.jsx"; // Assuming LogoutButton is styled separately or will inherit styles

function Header({height}) {
    return (
        <Box
            sx={{
                height: height + 'px',
                // Memphis Background: Vibrant base color with patterns
                backgroundColor: '#FF69B4', // Deep Pink base
                backgroundImage: `
                    repeating-linear-gradient(-45deg, #FFD700 0px 5px, transparent 5px 10px), /* Gold stripes */
                    radial-gradient(circle at 80% 20%, #40E0D0 15px, transparent 16px) /* Turquoise dot */
                `,
                backgroundSize: '40px 40px, 30px 30px',
                backgroundPosition: '0 0, 10% 90%',
                backgroundBlendMode: 'overlay, normal',

                color: '#000', // Black text for strong contrast
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 20px',
                // Stronger, more Memphis-like box shadow and border
                boxShadow: '0 5px 15px rgba(0,0,0,0.4), 0 0 0 5px #000', // Offset shadow with thick border effect
                borderBottom: '5px solid #000', // Explicit bottom border
            }}
        >
            {/* Logo */}
            <Typography
                component="div" // Use div as the root element for typography for more control
                sx={{
                    fontFamily: '"Arial Black", sans-serif',
                    fontSize: '2.5rem', // Larger, more impactful
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '-2px', // Tighten up for a punchy look
                    color: '#000', // Black text
                    textShadow: '5px 5px 0px #FFD700', // Gold offset shadow
                    userSelect: 'none',
                }}
            >
                Echoes
            </Typography>

            {/* Search Input */}
            <Box
                sx={{
                    flex: 1,
                    maxWidth: '400px',
                    margin: '0 20px',
                    position: 'relative', // For potential pseudo-elements or complex background
                    // A subtle Memphis pattern behind the search box
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 5,
                        left: 5,
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#B19CD9', // Light Purple
                        opacity: 0.7,
                        zIndex: -1,
                        transform: 'rotate(-5deg)',
                        borderRadius: '4px', // Slight corner for the background shape
                        border: '2px solid #000',
                    }
                }}
            >
                <input
                    type="text"
                    placeholder="Search for users or posts..." // More descriptive placeholder
                    style={{
                        width: '100%',
                        padding: '10px 15px', // Slightly more padding
                        borderRadius: '0', // Sharp corners
                        border: '3px solid #000', // Thick black border
                        outline: 'none',
                        fontSize: '16px', // Larger font
                        fontFamily: '"Courier New", monospace', // Monospace for a digital feel
                        backgroundColor: 'white', // White input background
                        boxShadow: '3px 3px 0px #000', // Small offset shadow on the input itself
                    }}
                />
            </Box>

            {/* Navigation Items (Notifications, Profile, Logout) */}
            <Box sx={{ display: 'flex', gap: '15px' }}> {/* Slightly reduced gap */}
                {['Notifications', 'Profile'].map((item) => (
                    <Box
                        key={item}
                        sx={{
                            padding: '10px 18px', // Increased padding for button-like feel
                            cursor: 'pointer',
                            borderRadius: '0', // Sharp corners
                            fontFamily: '"Arial Black", sans-serif',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            fontSize: '0.9rem',
                            letterSpacing: '1px',
                            border: '3px solid #000', // Thick border
                            boxShadow: '4px 4px 0px #000', // Offset shadow
                            transition: 'all 0.1s ease', // Smooth transition for hover

                            // Unique colors for each item
                            backgroundColor: item === 'Notifications' ? '#87CEEB' : '#40E0D0', // Sky Blue vs Turquoise
                            color: '#000', // Black text

                            '&:hover': {
                                transform: 'translate(-2px, -2px)', // Lift slightly
                                boxShadow: '6px 6px 0px #000', // More pronounced shadow
                            },
                            '&:active': {
                                transform: 'translate(2px, 2px)', // Press in
                                boxShadow: '2px 2px 0px #000', // Smaller shadow
                            },
                        }}
                    >
                        {item}
                    </Box>
                ))}
                {/* Logout Button (assuming it's either styled internally or will match the button style) */}
                <LogoutButton />
            </Box>
        </Box>
    );
}

export default Header;
