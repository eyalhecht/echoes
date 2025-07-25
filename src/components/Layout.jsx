import React from 'react';
import { Box } from '@mui/material';
import Header from './Header.jsx';
import Home from './Home.jsx';
import UploadPost from "./UploadPost.jsx";
import useUiStore from "../stores/useUiStore.js";
import Profile from "./Profile.jsx";
import {useAuthStore} from "../stores/useAuthStore.js";
import Sidebar from "./Sidebar.jsx";

const HEADER_HEIGHT = 40;


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
            case 'Bookmarks':
                return <Box>Bookmarks Page Coming Soon...</Box>;
            default:
                return <Home />;
        }
    };

    return (
        <Box sx={{
            marginLeft: '200px',
            // marginTop: `${HEADER_HEIGHT}px`,
            // minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
            minHeight: `100vh`,
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
            {/*<Header height={HEADER_HEIGHT} />*/}
            <Sidebar />
            <MainContent />
        </Box>
    );
}
