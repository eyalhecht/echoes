import { create } from 'zustand';
import { callApiGateway } from '../firebaseConfig';

const useUiStore = create((set, get) => ({
    activeSidebarItem: 'Home',
    setActiveSidebarItem: (item) => set({ activeSidebarItem: item }),
    activeProfileView: null,
    setActiveProfileView: (item) => set({ activeProfileView: item }),
    exploreQuery: '',
    setExploreQuery: (query) => set({ exploreQuery: query }),
    posts: [],
    postsLoading: false,
    postsError: null,
    lastDocId: null,
    hasMore: true,
    setPosts: (posts) => set({ posts }),
    addPosts: (newPosts) => set((state) => ({
        posts: [...state.posts, ...newPosts]
    })),
    setLastDocId: (lastDocId) => set({ lastDocId }),
    setHasMore: (hasMore) => set({ hasMore }),
    addPost: (post) => set((state) => ({
        posts: [post, ...state.posts]
    })),
    deletePost: async (postId) => {
        try {
            const response = await callApiGateway({
                action: 'deletePost',
                payload: { postId: postId }
            });
            if (response.data.postId) {
                set((state) => ({
                    posts: state.posts.filter(post => post.id !== response.data.postId)
                }));
            }
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    },

    getLastPost: () => set((state)=>{
        return state.posts.length > 0 ? state.posts[state.posts.length - 1] : null;
    }),

    updatePost: (postId, updates) => set((state) => ({
        posts: state.posts.map(post =>
            post.id === postId
                ? { ...post, ...updates }
                : post
        )
    })),

    getPost: (postId) => {
        const state = get();
        return state.posts.find(post => post.id === postId) || null;
    },

    togglePostLike: async (postId, userId) => {
        const state = get();
        const post = state.posts.find(p => p.id === postId);

        if (!post || !userId || post.isLikeUpdating) return false;

        const wasLiked = post.likedByCurrentUser;
        const originalCount = post.likesCount || 0;

        try {
            // Optimistic update - instantly updates ALL components showing this post
            set((state) => ({
                posts: state.posts.map(p =>
                    p.id === postId
                        ? {
                            ...p,
                            likedByCurrentUser: !wasLiked,
                            likesCount: !wasLiked ? originalCount + 1 : Math.max(0, originalCount - 1),
                            isLikeUpdating: true,
                        }
                        : p
                )
            }));

            await callApiGateway({
                action: 'likePost',
                payload: { postId }
            });

            set((state) => ({
                posts: state.posts.map(p =>
                    p.id === postId
                        ? { ...p, isLikeUpdating: false }
                        : p
                )
            }));

            return true;

        } catch (error) {
            console.error("Error toggling like:", error);

            set((state) => ({
                posts: state.posts.map(p =>
                    p.id === postId
                        ? {
                            ...p,
                            likedByCurrentUser: wasLiked,
                            likesCount: originalCount,
                            isLikeUpdating: false,
                        }
                        : p
                )
            }));

            if (error.code === 'unauthenticated') {
                alert('Please log in to like posts');
            } else {
                alert('Failed to update like. Please try again.');
            }
            return false;
        }
    },

    togglePostBookmark: async (postId, userId) => {
        const state = get();
        const post = state.posts.find(p => p.id === postId);

        if (!post || !userId || post.isBookmarkUpdating) return false;

        const wasBookmarked = post.bookmarkedByCurrentUser;
        const originalCount = post.bookmarksCount || 0;

        try {
            // Optimistic update
            set((state) => ({
                posts: state.posts.map(p =>
                    p.id === postId
                        ? {
                            ...p,
                            bookmarkedByCurrentUser: !wasBookmarked,
                            bookmarksCount: !wasBookmarked ? originalCount + 1 : Math.max(0, originalCount - 1),
                            isBookmarkUpdating: true,
                        }
                        : p
                )
            }));

            await callApiGateway({
                action: 'toggleBookmark',
                payload: { postId }
            });

            set((state) => ({
                posts: state.posts.map(p =>
                    p.id === postId
                        ? { ...p, isBookmarkUpdating: false }
                        : p
                )
            }));

            return true;

        } catch (error) {
            console.error("Error toggling bookmark:", error);

            // Revert optimistic update
            set((state) => ({
                posts: state.posts.map(p =>
                    p.id === postId
                        ? {
                            ...p,
                            bookmarkedByCurrentUser: wasBookmarked,
                            bookmarksCount: originalCount,
                            isBookmarkUpdating: false,
                        }
                        : p
                )
            }));

            if (error.code === 'unauthenticated') {
                alert('Please log in to bookmark posts');
            } else if (error.code === 'not-found') {
                alert('Post not found');
            } else {
                alert('Failed to update bookmark. Please try again.');
            }
            return false;
        }
    },

    setPostsLoading: (loading) => set({ postsLoading: loading }),
    setPostsError: (error) => set({ postsError: error }),
}));

export default useUiStore;