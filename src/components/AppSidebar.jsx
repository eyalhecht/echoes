import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator, 
    useSidebar,
} from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Home,
    User,
    MapPin,
    Bookmark,
    Upload,
    LogOut,
    Loader2,
    Settings,
    Moon,
    Sun,
    Search
} from "lucide-react"
import { useNavigate, useLocation } from 'react-router-dom'
import useUiStore from "../stores/useUiStore.js"
import { useAuthStore } from "../stores/useAuthStore.js"
import { useTheme } from "@/components/theme-provider"
import { useState } from "react"

export function AppSidebar() {
    const navigate = useNavigate()
    const location = useLocation()
    const currentUser = useAuthStore(state => state.user)
    const { loading } = useAuthStore()
    const { theme, setTheme } = useTheme()
    const setExploreQuery = useUiStore((state) => state.setExploreQuery)
    const { open, isMobile, setOpenMobile } = useSidebar()
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

    const handleLogout = async () => {
        try {
            await useAuthStore.getState().logout()
            navigate('/login')
        } catch (err) {
            console.error("Logout component caught error:", err)
        }
    }

    const confirmLogout = () => {
        setShowLogoutConfirm(true)
    }

    const getUserInitials = (user) => {
        if (!user) return "U"
        if (user.displayName) {
            return user.displayName
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)
        }
        if (user.email) {
            return user.email[0].toUpperCase()
        }
        return "U"
    }

    const isActiveRoute = (routePath) => {
        return location.pathname === routePath || location.pathname.startsWith(routePath + '/');
    }

    const handleNavigation = (path, callback) => {
        if (callback) callback();
        navigate(path);
        if (isMobile) {
            setOpenMobile(false);
        }
    }

    const items = [
        {
            name: 'Home',
            icon: Home,
            path: '/home',
            callback: null
        },
        {
            name: 'Explore',
            icon: Search,
            path: '/explore',
            callback: () => {
                setExploreQuery('')
            }
        },
        {
            name: 'Profile',
            icon: User,
            path: `/profile/${currentUser?.uid}`,
            callback: null
        },
        {
            name: 'Map',
            icon: MapPin,
            path: '/map',
            callback: null
        },
        {
            name: 'Bookmarks',
            icon: Bookmark,
            path: '/bookmarks',
            callback: null
        },
    ]

    const actionItems = [
        {
            name: 'Upload',
            icon: Upload,
            path: '/upload',
            callback: null,
            isLoading: false
        },
    ]

    return (
        <TooltipProvider>
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <div className={open ? "px-2" : "px-3"}>
                    <h2 className="text-lg font-semibold">{open ? "ECHOES" : "E"}</h2>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.name}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <SidebarMenuButton
                                                onClick={() => handleNavigation(item.path, item.callback)}
                                                isActive={isActiveRoute(item.path)}
                                            >
                                                <item.icon />
                                                <span>{item.name}</span>
                                            </SidebarMenuButton>
                                        </TooltipTrigger>
                                        <TooltipContent side="right" className={open ? "hidden" : ""}>
                                            <p>{item.name}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarSeparator />
                <SidebarGroup>
                    <SidebarGroupLabel>Actions</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {actionItems.map((item) => (
                                <SidebarMenuItem key={item.name}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <SidebarMenuButton
                                                onClick={() => handleNavigation(item.path, item.callback)}
                                                disabled={item.isLoading}
                                                isActive={isActiveRoute(item.path)}
                                            >
                                                {item.isLoading ? (
                                                    <Loader2 className="animate-spin" />
                                                ) : (
                                                    <item.icon />
                                                )}
                                                <span>
                      {item.isLoading && item.name === 'Logout' ? 'Logging out...' : item.name}
                    </span>
                                            </SidebarMenuButton>
                                        </TooltipTrigger>
                                        <TooltipContent side="right" className={open ? "hidden" : ""}>
                                            <p>{item.isLoading && item.name === 'Logout' ? 'Logging out...' : item.name}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage
                                            src={currentUser?.photoURL}
                                            alt={currentUser?.displayName || currentUser?.email}
                                        />
                                        <AvatarFallback className="rounded-lg">
                                            {getUserInitials(currentUser)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">
                                            {currentUser?.displayName || 'User'}
                                        </span>
                                        <span className="truncate text-xs">
                                            {currentUser?.email}
                                        </span>
                                    </div>
                                    <Settings className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                side={open ? "bottom" : "right"}
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuItem onClick={() => {
                                    setTheme(theme === "dark" ? "light" : "dark")
                                }}>
                                    {theme === "dark" ? (
                                        <Sun className="mr-2 h-4 w-4" />
                                    ) : (
                                        <Moon className="mr-2 h-4 w-4" />
                                    )}
                                    Switch to {theme === "dark" ? "light" : "dark"} mode
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={confirmLogout}
                                    disabled={loading}
                                    className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                                >
                                    {loading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <LogOut className="mr-2 h-4 w-4" />
                                    )}
                                    {loading ? 'Logging out...' : 'Log out'}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            </Sidebar>

            {/* Logout confirmation dialog - outside sidebar for proper z-index */}
            <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
                <AlertDialogContent className="z-[9999]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You will be signed out of your account and redirected to the login page.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                            Log out
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </TooltipProvider>
    )
}