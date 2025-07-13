import React from 'react';
import { Box } from '@mui/material';
import Header from './Header.jsx';
import Home from './Home.jsx';
import UploadPost from "./UploadPost.jsx";
import useUiStore from "../stores/useUiStore.js";
import Profile from "./Profile.jsx";
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
        { name: 'Friends', callback: () => {} },
        { name: 'Upload', callback: () => {} },
        { name: 'Settings', callback: () => {} },
    ];

    return (
        <Box sx={{
            width: '220px',
            height: '100vh',
            backgroundColor: 'grey',
            position: 'fixed',
            left: 0,
            top: HEADER_HEIGHT,
            borderRight: '1px solid #ddd'
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
                        backgroundColor: activeSidebarItem === item.name ? '#e3f2fd' : 'transparent',
                    }}
                >
                    {item.name}
                </Box>
            ))}
        </Box>
    );
}

function MainContent() {
    const activeSidebarItem = useUiStore((state) => state.activeSidebarItem);
    const activeProfileView = useUiStore((state) => state.activeProfileView);
    const currentUser = useAuthStore(state => state.user);

    const renderContent = () => {
        switch (activeSidebarItem) {
            case 'Home':
                return <Home />;
            case 'Profile':
                return <Profile targetUserId={activeProfileView || currentUser.uid} />;
            case 'Friends':
                return <Box>Friends Page Coming Soon...</Box>;
            case 'Upload':
                return <UploadPost>Upload Page Coming Soon...</UploadPost>;
            case 'Settings':
                return <Box>Settings Page Coming Soon...</Box>;
            default:
                return <Home />;
        }
    };

    return (
        <Box sx={{
            marginLeft: '200px',
            marginTop: `${HEADER_HEIGHT}px`,
            minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
            backgroundColor: 'grey',
            padding: '20px'
        }}>
            {renderContent()}
        </Box>
    );
}

export default function Layout() {
    return (
        <Box>
            <Header height={HEADER_HEIGHT} />
            <Sidebar />
            <MainContent />
        </Box>
    );
}
