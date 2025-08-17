import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, Clock, Flame, RotateCcw } from 'lucide-react';
import { callApiGateway } from '../firebaseConfig';
import MapPostCard from './MapPostCard';
import { useIsMobile } from "@/hooks/use-mobile.jsx";

export default function TrendingContent() {
    const isMobile = useIsMobile();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeframe, setTimeframe] = useState('30d');


    const fetchTrendingPosts = async (selectedTimeframe = timeframe) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await callApiGateway({
                action: 'getTrending',
                payload: {
                    timeframe: selectedTimeframe,
                    limit: isMobile ? 20 : 40
                }
            });

            setPosts(response.data.posts || []);
        } catch (err) {
            console.error('Error fetching trending posts:', err);
            setError('Failed to load trending posts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrendingPosts();
    }, []);

    const handleRetry = () => {
        fetchTrendingPosts();
    };

    if (loading) {
        return (
            <div className="flex-1 overflow-auto">
                <div className="max-w-4xl mx-auto p-4 md:p-6">
                    <div className="flex justify-center py-12">
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Loading trending content...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 overflow-auto">
                <div className="max-w-4xl mx-auto p-4 md:p-6">
                    <div className="text-center py-12">
                        <div className="text-4xl mb-4">⚠️</div>
                        <h2 className="text-lg md:text-xl font-semibold mb-2">Something went wrong</h2>
                        <p className="text-muted-foreground mb-4">{error}</p>
                        <Button onClick={handleRetry} className="gap-2">
                            <RotateCcw className="h-4 w-4" />
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto p-4 space-y-6">
                {/* Posts Grid */}
                {posts.length > 0 ? (
                    <div className="space-y-6">
                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                            {posts.map((post, index) => (
                                <div key={post.id} className="break-inside-avoid mb-4 relative">
                                    {index < 3 && (
                                        <Badge 
                                            className="absolute -top-2 -left-2 z-10 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                                        >
                                            <span className="hidden sm:inline">#{index + 1} Trending</span>
                                            <span className="sm:hidden">#{index + 1}</span>
                                        </Badge>
                                    )}
                                    <MapPostCard post={post} />
                                </div>
                            ))}
                        </div>

                        {/* Refresh Button */}
                        <div className="flex justify-center pt-4">
                            <Button 
                                onClick={handleRetry}
                                variant="outline"
                                disabled={loading}
                                className="gap-2"
                            >
                                <RotateCcw className="h-4 w-4" />
                                Refresh Trending
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-4xl mb-4">📊</div>
                        <h3 className="text-lg font-semibold mb-2">No Trending Content Yet</h3>
                        <p className="text-muted-foreground mb-4">
                            {timeframe === '1d' 
                                ? "No posts are trending today. Check back later!"
                                : timeframe === '7d'
                                ? "No posts are trending this week. Be the first to create engaging content!"
                                : "No posts are trending this month. Share some amazing historical content!"}
                        </p>
                        <Button onClick={handleRetry} variant="outline" className="gap-2">
                            <RotateCcw className="h-4 w-4" />
                            Refresh
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
