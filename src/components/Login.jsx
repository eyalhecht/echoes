import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {useAuthStore} from "../stores/useAuthStore.js";

function Login() {
    const navigate = useNavigate();
    const { loading, error } = useAuthStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        try {
            await useAuthStore.getState().loginWithEmail({ email, password });
            navigate('/dashboard');
        } catch (err) {
            console.error("Login component caught error:", err);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await useAuthStore.getState().signInWithGoogle();
            navigate('/dashboard'); // <--- Redirect to dashboard on success
        } catch (err) {
            console.error("Google Login component caught error:", err);
        }
    };

    return (
        <div style={{textAlign: 'center', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px', margin: '20px auto'}}>
            <h3>Login to Echoes</h3>
            <form onSubmit={handleEmailLogin}>
                <div style={{marginBottom: '10px'}}>
                    <label htmlFor="email" style={{display: 'block', marginBottom: '5px'}}>Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{width: '90%', padding: '8px'}}
                    />
                </div>
                <div style={{marginBottom: '15px'}}>
                    <label htmlFor="password" style={{display: 'block', marginBottom: '5px'}}>Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{width: '90%', padding: '8px'}}
                    />
                </div>
                <button type="submit" disabled={loading} style={{padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>
                    {loading ? 'Logging In...' : 'Login with Email'}
                </button>
            </form>
            <p style={{margin: '15px 0'}}>OR</p>
            <button onClick={handleGoogleLogin} disabled={loading} style={{padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>
                {loading ? 'Signing In...' : 'Login with Google'}
            </button>

            {error && <p style={{ color: 'red', marginTop: '15px' }}>Error: {error}</p>}
            <p style={{marginTop: '20px'}}>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
    );
}

export default Login;