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
    X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../animations.css';
import landingBackground from '../assets/landing-background.jpg';

function LandingPage() {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const scrollToSection = (sectionId) => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <button 
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="flex items-center space-x-2"
                            >
                                <Sparkles className="h-8 w-8 text-violet-600" />
                                <span className="text-2xl font-bold text-slate-800">Echoes</span>
                            </button>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <button 
                                onClick={() => scrollToSection('features')}
                                className="text-slate-700 hover:text-violet-700 font-medium transition-colors"
                            >
                                Features
                            </button>
                            <button 
                                onClick={() => scrollToSection('demo')}
                                className="text-slate-700 hover:text-violet-700 font-medium transition-colors"
                            >
                                Demo
                            </button>
                            <button 
                                onClick={() => scrollToSection('how-it-works')}
                                className="text-slate-700 hover:text-violet-700 font-medium transition-colors"
                            >
                                How It Works
                            </button>
                            <Button
                                onClick={() => navigate('/login')}
                                className="bg-violet-600 hover:bg-violet-700 text-white"
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
                        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-sm">
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                <button 
                                    onClick={() => scrollToSection('features')}
                                    className="block px-3 py-2 text-slate-700 hover:text-violet-700 font-medium w-full text-left"
                                >
                                    Features
                                </button>
                                <button 
                                    onClick={() => scrollToSection('demo')}
                                    className="block px-3 py-2 text-slate-700 hover:text-violet-700 font-medium w-full text-left"
                                >
                                    Demo
                                </button>
                                <button 
                                    onClick={() => scrollToSection('how-it-works')}
                                    className="block px-3 py-2 text-slate-700 hover:text-violet-700 font-medium w-full text-left"
                                >
                                    How It Works
                                </button>
                                <button 
                                    onClick={() => navigate('/login')}
                                    className="block px-3 py-2 text-slate-700 hover:text-violet-700 font-medium w-full text-left"
                                >
                                    Log In
                                </button>
                                <Button
                                    onClick={() => navigate('/login')}
                                    className="w-full mt-2 bg-violet-600 hover:bg-violet-700 text-white"
                                >
                                    Get Started
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen bg-cover bg-center bg-fixed flex items-center"
                     style={{
                         backgroundImage: `url(${landingBackground})`
                     }}>
                {/* Dark overlay for better text visibility */}
                <div className="absolute inset-0 bg-black/50"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        {/* Hero Title */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up drop-shadow-lg">
                            Turn Your Photos Into
                            <span className="block text-violet-300 animate-fade-in-up animation-delay-300">Historical Discoveries</span>
                        </h1>

                        {/* Hero Subtitle */}
                        <p className="max-w-3xl mx-auto text-lg md:text-xl lg:text-2xl text-white/90 mb-12 leading-relaxed animate-fade-in-up animation-delay-500 drop-shadow-md">
                            Upload any photo and let AI reveal its historical context, date period, and location.
                            Connect with a community passionate about preserving history.
                        </p>

                        {/* Hero CTA */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up animation-delay-700">
                            <Button
                                size="lg"
                                onClick={() => navigate('/login')}
                                className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 text-lg font-semibold h-auto transform hover:scale-105 transition-all duration-300 shadow-xl"
                            >
                                Start Discovering
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => scrollToSection('how-it-works')}
                                className="border-2 border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-8 py-4 text-lg font-semibold h-auto transform hover:scale-105 transition-all duration-300 shadow-xl"
                            >
                                See How It Works
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem Section */}
            <section className="relative py-20 bg-cover bg-center"
                     style={{
                         backgroundImage: `url(${landingBackground})`
                     }}>
                <div className="absolute inset-0 bg-white/85 backdrop-blur-sm"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                            Your Photos Have Stories to Tell
                        </h2>
                        <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-700">
                            But without context, these visual memories lose their historical significance
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <div className="relative w-80 bg-white shadow-2xl rounded-lg overflow-hidden flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
                            {/* Photo */}
                            <div className="w-full bg-gray-200">
                                <img
                                    src={landingBackground}
                                    alt="Historical photo"
                                    className="w-full h-80 object-cover"
                                />
                            </div>

                            {/* Polaroid bottom area */}
                            <div className="w-full bg-white p-6 flex flex-col items-center">
                                {/* AI Insight */}
                                <div className="text-center text-violet-700 text-sm font-bold mb-3">
                                    ✨ AI Insight
                                </div>
                                <div className="text-center text-slate-700 text-sm leading-relaxed">
                                    Historical school building from the mid-20th century. Notice the distinctive architecture and period details.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subtitle below photo */}
                    <div className="text-center mt-12">
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            With Echoes, every photo becomes a window into history with AI-powered context and insights.
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                            Powered by AI, Driven by History
                        </h2>
                        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600">
                            Unlike other photo apps, Echoes reveals the hidden stories in your images
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardContent className="pt-6">
                                <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Clock className="h-8 w-8 text-violet-700" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">
                                    AI Historical Dating
                                </h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Our AI analyzes architectural styles, clothing, vehicles, and visual cues to estimate
                                    when your photo was taken. From mystery to history in seconds.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Feature 2 */}
                        <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardContent className="pt-6">
                                <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <MapPin className="h-8 w-8 text-violet-700" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">
                                    Smart Geolocation
                                </h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Identifies landmarks, buildings, and geographical features to pinpoint where
                                    historical moments happened. Discover the stories behind the places.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Feature 3 */}
                        <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardContent className="pt-6">
                                <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search className="h-8 w-8 text-violet-700" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">
                                    Intelligent Search
                                </h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Search across all AI-generated metadata. Find photos by era, location,
                                    architectural style, or any historical element our AI identifies.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>


            {/* Demo/Preview Section */}
            <section id="demo" className="relative py-20 bg-cover bg-center"
                     style={{
                         backgroundImage: `url(${landingBackground})`
                     }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-slate-50/90 backdrop-blur-sm"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                            See Echoes in Action
                        </h2>
                        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600">
                            Watch how our AI transforms a mysterious old photo into a rich historical discovery
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Before */}
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium mb-4">
                                    Before: Mystery Photo
                                </div>
                            </div>
                            <Card className="overflow-hidden shadow-lg border-2 border-red-200 bg-white/95 backdrop-blur">
                                <CardContent className="p-8">
                                    <div className="aspect-square bg-gray-100 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
                                        <img
                                            src={landingBackground}
                                            alt="Unknown historical photo"
                                            className="w-full h-full object-cover grayscale blur-sm opacity-50"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Date:</span>
                                            <span className="text-red-600">Unknown</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Location:</span>
                                            <span className="text-red-600">Unknown</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Context:</span>
                                            <span className="text-red-600">None</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* After */}
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
                                    After: Historical Discovery
                                </div>
                            </div>
                            <Card className="overflow-hidden shadow-xl border-2 border-green-200 bg-white/95 backdrop-blur">
                                <CardContent className="p-8">
                                    <div className="aspect-square rounded-lg mb-6 overflow-hidden relative">
                                        <img
                                            src={landingBackground}
                                            alt="Analyzed historical photo"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-2 right-2 bg-violet-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                            <Brain className="h-3 w-3" />
                                            AI Analyzed
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Date:</span>
                                            <span className="text-green-600 font-medium">1950s-1960s</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Location:</span>
                                            <span className="text-green-600 font-medium">Brieske, Germany</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Type:</span>
                                            <span className="text-green-600 font-medium">Educational Building</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Confidence:</span>
                                            <span className="text-green-600 font-medium">92%</span>
                                        </div>
                                    </div>
                                    <div className="mt-6 p-4 bg-violet-50 rounded-lg">
                                        <p className="text-sm text-slate-700">
                                            <span className="font-medium">AI Insight:</span> Historical school building showing mid-20th century German architecture. The structure and signage indicate educational use during the post-war period.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Call-to-Action */}
                    <div className="text-center mt-16">
                        <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-violet-200">
                            <div className="text-left">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">
                                    Ready to discover your photos' stories?
                                </h3>
                                <p className="text-slate-600">
                                    Upload your first photo and see the magic happen in seconds
                                </p>
                            </div>
                            <Button
                                size="lg"
                                onClick={() => navigate('/login')}
                                className="bg-violet-600 hover:bg-violet-700 text-white whitespace-nowrap shadow-lg"
                            >
                                Try It Free
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="relative py-20 bg-cover bg-center"
                     style={{
                         backgroundImage: `url(${landingBackground})`
                     }}>
                <div className="absolute inset-0 bg-white/85 backdrop-blur-sm"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                            Three Simple Steps
                        </h2>
                        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600">
                            From upload to historical discovery in minutes
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="text-center bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                            <div className="w-20 h-20 bg-violet-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl shadow-xl">
                                <Upload className="h-8 w-8" />
                            </div>
                            <div className="w-8 h-8 bg-violet-800 rounded-full flex items-center justify-center mx-auto -mt-12 mb-8 text-white font-bold text-sm relative z-10 shadow-lg">
                                1
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">
                                Upload Your Photo
                            </h3>
                            <p className="text-slate-600">
                                Simply drag and drop any historical photo from your collection.
                                Family photos, vintage finds, or mysterious old images.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="text-center bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                            <div className="w-20 h-20 bg-violet-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl shadow-xl">
                                <Brain className="h-8 w-8" />
                            </div>
                            <div className="w-8 h-8 bg-violet-800 rounded-full flex items-center justify-center mx-auto -mt-12 mb-8 text-white font-bold text-sm relative z-10 shadow-lg">
                                2
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">
                                AI Analyzes History
                            </h3>
                            <p className="text-slate-600">
                                Our advanced AI examines every detail - architecture, clothing, vehicles,
                                and context clues to determine the historical period and location.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="text-center bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                            <div className="w-20 h-20 bg-violet-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl shadow-xl">
                                <Users className="h-8 w-8" />
                            </div>
                            <div className="w-8 h-8 bg-violet-800 rounded-full flex items-center justify-center mx-auto -mt-12 mb-8 text-white font-bold text-sm relative z-10 shadow-lg">
                                3
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">
                                Share & Discover
                            </h3>
                            <p className="text-slate-600">
                                Share your discoveries with the community and explore others' findings.
                                Build connections through shared historical interests.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="relative py-20 bg-cover bg-center"
                     style={{
                         backgroundImage: `url(${landingBackground})`
                     }}>
                <div className="absolute inset-0 bg-gradient-to-r from-violet-900/90 to-purple-900/90"></div>

                <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
                        Start Your Historical Journey Today
                    </h2>
                    <p className="text-xl text-violet-100 mb-8 drop-shadow-md">
                        Join history enthusiasts discovering the stories hidden in their photos
                    </p>
                    <Button
                        size="lg"
                        onClick={() => navigate('/login')}
                        className="bg-white text-violet-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold h-auto shadow-2xl transform hover:scale-105 transition-all duration-300"
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
                            <Sparkles className="h-6 w-6 text-violet-400" />
                            <span className="text-xl font-bold">Echoes</span>
                        </div>
                        <div className="text-center md:text-right">
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