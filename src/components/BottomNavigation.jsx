import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useUiStore from "../stores/useUiStore.js";
import { useAuthStore } from "../stores/useAuthStore.js";

// Import MUI outlined icons (same as sidebar)
import {
    HomeOutlined,
    PersonOutlined,
    MapOutlined,
    BookmarkBorderOutlined,
    AddOutlined
} from '@mui/icons-material';

function MobileBottomNavigation() {
    const navigate = useNavigate();
    const currentUser = useAuthStore(state => state.user);
    const activeSidebarItem = useUiStore((state) => state.activeSidebarItem);
    const setActiveSidebarItem = useUiStore((state) => state.setActiveSidebarItem);
    const setActiveProfileView = useUiStore((state) => state.setActiveProfileView);

    const navigationItems = [
        {
            name: 'Home',
            icon: <HomeOutlined />,
            callback: () => {}
        },
        {
            name: 'Profile',
            icon: <PersonOutlined />,
            callback: () => {
                setActiveProfileView(currentUser.uid)
            }
        },
        {
            name: 'Upload',
            icon: <AddOutlined />,
            callback: () => {}
        },
        {
            name: 'Map',
            icon: <MapOutlined />,
            callback: () => {}
        },
        {
            name: 'Bookmarks',
            icon: <BookmarkBorderOutlined />,
            callback: () => {}
        }
    ];

    const handleChange = (event, newValue) => {
        const selectedItem = navigationItems[newValue];
        selectedItem.callback();
        setActiveSidebarItem(selectedItem.name);
    };

    const activeIndex = navigationItems.findIndex(item => item.name === activeSidebarItem);

    return (
        <Paper 
            sx={{ 
                position: 'fixed', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                zIndex: 1000,
                borderTop: '1px solid #e0e0e0'
            }} 
            elevation={3}
        >
            <BottomNavigation
                value={activeIndex}
                onChange={handleChange}
                sx={{
                    height: '60px',
                    '& .MuiBottomNavigationAction-root': {
                        minWidth: 'auto',
                        fontSize: '12px'
                    }
                }}
            >
                {navigationItems.map((item, index) => (
                    <BottomNavigationAction
                        key={item.name}
                        label={item.name}
                        icon={item.icon}
                        sx={{
                            '&.Mui-selected': {
                                color: '#8B4513'
                            }
                        }}
                    />
                ))}
            </BottomNavigation>
        </Paper>
    );
}

export default MobileBottomNavigation;