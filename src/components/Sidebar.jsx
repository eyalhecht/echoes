// src/components/Sidebar.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveSidebarItem } from '../store/slices/uiSlice.js'; // Assuming you have this action
import {Box, Typography, styled} from '@mui/material';

const HEADER_HEIGHT = '40px';

// Main Sidebar Container with a bold, layered background
const MemphisSidebarContainer = styled(Box)(({ theme }) => ({
    width: '220px',
    height: `calc(100vh - ${HEADER_HEIGHT})`, // Occupy remaining vertical space
    backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#FFD700', // Gold/Yellow for main background
    position: 'fixed',
    left: 0,
    top: HEADER_HEIGHT,
    borderRight: '5px solid #000',
    overflowY: 'auto', // Enable scrolling if items exceed height
    boxShadow: '8px 0 15px rgba(0,0,0,0.3)',

    // Background pattern/shapes within the sidebar itself
    backgroundImage: `
        radial-gradient(circle at 10% 10%, ${theme.palette.secondary.main} 10px, transparent 11px),
        linear-gradient(135deg, ${theme.palette.info.light} 25%, transparent 25%) -100px 0,
        linear-gradient(135deg, ${theme.palette.info.light} 25%, transparent 25%) 100px 0,
        repeating-linear-gradient(-45deg, #FF69B4 0px 5px, transparent 5px 10px)
    `,
    backgroundSize: '30px 30px, 200px 200px, 200px 200px, 50px 50px',
    backgroundPosition: '50% 50%, 0 0, 100% 100%, 0 0',
    backgroundBlendMode: 'overlay, overlay, overlay, normal',
}));

// Styled component for each individual sidebar item
const MemphisSidebarItem = styled(Box)(({ theme, isActive }) => ({
    // Base styles
    fontFamily: '"Arial Black", sans-serif',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    padding: '16px 20px',
    margin: '10px 15px', // Spacing between items
    cursor: 'pointer',
    color: '#000', // Default text color
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    transition: 'all 0.2s ease-in-out',
    userSelect: 'none',

    // Memphis border/shadow effect
    border: '3px solid #000',
    boxShadow: '4px 4px 0px #000', // Offset shadow

    // Randomize background colors for visual variety
    backgroundColor: '#fff', // Fallback, will be overridden
    // Consider adding unique clip-paths for each item if you want more varied shapes

    '&:nth-of-type(odd)': {
        backgroundColor: '#87CEEB', // Sky Blue
        '&::after': { // Little decorative element for odd items
            content: '""',
            position: 'absolute',
            bottom: -5,
            right: -5,
            width: '15px',
            height: '15px',
            backgroundColor: '#FF1493', // Deep Pink
            border: '2px solid #000',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', // Triangle
        }
    },
    '&:nth-of-type(even)': {
        backgroundColor: '#40E0D0', // Turquoise
        '&::before': { // Little decorative element for even items
            content: '""',
            position: 'absolute',
            top: -5,
            left: -5,
            width: '15px',
            height: '15px',
            backgroundColor: '#FFD700', // Gold
            border: '2px solid #000',
            borderRadius: '50%', // Circle
        }
    },

    // Hover state
    '&:hover': {
        transform: 'translate(-3px, -3px)', // Lift slightly
        boxShadow: '7px 7px 0px #000', // More pronounced shadow
        // Keep background color the same on hover to maintain unique item colors
    },

    // Active state (similar to Login button active state)
    ...(isActive && {
        backgroundColor: '#FF69B4 !important', // Deep Pink for active, override others
        color: '#fff', // White text for active
        transform: 'translate(2px, 2px)', // Push in
        boxShadow: '2px 2px 0px #000', // Smaller shadow
        border: '3px solid #000', // Keep border
        '&::before, &::after': { // Hide decorative elements on active
            display: 'none',
        }
    }),
}));


function Sidebar() {
    const activeSidebarItem = useSelector(state => state.ui.activeSidebarItem);
    const dispatch = useDispatch();
    // Use an array of objects to potentially store icons or specific styles per item later
    const items = [
        { name: 'Home' },
        { name: 'Profile'},
        { name: 'Friends' },
        { name: 'Upload'},
        { name: 'Settings' },
    ];

    return (
        <MemphisSidebarContainer>
            {items.map((item) => (
                <MemphisSidebarItem
                    key={item.name}
                    isActive={activeSidebarItem === item.name}
                    onClick={() => dispatch(setActiveSidebarItem(item.name))}
                >
                    {item.name}
                </MemphisSidebarItem>
            ))}
        </MemphisSidebarContainer>
    );
}

export default Sidebar;