import React, { useEffect, useState } from 'react';
import { useParams, Navigate, useNavigate, useLocation } from 'react-router-dom';
import useUiStore from '../stores/useUiStore.js';
import PostDetailView from './PostDetailView.jsx';

function PostPage() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { getPost, fetchPost, postsLoading, postsError } = useUiStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
    

    // Find the post in the store
    const post = getPost(postId);
    console.log('Post from store:', post);

    useEffect(() => {
        if (!post && !isLoading && !postsLoading && !hasAttemptedFetch) {
            setIsLoading(true);
            setError(null);
            setHasAttemptedFetch(true);
            
            fetchPost(postId)
                .then((fetchedPost) => {
                    console.log('Post fetched successfully:', fetchedPost); // Debug log
                })
                .catch((err) => {
                    console.error('Failed to fetch post:', err);
                    setError(err.message || 'Failed to fetch post');
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [postId, post, fetchPost, isLoading, postsLoading, hasAttemptedFetch]);

    // Show loading state
    if (isLoading || postsLoading) {
        return (
            <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading post...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error || postsError) {
        return (
            <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="text-red-500 mb-4">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error loading post</h2>
                    <p className="text-gray-600 mb-4">{error || postsError}</p>
                    <button 
                        onClick={() => window.history.back()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // If post not found after attempting to fetch, redirect to home
    if (!post && !isLoading && !postsLoading && hasAttemptedFetch) {
        return <Navigate to="/home" replace />;
    }

    // Render the post if found
    if (post) {
        const handleClose = () => {
            if (!location.state?.fromApp) {
                navigate('/home');
            } else {
                window.history.back();
            }
        };

        return (
            <div className="max-w-4xl mx-auto">
                <PostDetailView 
                    post={post} 
                    open={true} 
                    onClose={handleClose}
                />
            </div>
        );
    }

    // Fallback - shouldn't reach here but just in case
    return null;
}

export default PostPage;