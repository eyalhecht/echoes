import React, { useEffect, useState } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
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
import GuestBanner from "./GuestBanner.jsx";
import WelcomeModal from "./WelcomeModal.jsx";

function MainContent() {
    const { theme, setTheme } = useTheme();
    const [searchParams, setSearchParams] = useSearchParams();
    const { getPost, fetchPost } = useUiStore();
    const [modalPost, setModalPost] = useState(null);
    const [isLoadingModalPost, setIsLoadingModalPost] = useState(false);

    const postId = searchParams.get('post');

    useEffect(() => {
        if (!postId) {
            setModalPost(null);
            return;
        }

        const existingPost = getPost(postId);
        if (existingPost) {
            setModalPost(existingPost);
            return;
        }

        setIsLoadingModalPost(true);
        fetchPost(postId)
            .then((fetchedPost) => setModalPost(fetchedPost))
            .catch((error) => {
                console.error('Failed to fetch post for modal:', error);
                setSearchParams(prev => {
                    const next = new URLSearchParams(prev);
                    next.delete('post');
                    return next;
                });
            })
            .finally(() => setIsLoadingModalPost(false));
    }, [postId, getPost, fetchPost, setSearchParams]);

    const handleCloseModal = () => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.delete('post');
            return next;
        }, { replace: true });
    };

    return (
        <main className="flex-1">
            <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4 bg-background">
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

            <GuestBanner />

            <div className="flex flex-1 flex-col">
                <div className="min-h-[calc(100vh-3rem)] p-5">
                    <Outlet />
                </div>
            </div>

            <WelcomeModal />

            {postId && modalPost && !isLoadingModalPost && (
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