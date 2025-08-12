import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar.jsx";
import { SearchBar } from "@/components/SearchBar.jsx";
import Home from './Home.jsx';
import UploadPost from "./UploadPost.jsx";
import useUiStore from "../stores/useUiStore.js";
import Profile from "./Profile.jsx";
import MapPostsView from "./MapPostsView.jsx";
import { useAuthStore } from "../stores/useAuthStore.js";
import Bookmarks from "./Bookmarks.jsx";

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
                return (
                    <div className="flex items-center justify-center h-64">
                        <p className="text-muted-foreground">Friends Page Coming Soon...</p>
                    </div>
                );
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
                    <SearchBar />
                </div>
            </header>

            <div className="flex flex-1 flex-col">
                <div className="min-h-[calc(100vh-3rem)] p-5">
                    {renderContent()}
                </div>
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