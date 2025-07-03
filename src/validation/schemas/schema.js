import * as yup from 'yup';

export const commentSchema = yup.object().shape({
    userId: yup.string().required(),
    createdAt: yup.date().required(),
    text: yup.string().required(),
    userAvatar: yup.string().url().required(),
    userInitials: yup.string().required(),
    userName: yup.string().required(),
});

export const likeDocSchema = yup.object().shape({
    userId: yup.string().required(),
    createdAt: yup.date().required(),
});

export const postSchema = yup.object().shape({
    postId: yup.string().required(),
    userId: yup.string().required(),
    type: yup
        .mixed()
        .oneOf(['photo', 'video', 'document', 'item', 'youtube'])
        .required(),
    description: yup.string().required(),
    files: yup.array().of(yup.string()).required(),
    location: yup.string().required(),
    year: yup.string().required(),
    likesCount: yup.number().min(0).required(),
    commentsCount: yup.number().min(0).required(),
    bookmarksCount: yup.number().min(0).required(),
    createdAt: yup.date().required(),
    updatedAt: yup.date().required(),
    // Optionally: include nested subcollections for local use
    likes: yup.array().of(likeDocSchema).optional(),
    comments: yup.array().of(commentSchema).optional(),
});

export const userSchema = yup.object().shape({
    userId: yup.string().required(), // not stored inside the document, but often needed
    bio: yup.string().optional(),
    createdAt: yup.date().required(),
    displayName: yup.string().required(),
    email: yup.string().required(),
    username: yup.string().required(),
    profilePictureUrl: yup.string().url().required(),
    postsCount: yup.number().min(0).required(),
    updatedAt: yup.date().required(),

    // Optional subcollections (for local use only, not stored inside user doc)
    posts: yup.array().of(
        yup.object().shape({
            postId: yup.string().required(),
            createdAt: yup.date().required(),
        })
    ).optional(),

    likes: yup.array().of(
        yup.object().shape({
            postId: yup.string().required(),
            createdAt: yup.date().required(),
        })
    ).optional(),

    bookmarks: yup.array().of(
        yup.object().shape({
            postId: yup.string().required(),
            createdAt: yup.date().required(),
        })
    ).optional(),

    following: yup.array().of(
        yup.object().shape({
            targetUserId: yup.string().required(),
            createdAt: yup.date().required(),
        })
    ).optional(),

    followers: yup.array().of(
        yup.object().shape({
            followerUserId: yup.string().required(),
            createdAt: yup.date().required(),
        })
    ).optional(),
});

