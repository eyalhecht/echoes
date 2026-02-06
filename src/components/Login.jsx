import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
    Github,
    Loader2,
    Sparkles
} from 'lucide-react';
import { useAuthStore } from "../stores/useAuthStore.js";
import { useNavigate, useLocation, Link } from "react-router-dom";

// Google Icon Component
const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
);

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { loading, error } = useAuthStore();
    const [loadingProvider, setLoadingProvider] = useState(null);

    const from = location.state?.from || '/home';

    const handleGoogleLogin = async () => {
        try {
            setLoadingProvider('google');
            await useAuthStore.getState().signInWithGoogle();
            navigate(from, { replace: true });
        } catch (err) {
            console.error("Google Login component caught error:", err);
            setLoadingProvider(null);
        }
    };

    const handleGitHubLogin = async () => {
        try {
            setLoadingProvider('github');
            await useAuthStore.getState().signInWithGitHub();
            navigate(from, { replace: true });
        } catch (err) {
            console.error("GitHub Login component caught error:", err);
            setLoadingProvider(null);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background gradient mesh */}
            <div className="absolute top-[-30%] right-[-15%] w-[500px] h-[500px] rounded-full bg-violet-600/15 blur-[128px]" />
            <div className="absolute bottom-[-30%] left-[-15%] w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-[128px]" />

            <div className="relative w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <Sparkles className="h-7 w-7 text-violet-400" />
                        <span className="text-xl font-bold text-zinc-100">Echoes</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-100 mb-3">
                        Choose your sign in method
                    </h2>
                </div>

                {/* Main Login Buttons */}
                <div className="space-y-3 mb-8">
                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full h-14 text-base font-medium border-zinc-700 bg-zinc-900 hover:bg-zinc-800 hover:border-zinc-600 rounded-xl transition-colors"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                    >
                        {loadingProvider === 'google' ? (
                            <Loader2 className="mr-3 h-5 w-5 animate-spin text-zinc-400" />
                        ) : (
                            <GoogleIcon />
                        )}
                        <span className="ml-3 text-zinc-200">Continue with Google</span>
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full h-14 text-base font-medium border-zinc-700 bg-zinc-900 hover:bg-zinc-800 hover:border-zinc-600 rounded-xl transition-colors"
                        onClick={handleGitHubLogin}
                        disabled={loading}
                    >
                        {loadingProvider === 'github' ? (
                            <Loader2 className="mr-3 h-5 w-5 animate-spin text-zinc-400" />
                        ) : (
                            <Github className="mr-3 h-5 w-5 text-zinc-300" />
                        )}
                        <span className="text-zinc-200">Continue with GitHub</span>
                    </Button>
                </div>

                {/* Error Display */}
                {error && (
                    <Alert variant="destructive" className="mb-8 rounded-xl bg-red-500/10 border-red-500/20">
                        <AlertDescription className="text-center text-red-400">
                            {error}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Bottom Section */}
                <div className="text-center space-y-6">
                    <Separator className="bg-zinc-800" />

                    <p className="text-zinc-500 text-sm">
                        Need more info?{' '}
                        <button
                            onClick={() => navigate('/')}
                            className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                        >
                            Back to homepage
                        </button>
                    </p>
                </div>

                {/* Terms Footer */}
                <div className="mt-12 text-center space-y-2">
                    <p className="text-xs text-zinc-500 leading-relaxed">
                        By continuing, you agree to our{' '}
                        <Link
                            to="/terms"
                            className="text-violet-400 hover:text-violet-300 font-medium"
                        >
                            Terms of Service
                        </Link>
                        {' '}and{' '}
                        <Link
                            to="/privacy"
                            className="text-violet-400 hover:text-violet-300 font-medium"
                        >
                            Privacy Policy
                        </Link>
                    </p>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                        Need help?{' '}
                        <a
                            href="mailto:eyalhe3@gmail.com"
                            className="text-violet-400 hover:text-violet-300 font-medium"
                        >
                            Contact Us
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
