import React from 'react';
import { useNavigate } from 'react-router-dom';
import {useAuthStore} from "../stores/useAuthStore.js";

function LogoutButton() {
    const navigate = useNavigate();
    const { loading, error } = useAuthStore();

    const handleLogout = async () => {
        try {
            await useAuthStore.getState().logout();
            navigate('/login');
        } catch (err) {
            console.error("Logout component caught error:", err);
        }
    };

    return (
        <button onClick={handleLogout} disabled={loading} style={{padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>
            {loading ? 'Logging Out...' : 'Logout'}
            {error && <span style={{ color: 'red', marginLeft: '10px' }}>({error})</span>}
        </button>
    );
}

export default LogoutButton;