import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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

const features = [
    {
        icon: Clock,
        title: 'AI Historical Dating',
        description: 'Our AI analyzes architectural styles, clothing, vehicles, and visual cues to estimate when your photo was taken.',
        span: 'lg:col-span-2 lg:row-span-2',
        showcase: true,
    },
    {
        icon: MapPin,
        title: 'Smart Geolocation',
        description: 'Identifies landmarks, buildings, and geographical features to pinpoint where historical moments happened.',
        span: 'lg:col-span-2',
    },
    {
        icon: Search,
        title: 'Intelligent Search',
        description: 'Search across all AI-generated metadata. Find photos by era, location, architectural style, or any historical element.',
        span: 'lg:col-span-2',
    },
    {
        icon: Users,
        title: 'Community',
        description: 'Share discoveries with history enthusiasts. Build connections through shared historical interests and collaborative research.',
        span: 'lg:col-span-4',
        accent: true,
    },
];

const steps = [
    {
        num: '01',
        icon: Upload,
        title: 'Upload Your Photo',
        description: 'Simply drag and drop any historical photo from your collection. Family photos, vintage finds, or mysterious old images.',
    },
    {
        num: '02',
        icon: Brain,
        title: 'AI Analyzes History',
        description: 'Our advanced AI examines every detail — architecture, clothing, vehicles, and context clues to determine the period and location.',
    },
    {
        num: '03',
        icon: Users,
        title: 'Share & Discover',
        description: 'Share your discoveries with the community and explore others\' findings. Build connections through shared historical interests.',
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
                                onClick={() => scrollToSection('demo')}
                                className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
                            >
                                Demo
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
                                    onClick={() => scrollToSection('demo')}
                                    className="block px-3 py-2 text-sm text-zinc-400 hover:text-zinc-100 w-full text-left"
                                >
                                    Demo
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
                        Turn Your Photos Into
                        <span className="block bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                            Historical Discoveries
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 leading-relaxed mb-12">
                        Upload any photo and let AI reveal its historical context, date period, and location.
                        Connect with a community passionate about preserving history.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                            Powered by AI, Driven by History
                        </h2>
                        <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 leading-relaxed">
                            Unlike other photo apps, Echoes reveals the hidden stories in your images
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {features.map((feature) => {
                            const Icon = feature.icon;

                            if (feature.accent) {
                                return (
                                    <Card
                                        key={feature.title}
                                        className={`${feature.span} bg-gradient-to-br from-violet-950 via-violet-900 to-purple-950 border-violet-500/20`}
                                    >
                                        <CardHeader className="flex flex-col md:flex-row md:items-center gap-4">
                                            <div className="rounded-lg bg-violet-500/20 p-3 w-fit">
                                                <Icon className="h-6 w-6 text-violet-300" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg font-semibold text-zinc-100">
                                                    {feature.title}
                                                </CardTitle>
                                                <CardDescription className="text-violet-200/70 mt-1">
                                                    {feature.description}
                                                </CardDescription>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                );
                            }

                            return (
                                <Card
                                    key={feature.title}
                                    className={`${feature.span} bg-zinc-900 border-zinc-800`}
                                >
                                    <CardHeader>
                                        <div className="rounded-lg bg-violet-500/10 p-3 w-fit mb-2">
                                            <Icon className="h-6 w-6 text-violet-400" />
                                        </div>
                                        <CardTitle className="text-lg font-semibold text-zinc-100">
                                            {feature.title}
                                        </CardTitle>
                                        <CardDescription className="text-zinc-400">
                                            {feature.description}
                                        </CardDescription>
                                    </CardHeader>

                                    {feature.showcase && (
                                        <CardContent>
                                            {/* Decorative inline UI mockup */}
                                            <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-zinc-500">Estimated Date</span>
                                                    <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/10 text-xs">
                                                        1950s–1960s
                                                    </Badge>
                                                </div>
                                                <Separator className="bg-zinc-800" />
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-zinc-500">Confidence</span>
                                                    <span className="text-xs text-zinc-300 font-medium">92%</span>
                                                </div>
                                                <Separator className="bg-zinc-800" />
                                                <div className="space-y-1.5">
                                                    <span className="text-xs text-zinc-500">Signals</span>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        <Badge variant="outline" className="text-zinc-400 border-zinc-700 text-xs">Architecture</Badge>
                                                        <Badge variant="outline" className="text-zinc-400 border-zinc-700 text-xs">Signage</Badge>
                                                        <Badge variant="outline" className="text-zinc-400 border-zinc-700 text-xs">Materials</Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Demo / Glassmorphism Showcase */}
            <section id="demo" className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-100 mb-4">
                            See Echoes in Action
                        </h2>
                        <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 leading-relaxed">
                            Watch how our AI transforms a mysterious old photo into a rich historical discovery
                        </p>
                    </div>

                    <div className="max-w-2xl mx-auto">
                        <Card className="bg-zinc-900/50 backdrop-blur-xl border-zinc-700/50">
                            <CardContent className="p-6 md:p-8">
                                {/* Placeholder gradient for photo */}
                                <div className="relative aspect-video rounded-lg bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-800 mb-6 flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent" />
                                    <Brain className="h-12 w-12 text-zinc-600" />
                                    <Badge className="absolute top-3 right-3 bg-violet-600 text-white border-transparent hover:bg-violet-600">
                                        AI Analyzed
                                    </Badge>
                                </div>

                                {/* Data rows */}
                                <div className="space-y-0">
                                    <div className="flex justify-between py-3">
                                        <span className="text-sm text-zinc-500">Date</span>
                                        <span className="text-sm text-zinc-200 font-medium">1950s–1960s</span>
                                    </div>
                                    <Separator className="bg-zinc-800" />
                                    <div className="flex justify-between py-3">
                                        <span className="text-sm text-zinc-500">Location</span>
                                        <span className="text-sm text-zinc-200 font-medium">Brieske, Germany</span>
                                    </div>
                                    <Separator className="bg-zinc-800" />
                                    <div className="flex justify-between py-3">
                                        <span className="text-sm text-zinc-500">Type</span>
                                        <span className="text-sm text-zinc-200 font-medium">Educational Building</span>
                                    </div>
                                    <Separator className="bg-zinc-800" />
                                    <div className="flex justify-between py-3">
                                        <span className="text-sm text-zinc-500">Confidence</span>
                                        <span className="text-sm text-zinc-200 font-medium">92%</span>
                                    </div>
                                </div>

                                {/* AI Insight */}
                                <div className="mt-6 p-4 rounded-lg bg-violet-500/10 border border-violet-500/20">
                                    <p className="text-sm text-zinc-300">
                                        <span className="font-semibold text-violet-400">AI Insight:</span>{' '}
                                        Historical school building showing mid-20th century German architecture.
                                        The structure and signage indicate educational use during the post-war period.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/10">
                            How It Works
                        </Badge>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-100 mb-4">
                            Three Simple Steps
                        </h2>
                        <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 leading-relaxed">
                            From upload to historical discovery in minutes
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
                                Start Your Historical Journey Today
                            </h2>
                            <p className="text-lg md:text-xl text-violet-200/70 mb-8 max-w-2xl mx-auto">
                                Join history enthusiasts discovering the stories hidden in their photos
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
