import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar.jsx";
import { SearchBar } from "@/components/SearchBar.jsx";

function MainContent() {

    return (
        <main className="flex-1">
            <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
            </div>
                <div className="flex-1 flex justify-center px-2 sm:px-4">
                    <SearchBar />
                </div>
                <div className="w-8 sm:w-32">
                </div>
            </header>

            <div className="flex flex-1 flex-col">
                <div className="min-h-[calc(100vh-3rem)] p-5">
                    <Outlet />
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