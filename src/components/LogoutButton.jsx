import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from "../stores/useAuthStore.js";
import { ListItemText, CircularProgress } from '@mui/material';

function LogoutButton() {
    const navigate = useNavigate();
    const { loading } = useAuthStore();

    const handleLogout = async () => {
        try {
            await useAuthStore.getState().logout();
            navigate('/login');
        } catch (err) {
            console.error("Logout component caught error:", err);
        }
    };

    return (
            <ListItemText
                onClick={handleLogout}
                disabled={loading}
                sx={{
                    color: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    '&:hover': {
                        backgroundColor: 'transparent' // Prevent extra hover effect from ListItemText
                    }
                }}
            >
                {loading ? (
                    <>
                        Logging Out...
                        <CircularProgress size={16} color="inherit" />
                    </>
                ) : 'Logout'}
            </ListItemText>
        );

}

export default LogoutButton;