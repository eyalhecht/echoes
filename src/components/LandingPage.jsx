import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
    Sparkles, 
    Clock, 
    MapPin, 
    Search, 
    Upload, 
    Brain, 
    Users,
    ArrowRight,
    Menu,
    X,
    Moon,
    Sun
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from "@/components/theme-provider";

function LandingPage() {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { theme, setTheme } = useTheme();

    const scrollToSection = (sectionId) => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-sm border-b border-amber-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <button 
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="flex items-center space-x-2"
                            >
                                <Sparkles className="h-8 w-8 text-amber-600" />
                                <span className="text-2xl font-bold text-amber-900">Echoes</span>
                            </button>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <button 
                                onClick={() => scrollToSection('features')}
                                className="text-gray-700 hover:text-amber-700 font-medium transition-colors"
                            >
                                Features
                            </button>
                            <button 
                                onClick={() => scrollToSection('how-it-works')}
                                className="text-gray-700 hover:text-amber-700 font-medium transition-colors"
                            >
                                How It Works
                            </button>
                            <Button
                                onClick={() => navigate('/login')}
                                className="bg-amber-600 hover:bg-amber-700 text-white"
                            >
                                Get Started
                            </Button>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden border-t border-amber-100 bg-white/95 backdrop-blur-sm">
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                <button 
                                    onClick={() => scrollToSection('features')}
                                    className="block px-3 py-2 text-gray-700 hover:text-amber-700 font-medium w-full text-left"
                                >
                                    Features
                                </button>
                                <button 
                                    onClick={() => scrollToSection('how-it-works')}
                                    className="block px-3 py-2 text-gray-700 hover:text-amber-700 font-medium w-full text-left"
                                >
                                    How It Works
                                </button>
                                <button 
                                    onClick={() => navigate('/login')}
                                    className="block px-3 py-2 text-gray-700 hover:text-amber-700 font-medium w-full text-left"
                                >
                                    Log In
                                </button>
                                <Button
                                    onClick={() => navigate('/login')}
                                    className="w-full mt-2 bg-amber-600 hover:bg-amber-700 text-white"
                                >
                                    Get Started
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 lg:py-32">
                {/* Background Pattern */}
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a574' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        {/* Hero Title */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                            Turn Your Photos Into
                            <span className="block text-amber-600">Historical Discoveries</span>
                        </h1>
                        
                        {/* Hero Subtitle */}
                        <p className="max-w-3xl mx-auto text-lg md:text-xl lg:text-2xl text-gray-700 mb-12 leading-relaxed">
                            Upload any photo and let AI reveal its historical context, date period, and geographical significance. 
                            Connect with a community passionate about preserving visual history.
                        </p>

                        {/* Hero CTA */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                            <Button 
                                size="lg"
                                onClick={() => navigate('/login')}
                                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 text-lg font-semibold h-auto"
                            >
                                Start Discovering
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button 
                                variant="outline"
                                size="lg"
                                onClick={() => scrollToSection('how-it-works')}
                                className="border-2 border-amber-600 text-amber-700 hover:bg-amber-50 px-8 py-4 text-lg font-semibold h-auto"
                            >
                                See How It Works
                            </Button>
                        </div>

                        {/* Hero Visual Placeholder */}
                        <div className="max-w-4xl mx-auto">
                            <Card className="overflow-hidden shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                                <CardContent className="p-8">
                                    <div className="aspect-video bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
                                        <div className="text-center">
                                            <Brain className="h-16 w-16 text-amber-600 mx-auto mb-4" />
                                            <p className="text-lg font-semibold text-gray-700">
                                                AI Analysis Demo Coming Soon
                                            </p>
                                            <p className="text-gray-600 mt-2">
                                                See a photo transform with historical insights
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                            Powered by AI, Driven by History
                        </h2>
                        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600">
                            Unlike other photo apps, Echoes reveals the hidden stories in your images
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardContent className="pt-6">
                                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Clock className="h-8 w-8 text-amber-700" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                    AI Historical Dating
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Our AI analyzes architectural styles, clothing, vehicles, and visual cues to estimate 
                                    when your photo was taken. From mystery to history in seconds.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Feature 2 */}
                        <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardContent className="pt-6">
                                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <MapPin className="h-8 w-8 text-amber-700" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                    Smart Geolocation
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Identifies landmarks, buildings, and geographical features to pinpoint where 
                                    historical moments happened. Discover the stories behind the places.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Feature 3 */}
                        <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardContent className="pt-6">
                                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search className="h-8 w-8 text-amber-700" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                    Intelligent Search
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Search across all AI-generated metadata. Find photos by era, location, 
                                    architectural style, or any historical element our AI identifies.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                            Three Simple Steps
                        </h2>
                        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600">
                            From upload to historical discovery in minutes
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="text-center">
                            <div className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl">
                                <Upload className="h-8 w-8" />
                            </div>
                            <div className="w-8 h-8 bg-amber-800 rounded-full flex items-center justify-center mx-auto -mt-12 mb-8 text-white font-bold text-sm relative z-10">
                                1
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Upload Your Photo
                            </h3>
                            <p className="text-gray-600">
                                Simply drag and drop any historical photo from your collection. 
                                Family photos, vintage finds, or mysterious old images.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="text-center">
                            <div className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl">
                                <Brain className="h-8 w-8" />
                            </div>
                            <div className="w-8 h-8 bg-amber-800 rounded-full flex items-center justify-center mx-auto -mt-12 mb-8 text-white font-bold text-sm relative z-10">
                                2
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                AI Analyzes History
                            </h3>
                            <p className="text-gray-600">
                                Our advanced AI examines every detail - architecture, clothing, vehicles, 
                                and context clues to determine the historical period and location.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="text-center">
                            <div className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl">
                                <Users className="h-8 w-8" />
                            </div>
                            <div className="w-8 h-8 bg-amber-800 rounded-full flex items-center justify-center mx-auto -mt-12 mb-8 text-white font-bold text-sm relative z-10">
                                3
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Share & Discover
                            </h3>
                            <p className="text-gray-600">
                                Share your discoveries with the community and explore others' findings. 
                                Build connections through shared historical interests.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-20 bg-gradient-to-r from-amber-600 to-orange-600">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Start Your Historical Journey Today
                    </h2>
                    <p className="text-xl text-amber-100 mb-8">
                        Join thousands of history enthusiasts discovering the stories hidden in their photos
                    </p>
                    <Button 
                        size="lg"
                        onClick={() => navigate('/login')}
                        className="bg-white text-amber-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold h-auto"
                    >
                        Get Started Free
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <Sparkles className="h-6 w-6 text-amber-400" />
                            <span className="text-xl font-bold">Echoes</span>
                        </div>
                        <div className="text-center md:text-right">
                            <p className="text-gray-400">
                                Discover history through AI-powered photo analysis
                            </p>
                            <p className="text-gray-500 text-sm mt-2">
                                © 2025 Echoes. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;