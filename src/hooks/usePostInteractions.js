import { useState } from 'react';
import { callApiGateway } from '../firebaseConfig';
import {useAuthStore} from "../stores/useAuthStore.js";

export const usePostInteractions = (post) => {
    const { user } = useAuthStore();

    // Like state
    const [liked, setLiked] = useState(post.likedByCurrentUser || false);
    const [likesCount, setLikesCount] = useState(post.likesCount || 0);
    const [isLikeUpdating, setIsLikeUpdating] = useState(false);

    // Bookmark state
    const [bookmarked, setBookmarked] = useState(post.bookmarkedByCurrentUser || false);
    const [bookmarksCount, setBookmarksCount] = useState(post.bookmarksCount || 0);
    const [isBookmarkUpdating, setIsBookmarkUpdating] = useState(false);

    const handleLikeToggle = async () => {
        if (!post.id || !user?.uid || isLikeUpdating) return;

        const originalLiked = liked;
        const originalCount = likesCount;

        try {
            setIsLikeUpdating(true);
            // Optimistic update
            setLiked(!liked);
            setLikesCount(prev => !liked ? prev + 1 : Math.max(0, prev - 1));

            await callApiGateway({
                action: 'likePost',
                payload: { postId: post.id }
            });

        } catch (error) {
            console.error("Error toggling like:", error);
            // Revert to original state
            setLiked(originalLiked);
            setLikesCount(originalCount);

            if (error.code === 'unauthenticated') {
                alert('Please log in to like posts');
            } else {
                alert('Failed to update like. Please try again.');
            }
        } finally {
            setIsLikeUpdating(false);
        }
    };

    const handleBookmarkToggle = async () => {
        if (!post.id || !user?.uid || isBookmarkUpdating) return;

        const originalBookmarked = bookmarked;
        const originalCount = bookmarksCount;

        try {
            setIsBookmarkUpdating(true);
            // Optimistic update
            setBookmarked(!bookmarked);
            setBookmarksCount(prev => !bookmarked ? prev + 1 : Math.max(0, prev - 1));

            await callApiGateway({
                action: 'toggleBookmark',
                payload: { postId: post.id }
            });

        } catch (error) {
            console.error("Error toggling bookmark:", error);
            // Revert optimistic update on error
            setBookmarked(originalBookmarked);
            setBookmarksCount(originalCount);

            if (error.code === 'unauthenticated') {
                alert('Please log in to bookmark posts');
            } else if (error.code === 'not-found') {
                alert('Post not found');
            } else {
                alert('Failed to update bookmark. Please try again.');
            }
        } finally {
            setIsBookmarkUpdating(false);
        }
    };

    return {
        liked,
        likesCount,
        isLikeUpdating,
        bookmarked,
        bookmarksCount,
        isBookmarkUpdating,
        handleLikeToggle,
        handleBookmarkToggle,
    };
};