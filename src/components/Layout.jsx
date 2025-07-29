import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Header from './Header.jsx';
import Home from './Home.jsx';
import UploadPost from "./UploadPost.jsx";
import useUiStore from "../stores/useUiStore.js";
import Profile from "./Profile.jsx";
import MapPostsView from "./MapPostsView.jsx"; // Import the new component
import {useAuthStore} from "../stores/useAuthStore.js";
import Sidebar from "./Sidebar.jsx";
import MobileBottomNavigation from "./BottomNavigation.jsx";

const HEADER_HEIGHT = 40;


function MainContent() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const activeSidebarItem = useUiStore((state) => state.activeSidebarItem);
    const activeProfileView = useUiStore((state) => state.activeProfileView);
    const currentUser = useAuthStore(state => state.user);

    const renderContent = () => {
        switch (activeSidebarItem) {
            case 'Home':
                return <Home />;
            case 'Profile':
                return <Profile targetUserId={activeProfileView || currentUser.uid} />;
            case 'Map':
                return <MapPostsView />;
            case 'Friends':
                return <Box>Friends Page Coming Soon...</Box>;
            case 'Upload':
                return <UploadPost>Upload Page Coming Soon...</UploadPost>;
            case 'Bookmarks':
                return <Box>Bookmarks Page Coming Soon...</Box>;
            default:
                return <Home />;
        }
    };

    return (
        <Box sx={{
            marginLeft: isMobile ? '0px' : '200px', // Remove left margin on mobile
            minHeight: `100vh`,
            backgroundColor: 'grey',
            padding: '20px',
            paddingBottom: isMobile ? '80px' : '20px' // Add bottom padding for mobile nav
        }}>
            {renderContent()}
        </Box>
    );
}

export default function Layout() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box>
            {/*<Header height={HEADER_HEIGHT} />*/}
            {!isMobile && <Sidebar />}
            <MainContent />
            {isMobile && <MobileBottomNavigation />}
        </Box>
    );
}
