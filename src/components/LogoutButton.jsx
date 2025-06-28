// src/components/Auth/LogoutButton.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // <--- Import useNavigate
import { logout} from "../store/slices/authSlice.js";

function LogoutButton() {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // <--- Initialize useNavigate hook
    const { loading, error } = useSelector(state => state.auth);

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();
            navigate('/login'); // <--- Redirect to login after logout
        } catch (err) {
            console.error("Logout component caught error:", err);
            // Even if logout fails, you might want to force a redirect or clear local state
            // depending on the severity of the error.
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