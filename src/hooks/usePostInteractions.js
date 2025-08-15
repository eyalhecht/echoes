import useUiStore from '../stores/useUiStore';
import { useAuthStore } from '../stores/useAuthStore';

export const usePostInteractions = (postId) => {
    const { user } = useAuthStore();
    const {
        posts,
        bookmarks,
        togglePostLike,
        togglePostBookmark
    } = useUiStore();

    const post = posts.find(p => p.id === postId) || bookmarks.find(p => p.id === postId);

    const handleLikeToggle = async () => {
            postId && user?.uid && await togglePostLike(postId, user.uid);
    };

    const handleBookmarkToggle = async () => {
        postId && user?.uid && await togglePostBookmark(postId, user.uid);
    };

    return {
        liked: post?.likedByCurrentUser || false,
        likesCount: post?.likesCount || 0,
        bookmarked: post?.bookmarkedByCurrentUser || false,
        bookmarksCount: post?.bookmarksCount || 0,
        isBookmarkUpdating: post?.isBookmarkUpdating || false,
        handleLikeToggle,
        handleBookmarkToggle,
        post,
    };
};