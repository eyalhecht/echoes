import React, { useState } from 'react';
import {
    Box,
    Typography,
    Avatar,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Icon for profile if no pic
import LogoutButton from "./LogoutButton.jsx"; // Still using the LogoutButton component
import {useAuthStore} from "../stores/useAuthStore.js";

function Header({ height }) {
    const currentUser = useAuthStore((state) => state.user);
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{
            height: height + 'px',
            backgroundColor: '#1877f2',
            color: 'white',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <Box sx={{ fontSize: '24px', fontWeight: 'bold' }}>
                SocialApp
            </Box>
            
            <Box sx={{ 
                flex: 1, 
                maxWidth: '400px', 
                margin: '0 20px' 
            }}>
                <input 
                    type="text" 
                    placeholder="Search..." 
                    style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '20px',
                        border: 'none',
                        outline: 'none',
                        fontSize: '14px',
                        color: '#333'
                    }}
                />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <IconButton
                    onClick={(event) => {
                        setAnchorEl(event.currentTarget);
                    }}
                    sx={{ p: 0 }} // Remove default padding from IconButton
                    aria-controls={openMenu ? 'profile-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openMenu ? 'true' : 'false'}
                >
                    <Avatar
                        src={currentUser?.photoURL || ''}
                        alt={currentUser?.displayName || 'User'}
                        sx={{
                            width: 40,
                            height: 40,
                            cursor: 'pointer'
                        }}
                    >
                        {currentUser?.displayName ? currentUser.displayName.charAt(0) : <AccountCircleIcon />}
                    </Avatar>
                </IconButton>

                <Menu
                    id="profile-menu"
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    disableScrollLock
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem>
                        <ListItemIcon>
                            <NotificationsIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Notifications</ListItemText>
                    </MenuItem>
                    <MenuItem>
                        <ListItemIcon>
                            <ExitToAppIcon fontSize="small" />
                        </ListItemIcon>
                        <LogoutButton/>
                    </MenuItem>
                </Menu>
            </Box>
        </Box>
    );
}

export default Header;
