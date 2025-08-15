import React, { useEffect, useCallback } from 'react';
import { callApiGateway } from "../firebaseConfig.js";
import PostCard from "./PostCard.jsx";
import useUiStore from "../stores/useUiStore.js";
import { PostCardSkeleton } from "@/components/PostCardSkeleton.jsx";
import { cn } from "@/lib/utils";
import { Bookmark, BookmarkIcon } from 'lucide-react';

function Bookmarks() {
    const { 
        bookmarks, 
        setBookmarks, 
        addBookmarks, 
        setBookmarksLoading, 
        bookmarksLoading,
        bookmarksLastDocId,
        setBookmarksLastDocId,
        bookmarksHasMore,
        setBookmarksHasMore,
        bookmarksError,
        setBookmarksError
    } = useUiStore();

    // Load more bookmarks function with useCallback to prevent recreation
    const loadMoreBookmarks = useCallback(async () => {
        if (!bookmarksHasMore || bookmarksLoading) return; // Safety check
        
        console.log('Loading more bookmarks...', { bookmarksLastDocId, bookmarksHasMore, bookmarksLoading });
        setBookmarksLoading(true);
        setBookmarksError(null);
        
        try {
            const response = await callApiGateway({
                action: 'getBookmarks',
                payload: {
                    limit: 10,
                    lastBookmarkId: bookmarksLastDocId
                }
            });
            
            addBookmarks(response.data.posts); // Append to existing bookmarks
            setBookmarksLastDocId(response.data.lastDocId);
            setBookmarksHasMore(response.data.hasMore);
            console.log("More bookmarks loaded:", response.data);
        } catch (error) {
            console.error('Failed to load more bookmarks:', error);
            setBookmarksError(error.message || 'Failed to load bookmarks');
        } finally {
            setBookmarksLoading(false);
        }
    }, [bookmarksHasMore, bookmarksLoading, bookmarksLastDocId, addBookmarks, setBookmarksLastDocId, setBookmarksHasMore, setBookmarksLoading, setBookmarksError]);

    // Load initial bookmarks
    useEffect(() => {
        const getBookmarks = async () => {
            setBookmarksLoading(true);
            setBookmarksError(null);
            
            try {
                const response = await callApiGateway({
                    action: 'getBookmarks',
                    payload: {
                        limit: 10,
                        lastBookmarkId: null // Start from beginning
                    }
                });
                
                setBookmarks(response.data.posts);
                setBookmarksLastDocId(response.data.lastDocId);
                setBookmarksHasMore(response.data.hasMore);
                console.log("Initial bookmarks loaded:", response.data);
            } catch (error) {
                console.error('Failed to load bookmarks:', error);
                setBookmarksError(error.message || 'Failed to load bookmarks');
            } finally {
                setBookmarksLoading(false);
            }
        }
        
        getBookmarks();
    }, [setBookmarks, setBookmarksLastDocId, setBookmarksHasMore, setBookmarksLoading, setBookmarksError]);

    // Infinite scroll handler
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const lastThirdStart = documentHeight * (2 / 3);
            // Trigger when the bottom of the viewport has scrolled past the start of the last third
            const reachesLastThird = (scrollTop + windowHeight) >= lastThirdStart;

            if (reachesLastThird && bookmarksHasMore && !bookmarksLoading) {
                console.log('Scroll triggered load more bookmarks');
                loadMoreBookmarks();
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMoreBookmarks, bookmarksHasMore, bookmarksLoading]);

    const renderSkeletonCards = () => (
        Array.from({ length: 5 }).map((_, index) => (
            <PostCardSkeleton key={`bookmark-skeleton-${index}`} />
        ))
    );

    return (
        <div className={cn(
            "max-w-[600px] mx-auto pb-5 gap-2 flex flex-col"
        )}>

            {/* Error state */}
            {bookmarksError && (
                <div className="text-center py-8 text-red-500">
                    <p>Error: {bookmarksError}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Loading skeletons for initial load */}
            {bookmarksLoading && bookmarks.length === 0 && !bookmarksError && renderSkeletonCards()}

            {/* Bookmarked posts */}
            {bookmarks && bookmarks?.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}

            {/* Show loading for pagination (when loading more bookmarks) */}
            {bookmarksLoading && bookmarks.length > 0 && (
                <div className="text-center py-5 text-muted-foreground">
                    Loading more bookmarks...
                </div>
            )}

            {/* End of list message */}
            {!bookmarksHasMore && bookmarks.length > 0 && (
                <div className="text-center py-5 text-muted-foreground">
                    No more bookmarks to load
                </div>
            )}

            {/* Empty state */}
            {bookmarks.length === 0 && !bookmarksLoading && !bookmarksError && (
                <div className="text-center py-16 text-muted-foreground/70">
                    <BookmarkIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No bookmarks yet</h3>
                    <p>Start bookmarking posts you want to save for later!</p>
                </div>
            )}
        </div>
    );
}

export default Bookmarks;
