import React from 'react';
import { Box } from '@mui/material';
import LogoutButton from "./LogoutButton.jsx";

function Header({height}) {
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
                        fontSize: '14px'
                    }}
                />
            </Box>
            
            <Box sx={{ display: 'flex', gap: '20px' }}>
                <Box sx={{ 
                    padding: '8px 12px', 
                    cursor: 'pointer',
                    borderRadius: '4px'
                }}>
                    Notifications
                </Box>
                <Box sx={{ 
                    padding: '8px 12px', 
                    cursor: 'pointer',
                    borderRadius: '4px'
                }}>
                    Profile
                </Box>
                <LogoutButton/>
            </Box>
        </Box>
    );
}

export default Header;
