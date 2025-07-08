// src/components/Auth/Login.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithEmail, signInWithGoogle } from "../store/slices/authSlice.js";
import {
    Box,
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    useTheme,
    styled
} from '@mui/material';

// Styled components for Memphis design elements
const CheckerboardPattern = styled(Box)(({ theme }) => ({
    position: 'absolute',
    width: '300px',
    height: '300px',
    backgroundImage: `repeating-conic-gradient(#000 0% 25%, #fff 0% 50%)`,
    backgroundPosition: '0 0, 20px 20px',
    backgroundSize: '40px 40px',
    transform: 'rotate(15deg)',
    opacity: 0.9,
    zIndex: 0,
}));

const MemphisCircle = styled(Box)(({ color = '#FF69B4' }) => ({
    position: 'absolute',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: color,
    zIndex: 1,
}));

const MemphisSquiggle = styled(Box)(({ theme }) => ({
    position: 'absolute',
    width: '200px',
    height: '80px',
    '&::before': {
        content: '""',
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: '#FFD700',
        clipPath: 'path("M10,40 Q50,10 90,40 T170,40 Q210,10 250,40")',
        borderRadius: '10px',
    }
}));

const MemphisTriangle = styled(Box)(({ color = '#B19CD9' }) => ({
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeft: '80px solid transparent',
    borderRight: '80px solid transparent',
    borderBottom: `140px solid ${color}`,
    transform: 'rotate(25deg)',
    zIndex: 0,
}));

const SpeckledBox = styled(Box)(({ theme }) => ({
    position: 'absolute',
    width: '250px',
    height: '200px',
    backgroundColor: '#B19CD9',
    backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
    backgroundSize: '15px 15px',
    backgroundPosition: '0 0, 7.5px 7.5px',
    clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
    zIndex: 0,
}));

const TealBar = styled(Box)(({ theme }) => ({
    position: 'absolute',
    width: '400px',
    height: '60px',
    backgroundColor: '#40E0D0',
    zIndex: 1,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'white',
        borderRadius: 0,
        fontFamily: '"Courier New", monospace',
        '& fieldset': {
            borderColor: '#000',
            borderWidth: 3,
        },
        '&:hover fieldset': {
            borderColor: '#000',
            borderWidth: 3,
        },
        '&.Mui-focused fieldset': {
            borderColor: '#000',
            borderWidth: 3,
        },
    },
    '& .MuiInputLabel-root': {
        color: '#000',
        fontWeight: 'bold',
        fontFamily: '"Arial Black", sans-serif',
    },
}));

const MemphisButton = styled(Button)(({ variant, theme }) => ({
    borderRadius: 0,
    padding: '12px 30px',
    fontFamily: '"Arial Black", sans-serif',
    fontSize: '16px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    border: '3px solid #000',
    boxShadow: '5px 5px 0px #000',
    transition: 'all 0.1s ease',
    '&:hover': {
        transform: 'translate(-2px, -2px)',
        boxShadow: '7px 7px 0px #000',
    },
    '&:active': {
        transform: 'translate(2px, 2px)',
        boxShadow: '3px 3px 0px #000',
    },
}));

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const { loading, error } = useSelector(state => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        try {
            await dispatch(loginWithEmail({ email, password })).unwrap();
            navigate('/dashboard');
        } catch (err) {
            console.error("Login component caught error:", err);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await dispatch(signInWithGoogle()).unwrap();
            navigate('/dashboard');
        } catch (err) {
            console.error("Google Login component caught error:", err);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F0E68C',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Memphis Design Elements */}
            <CheckerboardPattern sx={{ top: -100, left: -100 }} />
            <MemphisCircle sx={{ top: 50, right: 100 }} />
            <MemphisSquiggle sx={{ bottom: 100, left: 50 }} />
            <MemphisTriangle sx={{ top: 200, left: '60%' }} />
            <SpeckledBox sx={{ bottom: -50, right: -50 }} />
            <TealBar sx={{ top: '30%', left: -100, transform: 'rotate(-20deg)' }} />
            <MemphisCircle color="#87CEEB" sx={{ bottom: 150, left: '30%', width: 80, height: 80 }} />

            {/* Additional decorative elements */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 100,
                    left: '20%',
                    width: 100,
                    height: 100,
                    backgroundColor: '#FF1493',
                    transform: 'rotate(45deg)',
                    zIndex: 0,
                }}
            />

            <Container component="main" maxWidth="xs" sx={{ zIndex: 10 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        border: '5px solid #000',
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            right: '-10px',
                            bottom: '-10px',
                            backgroundColor: '#FFB6C1',
                            zIndex: -1,
                        }
                    }}
                >
                    {/* Title */}
                    <Typography
                        component="h1"
                        variant="h3"
                        sx={{
                            fontFamily: '"Arial Black", sans-serif',
                            fontWeight: 'bold',
                            mb: 3,
                            textTransform: 'uppercase',
                            letterSpacing: '-2px',
                            color: '#000',
                            textShadow: '3px 3px 0px #FFD700',
                        }}
                    >
                        Login to Echoes
                    </Typography>

                    {/* Error Alert */}
                    {error && (
                        <Alert
                            severity="error"
                            sx={{
                                width: '100%',
                                mb: 2,
                                border: '2px solid #000',
                                borderRadius: 0,
                                backgroundColor: '#FF6B6B',
                                color: '#000',
                                fontWeight: 'bold',
                            }}
                        >
                            Error: {error}
                        </Alert>
                    )}

                    {/* Login Form */}
                    <Box component="form" onSubmit={handleEmailLogin} sx={{ width: '100%' }}>
                        <StyledTextField
                            fullWidth
                            id="email"
                            label="EMAIL"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            margin="normal"
                        />

                        <StyledTextField
                            fullWidth
                            name="password"
                            label="PASSWORD"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            margin="normal"
                            sx={{ mb: 3 }}
                        />

                        <MemphisButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{
                                backgroundColor: '#00CED1',
                                color: '#000',
                                mb: 2,
                                '&:hover': {
                                    backgroundColor: '#00CED1',
                                },
                            }}
                        >
                            {loading ? <CircularProgress size={24} sx={{ color: '#000' }} /> : 'Login with Email'}
                        </MemphisButton>
                    </Box>

                    {/* OR Divider */}
                    <Typography
                        variant="h6"
                        sx={{
                            my: 2,
                            fontFamily: '"Arial Black", sans-serif',
                            fontWeight: 'bold',
                        }}
                    >
                        OR
                    </Typography>

                    {/* Google Login */}
                    <MemphisButton
                        fullWidth
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        sx={{
                            backgroundColor: '#FF69B4',
                            color: '#000',
                            '&:hover': {
                                backgroundColor: '#FF69B4',
                            },
                        }}
                    >
                        {loading ? <CircularProgress size={24} sx={{ color: '#000' }} /> : 'Login with Google'}
                    </MemphisButton>

                    {/* Sign Up Link */}
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography
                            variant="body1"
                            sx={{
                                fontFamily: '"Courier New", monospace',
                                fontWeight: 'bold',
                            }}
                        >
                            Don't have an account?{' '}
                            <Link
                                to="/signup"
                                style={{
                                    color: '#000',
                                    fontWeight: 'bold',
                                    textDecoration: 'underline',
                                    textDecorationThickness: '3px',
                                    textUnderlineOffset: '3px',
                                }}
                            >
                                Sign Up
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}

export default Login;