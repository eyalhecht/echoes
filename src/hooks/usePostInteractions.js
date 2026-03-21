import useUiStore from '../stores/useUiStore';
import { useAuthStore } from '../stores/useAuthStore';

export const usePostInteractions = (postId) => {
    const { user } = useAuthStore();
    const {
        posts,
        bookmarks,
        togglePostLike,
        togglePostBookmark,
        showAuthGate,
    } = useUiStore();

    const post = posts.find(p => p.id === postId) || bookmarks.find(p => p.id === postId);

    const handleLikeToggle = async () => {
        if (!user?.uid) { showAuthGate('Sign in to like posts and show your appreciation for great history.'); return; }
        postId && await togglePostLike(postId, user.uid);
    };

    const handleBookmarkToggle = async () => {
        if (!user?.uid) { showAuthGate('Sign in to bookmark posts and build your personal history collection.'); return; }
        postId && await togglePostBookmark(postId, user.uid);
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