import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from "../stores/useAuthStore.js";

function Signup() {
    const { loading, error } = useAuthStore();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailSignup = async (e) => {
        e.preventDefault();
        try {
            await useAuthStore.getState().signUpWithEmail({ email, password });
            navigate('/dashboard'); // <--- Redirect to dashboard on success
        } catch (err) {
            console.error("Signup component caught error:", err);
        }
    };

    return (
        <div style={{textAlign: 'center', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px', margin: '20px auto'}}>
            <h3>Sign Up for Echoes</h3>
            <form onSubmit={handleEmailSignup}>
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
                <button type="submit" disabled={loading} style={{padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>
                    {loading ? 'Signing Up...' : 'Sign Up with Email'}
                </button>
            </form>

            {error && <p style={{ color: 'red', marginTop: '15px' }}>Error: {error}</p>}
            <p style={{marginTop: '20px'}}>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    );
}

export default Signup;