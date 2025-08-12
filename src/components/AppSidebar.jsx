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
    Sun
} from "lucide-react"
import { useNavigate } from 'react-router-dom'
import useUiStore from "../stores/useUiStore.js"
import { useAuthStore } from "../stores/useAuthStore.js"
import { useTheme } from "@/components/theme-provider"

export function AppSidebar() {
    const navigate = useNavigate()
    const currentUser = useAuthStore(state => state.user)
    const { loading } = useAuthStore()
    const { theme, setTheme } = useTheme()
    const activeSidebarItem = useUiStore((state) => state.activeSidebarItem)
    const setActiveSidebarItem = useUiStore((state) => state.setActiveSidebarItem)
    const setActiveProfileView = useUiStore((state) => state.setActiveProfileView)
    const { open, isMobile, setOpenMobile } = useSidebar()

    const handleLogout = async () => {
        try {
            await useAuthStore.getState().logout()
            navigate('/login')
        } catch (err) {
            console.error("Logout component caught error:", err)
        }
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

    const items = [
        {
            name: 'Home',
            icon: Home,
            callback: () => {}
        },
        {
            name: 'Profile',
            icon: User,
            callback: () => {
                setActiveProfileView(currentUser.uid)
            }
        },
        {
            name: 'Map',
            icon: MapPin,
            callback: () => {}
        },
        {
            name: 'Bookmarks',
            icon: Bookmark,
            callback: () => {}
        },
    ]

    const actionItems = [
        {
            name: 'Upload',
            icon: Upload,
            callback: () => {},
            isLoading: false
        },
    ]

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <div className="px-2">
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
                                    <SidebarMenuButton
                                        onClick={() => {
                                            item.callback()
                                            setActiveSidebarItem(item.name)
                                            if (isMobile) {
                                                setOpenMobile(false)
                                            }
                                        }}
                                        isActive={activeSidebarItem === item.name}
                                    >
                                        <item.icon />
                                        <span>{item.name}</span>
                                    </SidebarMenuButton>
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
                                    <SidebarMenuButton
                                        onClick={() => {
                                            item.callback()
                                            if (item.name !== 'Logout') {
                                                setActiveSidebarItem(item.name)
                                                if (isMobile) {
                                                    setOpenMobile(false)
                                                }
                                            }
                                        }}
                                        disabled={item.isLoading}
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
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
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
                                    onClick={handleLogout} 
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
    )
}