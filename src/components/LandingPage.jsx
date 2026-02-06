import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Sparkles,
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

const features = [
    {
        icon: Users,
        title: 'A Living Feed of History',
        description: 'Scroll through photos you\'ve never seen before — street scenes from the \'60s, vintage storefronts, faded family portraits. Like, comment, and share the moments that move you.',
    },
    {
        icon: MapPin,
        title: 'History on the Map',
        description: 'Every photo is tied to a real location on the map. Browse historical moments by location and see what the world looked like decades ago, right where you are.',
    },
    {
        icon: Search,
        title: 'Explore Any Era or Place',
        description: 'Search by decade, city, or subject. Looking for 1970s Paris? Cold War Berlin? There\'s always a photo you haven\'t seen yet.',
    },
    {
        icon: Brain,
        title: 'AI That Understands History',
        description: 'Every photo is automatically enriched — AI detects the time period, location, cultural context, and historical significance, so every post tells its full story.',
        accent: true,
    },
];

const steps = [
    {
        num: '01',
        icon: Upload,
        title: 'Share a Moment From the Past',
        description: 'That photo from grandma\'s drawer, a vintage street scene, a faded family portrait — upload it and give it a second life.',
    },
    {
        num: '02',
        icon: Brain,
        title: 'AI Adds the Story',
        description: 'Our AI analyzes every detail — architecture, clothing, vehicles, signs — and tells you when, where, and why this photo matters.',
    },
    {
        num: '03',
        icon: Users,
        title: 'The World Sees It Too',
        description: 'Your photo joins a living feed of history. Others like it, comment on it, and discover moments they\'ve never seen before.',
    },
];

function LandingPage() {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const scrollToSection = (sectionId) => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            {/* Navigation */}
            <nav className="bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="flex items-center space-x-2"
                            >
                                <Sparkles className="h-7 w-7 text-violet-400" />
                                <span className="text-xl font-bold text-zinc-100">Echoes</span>
                            </button>
                        </div>

                        <div className="hidden md:flex items-center space-x-8">
                            <button
                                onClick={() => scrollToSection('features')}
                                className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
                            >
                                Features
                            </button>

                            <button
                                onClick={() => scrollToSection('how-it-works')}
                                className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
                            >
                                How It Works
                            </button>
                            <Button
                                onClick={() => navigate('/login')}
                                className="bg-violet-600 hover:bg-violet-700 text-white text-sm"
                            >
                                Get Started
                            </Button>
                        </div>

                        <div className="md:hidden">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                            >
                                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </Button>
                        </div>
                    </div>

                    {mobileMenuOpen && (
                        <div className="md:hidden border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-md">
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                <button
                                    onClick={() => scrollToSection('features')}
                                    className="block px-3 py-2 text-sm text-zinc-400 hover:text-zinc-100 w-full text-left"
                                >
                                    Features
                                </button>
                                <button
                                    onClick={() => scrollToSection('how-it-works')}
                                    className="block px-3 py-2 text-sm text-zinc-400 hover:text-zinc-100 w-full text-left"
                                >
                                    How It Works
                                </button>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="block px-3 py-2 text-sm text-zinc-400 hover:text-zinc-100 w-full text-left"
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
            <section className="relative min-h-screen flex items-center overflow-hidden">
                {/* Gradient mesh background */}
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[128px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/15 blur-[128px]" />
                {/* Dot grid overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                    }}
                />

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] mb-8">
                        Your Photos Hold History.
                        <span className="block bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                            People Want to See It.
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 leading-relaxed mb-12">
                        That photo in your grandpa's drawer? Your dad's first car? The McDonald's
                        down the street before it was renovated? These are pure history -
                        and people want to see them.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            onClick={() => navigate('/login')}
                            className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 text-lg font-semibold h-auto"
                        >
                            Start Sharing History
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => scrollToSection('how-it-works')}
                            className="border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 px-8 py-4 text-lg font-semibold h-auto"
                        >
                            See How It Works
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section — Bento Grid */}
            <section id="features" className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-100 mb-4">
                            Social Media for History Lovers
                        </h2>
                        <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 leading-relaxed">
                            Share, discover, and discuss historical photos — with AI adding the context you never knew was there
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {features.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <Card
                                    key={feature.title}
                                    className={feature.accent
                                        ? "bg-gradient-to-br from-violet-950 via-violet-900 to-purple-950 border-violet-500/20"
                                        : "bg-zinc-900 border-zinc-800"
                                    }
                                >
                                    <CardHeader>
                                        <div className={`rounded-lg p-3 w-fit mb-2 ${feature.accent ? 'bg-violet-500/20' : 'bg-violet-500/10'}`}>
                                            <Icon className={`h-6 w-6 ${feature.accent ? 'text-violet-300' : 'text-violet-400'}`} />
                                        </div>
                                        <CardTitle className="text-lg font-semibold text-zinc-100">
                                            {feature.title}
                                        </CardTitle>
                                        <CardDescription className={feature.accent ? "text-violet-200/70" : "text-zinc-400"}>
                                            {feature.description}
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-100 mb-4">
                            How It Works
                        </h2>
                        <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 leading-relaxed">
                            From a dusty photo to a shared piece of history — in three steps
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.map((step) => {
                            const Icon = step.icon;
                            return (
                                <div key={step.num} className="relative text-left">
                                    {/* Watermark step number */}
                                    <span className="text-8xl font-bold text-zinc-800 leading-none select-none">
                                        {step.num}
                                    </span>
                                    <div className="mt-4 rounded-lg bg-violet-500/10 p-3 w-fit">
                                        <Icon className="h-5 w-5 text-violet-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-zinc-100 mt-4">
                                        {step.title}
                                    </h3>
                                    <p className="text-zinc-400 mt-2 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Card className="relative overflow-hidden bg-gradient-to-br from-violet-950 via-violet-900 to-purple-950 border-violet-500/20">
                        {/* Blurred glow */}
                        <div className="absolute top-[-50%] right-[-20%] w-[400px] h-[400px] rounded-full bg-violet-500/10 blur-[100px]" />

                        <CardContent className="relative p-8 md:p-16 text-center">
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-100 mb-6">
                                That Photo Deserves to Be Seen
                            </h2>
                            <p className="text-lg md:text-xl text-violet-200/70 mb-8 max-w-2xl mx-auto">
                                Share it. Let AI tell its story. Let the world discover it.
                            </p>
                            <Button
                                size="lg"
                                onClick={() => navigate('/login')}
                                className="bg-white text-violet-900 hover:bg-zinc-100 px-8 py-4 text-lg font-semibold h-auto"
                            >
                                Get Started Free
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-zinc-800 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <Sparkles className="h-5 w-5 text-violet-400" />
                            <span className="text-sm font-semibold text-zinc-300">Echoes</span>
                        </div>
                        <p className="text-zinc-500 text-xs">
                            © 2025 Echoes. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;
