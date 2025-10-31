import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar.jsx";
import { SearchBar } from "@/components/SearchBar.jsx";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import PostDetailView from "./PostDetailView.jsx";
import useUiStore from "../stores/useUiStore.js";

// Custom hook to listen for URL changes including pushState/replaceState
function useURLSearchParams() {
    const [searchParams, setSearchParams] = useState(
        () => new URLSearchParams(window.location.search)
    );

    useEffect(() => {
        const handlePopState = () => {
            setSearchParams(new URLSearchParams(window.location.search));
        };

        // Listen for back/forward button
        window.addEventListener('popstate', handlePopState);

        // Override pushState and replaceState to trigger updates
        const originalPushState = window.history.pushState;
        const originalReplaceState = window.history.replaceState;

        window.history.pushState = function(...args) {
            originalPushState.apply(window.history, args);
            setSearchParams(new URLSearchParams(window.location.search));
        };

        window.history.replaceState = function(...args) {
            originalReplaceState.apply(window.history, args);
            setSearchParams(new URLSearchParams(window.location.search));
        };

        return () => {
            window.removeEventListener('popstate', handlePopState);
            window.history.pushState = originalPushState;
            window.history.replaceState = originalReplaceState;
        };
    }, []);

    return searchParams;
}

function MainContent() {
    const { theme, setTheme } = useTheme();
    const searchParams = useURLSearchParams(); // Use our custom hook instead
    const { getPost, fetchPost } = useUiStore();
    const [modalPostId, setModalPostId] = useState(null);
    const [modalPost, setModalPost] = useState(null);
    const [isLoadingModalPost, setIsLoadingModalPost] = useState(false);

    // Listen for URL parameter changes
    useEffect(() => {
        const postId = searchParams.get('post');
        if (postId) {
            setModalPostId(postId);
            
            // Try to find post in store first
            const existingPost = getPost(postId);
            if (existingPost) {
                setModalPost(existingPost);
            } else {
                // Fetch post if not in store
                setIsLoadingModalPost(true);
                fetchPost(postId)
                    .then((fetchedPost) => {
                        setModalPost(fetchedPost);
                    })
                    .catch((error) => {
                        console.error('Failed to fetch post for modal:', error);
                        // Close modal on error
                        setModalPostId(null);
                        setModalPost(null);
                    })
                    .finally(() => {
                        setIsLoadingModalPost(false);
                    });
            }
        } else {
            setModalPostId(null);
            setModalPost(null);
        }
    }, [searchParams, getPost, fetchPost]); // Now depends on searchParams instead of location.search

    const handleCloseModal = () => {
        // Remove post parameter from URL without navigating
        window.history.replaceState({}, '', window.location.pathname);
        
        setModalPostId(null);
        setModalPost(null);
    };

    return (
        <main className="flex-1">
            <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
            </div>
                <div className="flex-1 flex justify-center px-2 sm:px-4">
                    <SearchBar />
                </div>
                <div className="flex items-center justify-end">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                    className="h-8 w-8"
                                >
                                    {theme === "dark" ? (
                                        <Sun className="h-4 w-4" />
                                    ) : (
                                        <Moon className="h-4 w-4" />
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Switch to {theme === "dark" ? "light" : "dark"} mode</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </header>

            <div className="flex flex-1 flex-col">
                <div className="min-h-[calc(100vh-3rem)] p-5">
                    <Outlet />
                </div>
            </div>
            
            {modalPostId && modalPost && !isLoadingModalPost && (
                <PostDetailView 
                    post={modalPost} 
                    open={true} 
                    onClose={handleCloseModal}
                />
            )}
        </main>
    );
}

export default function Layout() {
    return (
        <SidebarProvider style={{
            "--sidebar-width": "18rem"
        }}>
            <AppSidebar />
            <MainContent />
        </SidebarProvider>
    );
}