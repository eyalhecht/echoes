import { useState, useCallback } from 'react';
import commentService from '../services/commentService.js';

export const useComments = (postId) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(false);
    const [lastCommentId, setLastCommentId] = useState(null);

    // Load comments
    const loadComments = useCallback(async (isLoadMore = false) => {
        if (isLoadMore) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }
        setError(null);

        try {
            const { comments: newComments, hasMore: moreAvailable, lastDocId } = 
                await commentService.getComments(postId, {
                    limit: 20,
                    lastCommentId: isLoadMore ? lastCommentId : null
                });

            if (isLoadMore) {
                setComments(prev => [...prev, ...newComments]);
            } else {
                setComments(newComments);
            }
            
            setHasMore(moreAvailable);
            setLastCommentId(lastDocId);

        } catch (err) {
            console.error('Error loading comments:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [postId, lastCommentId]);

    // Add comment
    const addComment = useCallback(async (text) => {
        if (!text.trim()) return null;

        setSubmitting(true);
        setError(null);

        try {
            const result = await commentService.addComment(postId, text.trim());
            const { comment, newCommentsCount } = result;
            
            // Add the new comment to the beginning of the list
            setComments(prev => [comment, ...prev]);
            
            return { comment, newCommentsCount };

        } catch (err) {
            console.error('Error adding comment:', err);
            setError(err.message);
            throw err;
        } finally {
            setSubmitting(false);
        }
    }, [postId]);

    // Reset comments state
    const resetComments = useCallback(() => {
        setComments([]);
        setLastCommentId(null);
        setHasMore(false);
        setError(null);
    }, []);

    return {
        comments,
        loading,
        submitting,
        loadingMore,
        error,
        hasMore,
        loadComments,
        addComment,
        resetComments,
        setError
    };
};