import React, {useState, useEffect} from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
    Github,
    Loader2,
    Sparkles
} from 'lucide-react';
import { useAuthStore } from "../stores/useAuthStore.js";
import { useNavigate, useLocation } from "react-router-dom";

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

    // Force light mode for login page
    useEffect(() => {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');

        return () => {
            // Restore dark mode on unmount
            document.documentElement.classList.remove('light');
            document.documentElement.classList.add('dark');
        };
    }, []);

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
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
            <div className="w-full max-w-lg">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="relative inline-block mb-12">
                        <h1 className="text-5xl font-bold text-slate-800">Echoes</h1>
                        <div className="absolute -top-3 -right-3">
                            <Sparkles className="h-8 w-8 text-violet-600" />
                        </div>
                    </div>

                    <h2 className="text-6xl font-bold text-slate-900 mb-6 leading-tight">
                        Choose your sign in method
                    </h2>
                    <p className="text-slate-500 text-xl">
                        Continue your historical journey
                    </p>
                </div>

                {/* Main Login Buttons */}
                <div className="space-y-4 mb-12  animate-fade-in-up">
                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full h-16 text-lg font-semibold border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 rounded-xl transition-all"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                    >
                        {loadingProvider === 'google' ? (
                            <Loader2 className="mr-4 h-6 w-6 animate-spin" />
                        ) : (
                            <GoogleIcon />
                        )}
                        <span className="ml-4 text-slate-700">Continue with Google</span>
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full h-16 text-lg font-semibold border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 rounded-xl transition-all"
                        onClick={handleGitHubLogin}
                        disabled={loading}
                    >
                        {loadingProvider === 'github' ? (
                            <Loader2 className="mr-4 h-6 w-6 animate-spin" />
                        ) : (
                            <Github className="mr-4 h-6 w-6" />
                        )}
                        <span className="text-slate-700">Continue with GitHub</span>
                    </Button>
                </div>

                {/* Error Display */}
                {error && (
                    <Alert variant="destructive" className="mb-8 rounded-xl">
                        <AlertDescription className="text-center">
                            {error}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Bottom Section */}
                <div className="text-center space-y-6">
                    <div className="relative">
                        <Separator className="bg-slate-200" />
                    </div>

                    <p className="text-slate-500 text-lg">
                        Need more info?{' '}
                        <button 
                            onClick={() => navigate('/')}
                            className="text-violet-600 hover:text-violet-700 font-semibold hover:underline transition-colors"
                        >
                            Back to homepage
                        </button>
                    </p>
                </div>

                {/* Terms Footer */}
                <div className="mt-16 text-center space-y-3">
                    <p className="text-sm text-slate-400 leading-relaxed">
                        By continuing, you agree to our{' '}
                        <button className="text-violet-600 hover:underline font-medium">
                            Terms of Service
                        </button>
                        {' '}and{' '}
                        <button className="text-violet-600 hover:underline font-medium">
                            Privacy Policy
                        </button>
                    </p>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Need help?{' '}
                        <a 
                            href="mailto:eyalhe3@gmail.com"
                            className="text-violet-600 hover:underline font-medium"
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