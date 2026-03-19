import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw } from 'lucide-react';
import { Spinner } from "@/components/ui/spinner";
import { callApiGateway } from '../firebaseConfig';
import MapPostCard from './MapPostCard';
import { useIsMobile } from "@/hooks/use-mobile.jsx";
import useUiStore from '../stores/useUiStore';

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const PAGE_SIZE = 12;

export default function TrendingContent() {
    const isMobile = useIsMobile();
    const { trendingPosts, trendingFetchedAt, setTrending } = useUiStore();

    const [posts, setPosts] = useState([]);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const sentinelRef = useRef(null);

    const isCacheFresh =
        trendingFetchedAt && (Date.now() - trendingFetchedAt) < CACHE_TTL_MS;

    const fetchTrendingPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await callApiGateway({
                action: 'getTrending',
                payload: { timeframe: '7d', limit: isMobile ? 20 : 40 }
            });
            const fetched = response.data.posts || [];
            setPosts(fetched);
            setTrending(fetched);
            setVisibleCount(PAGE_SIZE);
        } catch (err) {
            console.error('Error fetching trending posts:', err);
            setError('Failed to load trending posts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isCacheFresh && trendingPosts.length > 0) {
            setPosts(trendingPosts);
            setLoading(false);
            return;
        }
        fetchTrendingPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Progressive reveal via IntersectionObserver
    useEffect(() => {
        if (!sentinelRef.current || visibleCount >= posts.length) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisibleCount(prev => Math.min(prev + PAGE_SIZE, posts.length));
                }
            },
            { rootMargin: '300px' }
        );
        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [visibleCount, posts.length]);

    if (loading) {
        return (
            <div className="flex-1 overflow-auto">
                <div className="max-w-4xl mx-auto p-4 md:p-6">
                    <div className="flex justify-center py-12">
                        <div className="flex items-center gap-2">
                            <Spinner size="md" />
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
                        <Button onClick={fetchTrendingPosts} className="gap-2">
                            <RotateCcw className="h-4 w-4" />
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const visiblePosts = posts.slice(0, visibleCount);
    const hasMore = visibleCount < posts.length;

    return (
        <div className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto p-4 space-y-6">
                {posts.length > 0 ? (
                    <div className="space-y-6">
                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                            {visiblePosts.map((post, index) => (
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

                        {/* Infinite scroll sentinel */}
                        <div ref={sentinelRef} className="h-8 flex justify-center items-center">
                            {hasMore && <Spinner size="sm" />}
                        </div>

                        {/* Refresh button */}
                        <div className="flex justify-center pt-2">
                            <Button
                                onClick={fetchTrendingPosts}
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
                            No posts are trending this week. Be the first to share something amazing!
                        </p>
                        <Button onClick={fetchTrendingPosts} variant="outline" className="gap-2">
                            <RotateCcw className="h-4 w-4" />
                            Refresh
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
