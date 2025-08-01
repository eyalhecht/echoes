import React from 'react';
import { Box } from '@mui/material';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar.jsx";
import Home from './Home.jsx';
import UploadPost from "./UploadPost.jsx";
import useUiStore from "../stores/useUiStore.js";
import Profile from "./Profile.jsx";
import MapPostsView from "./MapPostsView.jsx";
import { useAuthStore } from "../stores/useAuthStore.js";
import Bookmarks from "./Bookmarks.jsx";
import {ModeToggle} from "@/components/ModeToggle.jsx";

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
            case 'Map':
                return <MapPostsView />;
            case 'Friends':
                return <Box>Friends Page Coming Soon...</Box>;
            case 'Upload':
                return <UploadPost>Upload Page Coming Soon...</UploadPost>;
            case 'Bookmarks':
                return <Bookmarks/>;
            default:
                return <Home />;
        }
    };

    return (
        <main className="flex-1">
            <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <div className="h-4 w-px bg-border" />
                <h1 className="text-lg font-semibold">
                    {activeSidebarItem || 'Home'}
                </h1>
                <div className="ml-auto">
                    <ModeToggle />
                </div>
            </header>

            <div className="flex flex-1 flex-col gap-4">
                <Box sx={{
                    minHeight: `calc(100vh - 120px)`,
                    backgroundColor: 'black',
                    padding: '20px',
                }}>
                    {renderContent()}
                </Box>
            </div>
        </main>
    );
}

export default function Layout() {
    return (
        <SidebarProvider style={{
            "--sidebar-width": "12rem"
        }}>
            <AppSidebar />
            <MainContent />
        </SidebarProvider>
    );
}