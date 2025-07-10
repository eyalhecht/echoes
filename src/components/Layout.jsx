import React from 'react';
import { Box } from '@mui/material';
import Header from './Header.jsx';
import Home from './Home.jsx';
import UploadPost from "./UploadPost.jsx";
import useUiStore from "../stores/useUiStore.js";

const HEADER_HEIGHT = 40;

function Sidebar() {
    const activeSidebarItem = useUiStore((state) => state.activeSidebarItem);
    const setActiveSidebarItem = useUiStore((state) => state.setActiveSidebarItem);
    const items = ['Home', 'Profile', 'Friends', 'Upload', 'Settings'];

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
                    key={item}
                    onClick={() => setActiveSidebarItem(item)}
                    sx={{
                        padding: '16px',
                        cursor: 'pointer',
                        backgroundColor: activeSidebarItem === item ? '#e3f2fd' : 'transparent',
                    }}
                >
                    {item}
                </Box>
            ))}
        </Box>
    );
}

function MainContent() {
    const activeSidebarItem = useUiStore((state) => state.activeSidebarItem);

    const renderContent = () => {
        switch (activeSidebarItem) {
            case 'Home':
                return <Home />;
            case 'Profile':
                return <Box>Profile Page Coming Soon...</Box>;
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
