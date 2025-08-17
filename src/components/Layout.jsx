import React from 'react';
import { Outlet } from 'react-router-dom';
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

function MainContent() {
    const { theme, setTheme } = useTheme();

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