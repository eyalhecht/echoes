import React from 'react';
import { Box, Typography } from '@mui/material'; // Import Typography for consistent text styling
import useUiStore from "../stores/useUiStore.js";
import {useAuthStore} from "../stores/useAuthStore.js";

const HEADER_HEIGHT = 40;

function Sidebar() {
    const currentUser = useAuthStore(state => state.user);
    const activeSidebarItem = useUiStore((state) => state.activeSidebarItem);
    const setActiveSidebarItem = useUiStore((state) => state.setActiveSidebarItem);
    const setActiveProfileView = useUiStore((state) => state.setActiveProfileView);

    const items = [
        { name: 'Home', callback: () => {} },
        { name: 'Profile', callback: () => {
                setActiveProfileView(currentUser.uid)
            }},
        { name: 'Bookmarks', callback: () => {} },
        { name: 'Upload', callback: () => {} },
    ];

    return (
        <Box sx={{
            width: '220px',
            height: `calc(100vh - ${HEADER_HEIGHT}px)`,
            backgroundColor: '#1877f2',
            color: 'white',
            position: 'fixed',
            left: 0,
            top: HEADER_HEIGHT,
            boxShadow: '2px 0 4px rgba(0,0,0,0.1)' // Optional: add subtle shadow for depth
        }}>
            {items.map((item) => (
                <Box
                    key={item.name}
                    onClick={() => {
                        item.callback();
                        setActiveSidebarItem(item.name)
                    }}
                    sx={{
                        padding: '16px',
                        cursor: 'pointer',
                        backgroundColor: activeSidebarItem === item.name ? 'rgba(255, 255, 255, 0.15)' : 'transparent', // Slightly lighter tint for active
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                        fontWeight: activeSidebarItem === item.name ? 'bold' : 'normal',
                        transition: 'background-color 0.2s ease-in-out', // Smooth transition for hover/active
                    }}
                >
                    <Typography variant="body1" sx={{ color: 'inherit' }}>
                        {item.name}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
}

export default Sidebar;