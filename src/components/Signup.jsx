// src/components/Auth/Signup.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { signUpWithEmail } from "../store/slices/authSlice.js";
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

// Styled components for Memphis design elements (reusing from Login)
const CheckerboardPattern = styled(Box)(({ theme }) => ({
    position: 'absolute',
    width: '300px',
    height: '300px',
    backgroundImage: `repeating-conic-gradient(#000 0% 25%, #fff 0% 50%)`,
    backgroundPosition: '0 0, 20px 20px',
    backgroundSize: '40px 40px',
    transform: 'rotate(-25deg)',
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
    width: '300px',
    height: '100px',
    '&::before': {
        content: '""',
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: '#FF1493',
        clipPath: 'path("M10,50 Q70,20 130,50 T250,50 Q310,20 370,50")',
        borderRadius: '10px',
    }
}));

const MemphisTriangle = styled(Box)(({ color = '#40E0D0' }) => ({
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeft: '100px solid transparent',
    borderRight: '100px solid transparent',
    borderBottom: `175px solid ${color}`,
    transform: 'rotate(-35deg)',
    zIndex: 0,
}));

const SpeckledBox = styled(Box)(({ theme }) => ({
    position: 'absolute',
    width: '280px',
    height: '220px',
    backgroundColor: '#FFB6C1',
    backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
    backgroundSize: '18px 18px',
    backgroundPosition: '0 0, 9px 9px',
    clipPath: 'polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)',
    zIndex: 0,
}));

const ZigzagBox = styled(Box)(({ theme }) => ({
    position: 'absolute',
    width: '150px',
    height: '150px',
    backgroundColor: '#87CEEB',
    clipPath: 'polygon(0% 0%, 50% 0%, 50% 50%, 100% 50%, 100% 100%, 50% 100%, 50% 50%, 0% 50%)',
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

function Signup() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const { loading, error } = useSelector(state => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailSignup = async (e) => {
        e.preventDefault();
        try {
            await dispatch(signUpWithEmail({ email, password })).unwrap();
            navigate('/dashboard');
        } catch (err) {
            console.error("Signup component caught error:", err);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#98FB98',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Memphis Design Elements - Different arrangement than login */}
            <CheckerboardPattern sx={{ bottom: -150, right: -100 }} />
            <MemphisCircle color="#FFD700" sx={{ top: 80, left: 100, width: 150, height: 150 }} />
            <MemphisSquiggle sx={{ top: 50, right: 20 }} />
            <MemphisTriangle sx={{ bottom: 100, left: '20%' }} />
            <SpeckledBox sx={{ top: -100, left: '40%' }} />
            <ZigzagBox sx={{ bottom: 200, right: '15%' }} />
            <MemphisCircle color="#FF1493" sx={{ top: '40%', left: 50, width: 90, height: 90 }} />

            {/* Additional decorative elements */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 50,
                    right: '30%',
                    width: 120,
                    height: 120,
                    backgroundColor: '#9370DB',
                    transform: 'rotate(15deg)',
                    zIndex: 0,
                }}
            />

            <Box
                sx={{
                    position: 'absolute',
                    top: '25%',
                    right: '10%',
                    width: 200,
                    height: 40,
                    backgroundColor: '#FF6347',
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
                            backgroundColor: '#87CEEB',
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
                            mb: 1,
                            textTransform: 'uppercase',
                            letterSpacing: '-2px',
                            color: '#000',
                            textShadow: '3px 3px 0px #FF1493',
                        }}
                    >
                        Sign Up
                    </Typography>

                    <Typography
                        variant="h5"
                        sx={{
                            fontFamily: '"Arial Black", sans-serif',
                            fontWeight: 'bold',
                            mb: 3,
                            textTransform: 'uppercase',
                            color: '#000',
                        }}
                    >
                        for Echoes
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

                    {/* Signup Form */}
                    <Box component="form" onSubmit={handleEmailSignup} sx={{ width: '100%' }}>
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
                            autoComplete="new-password"
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
                                backgroundColor: '#32CD32',
                                color: '#000',
                                mb: 3,
                                '&:hover': {
                                    backgroundColor: '#32CD32',
                                },
                            }}
                        >
                            {loading ? <CircularProgress size={24} sx={{ color: '#000' }} /> : 'Sign Up with Email'}
                        </MemphisButton>
                    </Box>

                    {/* Login Link */}
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography
                            variant="body1"
                            sx={{
                                fontFamily: '"Courier New", monospace',
                                fontWeight: 'bold',
                            }}
                        >
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                style={{
                                    color: '#000',
                                    fontWeight: 'bold',
                                    textDecoration: 'underline',
                                    textDecorationThickness: '3px',
                                    textUnderlineOffset: '3px',
                                }}
                            >
                                Login
                            </Link>
                        </Typography>
                    </Box>

                    {/* Fun Memphis-style decorative text */}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: -50,
                            right: -30,
                            transform: 'rotate(-15deg)',
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily: '"Arial Black", sans-serif',
                                fontSize: '48px',
                                fontWeight: 'bold',
                                color: '#FFD700',
                                textShadow: '3px 3px 0px #000',
                                opacity: 0.8,
                            }}
                        >
                            NEW!
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}

export default Signup;