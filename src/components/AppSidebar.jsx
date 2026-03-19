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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Home,
    User,
    MapPin,
    Bookmark,
    Upload,
    LogOut,
    Settings,
    Search,
    Trash2,
    AlertTriangle,
    Info
} from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from "../stores/useAuthStore.js"
import { useState } from "react"
import { callApiGateway} from "@/firebaseConfig.js";
import { useToast } from "@/hooks/use-toast"

export function AppSidebar() {
    const navigate = useNavigate()
    const location = useLocation()
    const currentUser = useAuthStore(state => state.user)
    const { loading } = useAuthStore()
    const { open, isMobile, setOpenMobile } = useSidebar()
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleteConfirmText, setDeleteConfirmText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)
    const { toast } = useToast()

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

    const confirmDeleteAccount = () => {
        setShowDeleteConfirm(true)
        setDeleteConfirmText('')
    }

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE') {
            toast({
                title: "Confirmation Required",
                description: "Please type DELETE to confirm account deletion",
                variant: "destructive"
            })
            return
        }

        setIsDeleting(true)
        try {
            await callApiGateway({
                action: 'deleteUserAccount',
                payload: {}
            });

            toast({
                title: "Account Deletion Initiated",
                description: "You will be logged out shortly.",
                variant: "default"
            })
            
            // Wait a moment then logout
            setTimeout(async () => {
                await useAuthStore.getState().logout()
                navigate('/login')
                toast({
                    title: "Account Deletion Processing",
                    description: "Account deletion is processing in the background. All your data will be permanently removed.",
                    variant: "default"
                })
            }, 2000)
            
        } catch (error) {
            console.error('Delete account error:', error)
            toast({
                title: "Deletion Failed",
                description: error.message || "Failed to delete account. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsDeleting(false)
            setShowDeleteConfirm(false)
            setDeleteConfirmText('')
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

    const isActiveRoute = (routePath) => {
        return location.pathname.includes(routePath);
    }

    const handleNavigation = (path, callback) => {
        if (callback) callback();
        navigate(path);
        if (isMobile) {
            setOpenMobile(false);
        }
    }

    const publicItems = [
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
            callback: null
        },
        {
            name: 'Map',
            icon: MapPin,
            path: '/map',
            callback: null
        },
        ...(!currentUser ? [{
            name: 'About',
            icon: Info,
            path: '/about',
            callback: null
        }] : []),
    ]

    const authItems = [
        {
            name: 'Profile',
            icon: User,
            path: `/profile/${currentUser?.uid}`,
            callback: null
        },
        {
            name: 'Bookmarks',
            icon: Bookmark,
            path: '/bookmarks',
            callback: null
        },
    ]

    const items = currentUser ? [...publicItems, ...authItems] : publicItems

    const actionItems = currentUser ? [
        {
            name: 'Upload',
            icon: Upload,
            path: '/upload',
            callback: null,
            isLoading: false
        },
    ] : []

    return (
        <TooltipProvider>
        <Sidebar collapsible="icon">
            <SidebarHeader className={"cursor-pointer"}>
                <div onClick={()=> navigate("/home")} className={open ? "px-2" : "px-3"}>
                    <h2 className="text-lg font-bold" style={{ fontFamily: "'Lora', Georgia, serif", letterSpacing: '0.03em' }}>
                        {open ? "Echoes" : "E"}
                    </h2>
                    {open && <div className="h-0.5 w-10 mt-0.5 rounded-full bg-echoes-amber opacity-80" />}
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
                                                    <Spinner size="sm" />
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
                        {currentUser ? (
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
                                <DropdownMenuItem
                                    onClick={confirmLogout}
                                    disabled={loading}
                                    className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                                >
                                    {loading ? (
                                        <Spinner size="sm" className="mr-2" />
                                    ) : (
                                        <LogOut className="mr-2 h-4 w-4" />
                                    )}
                                    {loading ? 'Logging out...' : 'Log out'}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={confirmDeleteAccount}
                                    disabled={loading || isDeleting}
                                    className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                                >
                                    {isDeleting ? (
                                        <Spinner size="sm" className="mr-2" />
                                    ) : (
                                        <Trash2 className="mr-2 h-4 w-4" />
                                    )}
                                    {isDeleting ? 'Deleting...' : 'Delete Account'}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        ) : (
                        <SidebarMenuButton
                            onClick={() => navigate('/login')}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                        >
                            <LogOut className="rotate-180" />
                            {open && <span>Join Echoes</span>}
                        </SidebarMenuButton>
                        )}
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            </Sidebar>

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

            {/* Delete account confirmation dialog */}
            <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <AlertDialogContent className="z-[9999] max-w-md">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <AlertDialogTitle className="text-red-600">
                                Delete Account Permanently
                            </AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="space-y-3">
                            <p className="font-semibold text-foreground">
                                ⚠️ This action cannot be undone!
                            </p>
                            <p>
                                This will permanently delete your account and all associated data, including:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>All your posts and uploaded content</li>
                                <li>All your comments and likes</li>
                                <li>Your followers and following relationships</li>
                                <li>Your bookmarks and preferences</li>
                                <li>Your profile information</li>
                            </ul>
                            <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
                                <p className="text-sm text-red-700 dark:text-red-300">
                                    <strong>Type "DELETE" below to confirm:</strong>
                                </p>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="my-4">
                        <Label htmlFor="delete-confirm" className="text-sm font-medium">
                            Confirmation
                        </Label>
                        <Input
                            id="delete-confirm"
                            type="text"
                            placeholder="Type DELETE here"
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            className="mt-1"
                            disabled={isDeleting}
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteAccount}
                            disabled={isDeleting || deleteConfirmText !== 'DELETE'}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600 disabled:opacity-50"
                        >
                            {isDeleting ? (
                                <>
                                    <Spinner size="sm" className="mr-2" />
                                    Deleting Account...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete My Account
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </TooltipProvider>
    )
}