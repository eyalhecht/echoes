import React, { useState } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Github } from 'lucide-react';
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "../stores/useAuthStore.js";
import { useNavigate, Link } from "react-router-dom";
import { palette, alpha } from '../styles/theme';

const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
);

/**
 * The styled auth card shared by the Login page and the AuthGateModal.
 *
 * Props:
 *   subtitle     – text shown beneath the heading (defaults to the login page tagline)
 *   onSuccess    – called after a successful sign-in (modal can use this to close itself)
 *   showBackLink – whether to show the "Back to homepage" link (default true)
 */
export default function LoginCard({ subtitle, onSuccess, showBackLink = true, dark = false }) {
    const navigate = useNavigate();
    const { loading, error } = useAuthStore();
    const [loadingProvider, setLoadingProvider] = useState(null);

    const handleGoogleLogin = async () => {
        try {
            setLoadingProvider('google');
            await useAuthStore.getState().signInWithGoogle();
            onSuccess ? onSuccess() : navigate('/home', { replace: true });
        } catch (err) {
            console.error('Google login error:', err);
            setLoadingProvider(null);
        }
    };

    const handleGitHubLogin = async () => {
        try {
            setLoadingProvider('github');
            await useAuthStore.getState().signInWithGitHub();
            onSuccess ? onSuccess() : navigate('/home', { replace: true });
        } catch (err) {
            console.error('GitHub login error:', err);
            setLoadingProvider(null);
        }
    };

    return (
        <div className="relative w-full max-w-md z-10" style={{ fontFamily: "'Lora', Georgia, serif" }}>
            <div
                className="relative px-8 py-12"
                style={{
                    background: palette.cream,
                    border: `2px solid ${alpha('--echoes-amber', 0.31)}`,
                    boxShadow: `8px 8px 0px ${alpha('--echoes-amber', 0.19)}`,
                }}
            >
                {/* Corner decorations */}
                {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map((pos) => (
                    <div
                        key={pos}
                        className={`absolute ${pos} w-4 h-4`}
                        style={{
                            borderTop:    pos.includes('top')    ? `2px solid ${palette.amber}` : 'none',
                            borderBottom: pos.includes('bottom') ? `2px solid ${palette.amber}` : 'none',
                            borderLeft:   pos.includes('left')   ? `2px solid ${palette.amber}` : 'none',
                            borderRight:  pos.includes('right')  ? `2px solid ${palette.amber}` : 'none',
                        }}
                    />
                ))}

                {/* Header */}
                <div className="text-center mb-10">
                    <button
                        onClick={() => navigate('/about')}
                        className="text-2xl font-bold mb-5 block w-full"
                        style={{ color: palette.brown, letterSpacing: '-0.02em' }}
                    >
                        Echoes
                    </button>
                    <h1
                        className="font-bold"
                        style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: palette.brown, letterSpacing: '-0.02em', lineHeight: 1.2 }}
                    >
                        Sign in or create an account
                    </h1>
                    <p className="mt-2 text-sm" style={{ color: palette.muted }}>
                        {subtitle ?? "Those photos won't share themselves."}
                    </p>
                </div>

                {/* Auth buttons */}
                <div className="flex flex-col gap-3 mb-8">
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 px-6 py-3.5 font-semibold text-sm transition-all disabled:opacity-60"
                        style={{ background: palette.brown, color: palette.cream, boxShadow: `3px 3px 0px ${palette.amber}` }}
                        onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = palette.amber; e.currentTarget.style.boxShadow = `3px 3px 0px ${palette.brown}`; }}}
                        onMouseLeave={e => { e.currentTarget.style.background = palette.brown; e.currentTarget.style.boxShadow = `3px 3px 0px ${palette.amber}`; }}
                    >
                        {loadingProvider === 'google' ? <Spinner size="sm" /> : <GoogleIcon />}
                        Continue with Google
                    </button>

                    <button
                        onClick={handleGitHubLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 px-6 py-3.5 font-semibold text-sm transition-all disabled:opacity-60"
                        style={{ background: palette.brown, color: palette.cream, boxShadow: `3px 3px 0px ${palette.amber}` }}
                        onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = palette.amber; e.currentTarget.style.boxShadow = `3px 3px 0px ${palette.brown}`; }}}
                        onMouseLeave={e => { e.currentTarget.style.background = palette.brown; e.currentTarget.style.boxShadow = `3px 3px 0px ${palette.amber}`; }}
                    >
                        {loadingProvider === 'github' ? <Spinner size="sm" /> : <Github size={18} />}
                        Continue with GitHub
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <Alert className="mb-6" style={{ background: alpha('--echoes-amber', 0.08), border: `1px solid ${alpha('--echoes-amber', 0.3)}` }}>
                        <AlertDescription className="text-center text-sm" style={{ color: palette.brown }}>
                            {error}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Divider + back link */}
                {showBackLink && (
                    <div className="text-center space-y-4">
                        <div className="h-px w-full" style={{ background: alpha('--echoes-amber', 0.2) }} />
                        <p className="text-sm" style={{ color: palette.muted }}>
                            Need more info?{' '}
                            <button
                                onClick={() => navigate('/about')}
                                className="font-semibold transition-colors"
                                style={{ color: palette.amber }}
                                onMouseEnter={e => e.target.style.color = palette.brown}
                                onMouseLeave={e => e.target.style.color = palette.amber}
                            >
                                Back to homepage
                            </button>
                        </p>
                    </div>
                )}
            </div>

            {/* Terms — outside card */}
            <div className="mt-5 text-center space-y-1">
                <p className="text-xs" style={{ color: dark ? 'rgba(255,255,255,0.65)' : palette.muted }}>
                    By continuing, you agree to our{' '}
                    <Link to="/terms" className="font-medium" style={{ color: palette.amber }}>Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="font-medium" style={{ color: palette.amber }}>Privacy Policy</Link>
                </p>
                <p className="text-xs" style={{ color: dark ? 'rgba(255,255,255,0.65)' : palette.muted }}>
                    Need help?{' '}
                    <a href="mailto:eyalhe3@gmail.com" className="font-medium" style={{ color: palette.amber }}>
                        Contact Us
                    </a>
                </p>
            </div>
        </div>
    );
}
