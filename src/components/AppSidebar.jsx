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
    SidebarSeparator, useSidebar,
} from "@/components/ui/sidebar"
import {
    Home,
    User,
    MapPin,
    Bookmark,
    Upload,
    LogOut,
    Loader2
} from "lucide-react"
import { useNavigate } from 'react-router-dom'
import useUiStore from "../stores/useUiStore.js"
import { useAuthStore } from "../stores/useAuthStore.js"

export function AppSidebar() {
    const navigate = useNavigate()
    const currentUser = useAuthStore(state => state.user)
    const { loading } = useAuthStore()
    const activeSidebarItem = useUiStore((state) => state.activeSidebarItem)
    const setActiveSidebarItem = useUiStore((state) => state.setActiveSidebarItem)
    const setActiveProfileView = useUiStore((state) => state.setActiveProfileView)
    const { open} = useSidebar()

    const handleLogout = async () => {
        try {
            await useAuthStore.getState().logout()
            navigate('/login')
        } catch (err) {
            console.error("Logout component caught error:", err)
        }
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
        {
            name: 'Logout',
            icon: LogOut,
            callback: handleLogout,
            isLoading: loading
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
                <div className="px-2 py-2">
                    <p className="text-xs text-muted-foreground">© 2025 Echoes</p>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}