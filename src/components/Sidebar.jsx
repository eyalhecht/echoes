import React from 'react';
import { Box, Typography, Avatar, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useUiStore from "../stores/useUiStore.js";
import {useAuthStore} from "../stores/useAuthStore.js";
import {
    HomeOutlined,
    PersonOutlined,
    MapOutlined,
    BookmarkBorderOutlined,
    AddOutlined,
    LogoutOutlined
} from '@mui/icons-material';

function Sidebar() {
    const navigate = useNavigate();
    const currentUser = useAuthStore(state => state.user);
    const { loading } = useAuthStore();
    const activeSidebarItem = useUiStore((state) => state.activeSidebarItem);
    const setActiveSidebarItem = useUiStore((state) => state.setActiveSidebarItem);
    const setActiveProfileView = useUiStore((state) => state.setActiveProfileView);

    const handleLogout = async () => {
        try {
            await useAuthStore.getState().logout();
            navigate('/login');
        } catch (err) {
            console.error("Logout component caught error:", err);
        }
    };

    const items = [
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
            name: 'Map',
            icon: <MapOutlined />,
            callback: () => {}
        },
        {
            name: 'Bookmarks',
            icon: <BookmarkBorderOutlined />,
            callback: () => {}
        },
    ];

    const actionItems = [
        {
            name: 'Upload',
            icon: <AddOutlined/>,
            callback: () => {}
        },
        {
            name: 'Logout',
            icon: <LogoutOutlined/>,
            callback: handleLogout,
            isLoading: loading
        },
    ];

    return (
        <Box sx={{
            width: '220px',
            height: '100vh',
            backgroundColor: '#f5f1e8',
            color: '#2d2d2d',
            position: 'fixed',
            left: 0,
            top: 0,
            padding: '20px 0',
            overflow: 'hidden'
        }}>
            <Box sx={{
                padding: '0 24px 24px 24px',
                borderBottom: '1px solid #e8dcc0',
                marginBottom: '16px'
            }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 'bold',
                        color: '#2d2d2d',
                        fontSize: '18px',
                        letterSpacing: '0.5px'
                    }}
                >
                    ECHOES
                </Typography>
                <Typography
                    variant="caption"
                    sx={{
                        color: '#666',
                        fontSize: '12px'
                    }}
                >
                    Your social workspace
                </Typography>
            </Box>

            <Box sx={{ marginBottom: '24px' }}>
                {items.map((item) => (
                    <Box
                        key={item.name}
                        onClick={() => {
                            item.callback();
                            setActiveSidebarItem(item.name);
                        }}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px 24px',
                            cursor: 'pointer',
                            backgroundColor: activeSidebarItem === item.name ? '#e8dcc0' : 'transparent',
                            borderLeft: activeSidebarItem === item.name ? '3px solid #8B4513' : '3px solid transparent',
                            '&:hover': {
                                backgroundColor: '#e8dcc0',
                            },
                            transition: 'all 0.2s ease-in-out',
                            position: 'relative'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                            <Box sx={{
                                color: activeSidebarItem === item.name ? '#2d2d2d' : '#555',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                {item.icon}
                            </Box>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: activeSidebarItem === item.name ? '#2d2d2d' : '#555',
                                    fontWeight: activeSidebarItem === item.name ? '600' : '400',
                                    fontSize: '16px'
                                }}
                            >
                                {item.name}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>

            <Box sx={{
                height: '1px',
                backgroundColor: '#e8dcc0',
                margin: '16px 24px'
            }} />

            <Box>
                {actionItems.map((item) => (
                    <Box
                        key={item.name}
                        onClick={() => {
                            item.callback();
                            if (item.name !== 'Logout') {
                                setActiveSidebarItem(item.name);
                            }
                        }}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px 24px',
                            cursor: item.isLoading ? 'not-allowed' : 'pointer',
                            opacity: item.isLoading ? 0.6 : 1,
                            '&:hover': {
                                backgroundColor: item.isLoading ? 'transparent' : '#e8dcc0',
                            },
                            transition: 'background-color 0.2s ease-in-out',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {item.isLoading ? (
                                <CircularProgress size={14} sx={{ color: '#8B4513' }} />
                            ) : (
                                <Box sx={{ 
                                    color: '#8B4513',
                                    display: 'flex',
                                    alignItems: 'center' 
                                }}>
                                    {item.icon}
                                </Box>
                            )}
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#8B4513',
                                    fontSize: '15px',
                                    fontWeight: '500'
                                }}
                            >
                                {item.isLoading && item.name === 'Logout' ? 'Logging out...' : item.name}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

export default Sidebar;