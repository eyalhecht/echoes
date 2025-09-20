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
            <section className="relative overflow-hidden py-20 lg:py-12">
                {/* Background Pattern */}
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a78bfa' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        {/* Hero Title */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
                            Turn Your Photos Into
                            <span className="block text-violet-600">Historical Discoveries</span>
                        </h1>
                        
                        {/* Hero Subtitle */}
                        <p className="max-w-3xl mx-auto text-lg md:text-xl lg:text-2xl text-slate-700 mb-12 leading-relaxed">
                            Upload any photo and let AI reveal its historical context, date period, and location.
                            Connect with a community passionate about preserving history.
                        </p>

                        {/* Hero CTA */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                            <Button 
                                size="lg"
                                onClick={() => navigate('/login')}
                                className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 text-lg font-semibold h-auto"
                            >
                                Start Discovering
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button 
                                variant="outline"
                                size="lg"
                                onClick={() => scrollToSection('how-it-works')}
                                className="border-2 border-violet-600 text-violet-700 hover:bg-violet-50 px-8 py-4 text-lg font-semibold h-auto"
                            >
                                See How It Works
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem Section */}
            <section className="py-20 bg-gradient-to-br from-slate-100 to-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                                    src="https://images.unsplash.com/photo-1610225526504-3c690a6ca814?q=80&w=694&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    alt="Historical photo of Paris"
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
                                    Likely taken in Paris around the 1990s. Notice the Eiffel Tower and cobblestone streets typical of that era.
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
            <section id="demo" className="py-20 bg-gradient-to-br from-slate-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                            <Card className="overflow-hidden shadow-lg border-2 border-red-200">
                                <CardContent className="p-8">
                                    <div className="aspect-square bg-gray-100 rounded-lg mb-6 flex items-center justify-center">
                                        <div className="text-center text-gray-500">
                                            <div className="w-20 h-20 bg-gray-300 rounded mx-auto mb-4"></div>
                                            <p className="font-medium">Unknown Photo</p>
                                            <p className="text-sm">No historical context</p>
                                        </div>
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
                            <Card className="overflow-hidden shadow-xl border-2 border-green-200">
                                <CardContent className="p-8">
                                    <div className="aspect-square bg-gradient-to-br from-violet-100 to-purple-100 rounded-lg mb-6 flex items-center justify-center relative">
                                        <div className="text-center text-slate-700">
                                            <div className="w-20 h-20 bg-violet-300 rounded mx-auto mb-4 flex items-center justify-center">
                                                <Brain className="h-10 w-10 text-violet-700" />
                                            </div>
                                            <p className="font-medium">AI-Analyzed Photo</p>
                                            <p className="text-sm">Rich historical insights</p>
                                        </div>
                                        {/* AI Analysis Overlays */}
                                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                            1940s Architecture
                                        </div>
                                        <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded">
                                            Victorian Era
                                        </div>
                                        <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                            London, UK
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Date:</span>
                                            <span className="text-green-600 font-medium">1940-1945</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Location:</span>
                                            <span className="text-green-600 font-medium">London, England</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Architecture:</span>
                                            <span className="text-green-600 font-medium">Victorian</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Confidence:</span>
                                            <span className="text-green-600 font-medium">94%</span>
                                        </div>
                                    </div>
                                    <div className="mt-6 p-4 bg-violet-50 rounded-lg">
                                        <p className="text-sm text-slate-700">
                                            <span className="font-medium">AI Insight:</span> This photograph appears to be taken during WWII era, showing typical London residential architecture. The style and visual cues suggest wartime period.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Call-to-Action */}
                    <div className="text-center mt-16">
                        <div className="inline-flex items-center space-x-4 p-6 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl">
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
                                className="bg-violet-600 hover:bg-violet-700 text-white whitespace-nowrap"
                            >
                                Try It Free
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 bg-gradient-to-br from-slate-100 to-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                        <div className="text-center">
                            <div className="w-20 h-20 bg-violet-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl">
                                <Upload className="h-8 w-8" />
                            </div>
                            <div className="w-8 h-8 bg-violet-800 rounded-full flex items-center justify-center mx-auto -mt-12 mb-8 text-white font-bold text-sm relative z-10">
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
                        <div className="text-center">
                            <div className="w-20 h-20 bg-violet-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl">
                                <Brain className="h-8 w-8" />
                            </div>
                            <div className="w-8 h-8 bg-violet-800 rounded-full flex items-center justify-center mx-auto -mt-12 mb-8 text-white font-bold text-sm relative z-10">
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
                        <div className="text-center">
                            <div className="w-20 h-20 bg-violet-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl">
                                <Users className="h-8 w-8" />
                            </div>
                            <div className="w-8 h-8 bg-violet-800 rounded-full flex items-center justify-center mx-auto -mt-12 mb-8 text-white font-bold text-sm relative z-10">
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
            <section className="py-20 bg-gradient-to-r from-violet-600 to-purple-600">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Start Your Historical Journey Today
                    </h2>
                    <p className="text-xl text-violet-100 mb-8">
                        Join history enthusiasts discovering the stories hidden in their photos
                    </p>
                    <Button 
                        size="lg"
                        onClick={() => navigate('/login')}
                        className="bg-white text-violet-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold h-auto"
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