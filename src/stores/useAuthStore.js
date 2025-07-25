import { create } from 'zustand';
import { auth, functions} from "../firebaseConfig.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';

const createUserProfileInFirestore = async (displayName, photoURL) => {
    try {
        const callable = httpsCallable(functions, 'apiGateway');
        await callable({
            action: 'createUserProfile',
            payload: { displayName, photoURL },
        });
    } catch (error) {
        console.error("Create Profile Error:", error);
    }
};

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,

    signUpWithEmail: async ({ email, password, displayName }) => {
        set({ loading: true, error: null });
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await createUserProfileInFirestore(displayName || user.displayName, user.photoURL);
            set({ user: user.toJSON(), isAuthenticated: true, loading: false });
        } catch (error) {
            console.error("Sign Up Error:", error);
            set({ error: error.message, loading: false });
        }
    },

    loginWithEmail: async ({ email, password }) => {
        set({ loading: true, error: null });
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            set({ user: userCredential.user.toJSON(), isAuthenticated: true, loading: false });
        } catch (error) {
            console.error("Login Error:", error);
            set({ error: error.message, loading: false });
        }
    },

    signInWithGoogle: async () => {
        set({ loading: true, error: null });
        try {
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;
            await createUserProfileInFirestore(user.displayName, user.photoURL);
            set({ user: user.toJSON(), isAuthenticated: true, loading: false });
        } catch (error) {
            console.error("Google Sign-In Error:", error);
            set({ error: error.message, loading: false });
        }
    },

    signInWithGitHub: async () => {
        set({ loading: true, error: null });
        try {
            const provider = new GithubAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;
            await createUserProfileInFirestore(user.displayName, user.photoURL);
            set({ user: user.toJSON(), isAuthenticated: true, loading: false });
        } catch (error) {
            console.error("GitHub Sign-In Error:", error);
            set({ error: error.message, loading: false });
        }
    },

    logout: async () => {
        set({ loading: true, error: null });
        try {
            await signOut(auth);
            set({ user: null, isAuthenticated: false, loading: false });
        } catch (error) {
            console.error("Logout Error:", error);
            set({ error: error.message, loading: false });
        }
    },

    startListeningForAuthChanges: () => {
        set({ loading: true });
        onAuthStateChanged(auth, (user) => {
            if (user) {
                set({ user: user.toJSON(), isAuthenticated: true, loading: false });
            } else {
                set({ user: null, isAuthenticated: false, loading: false });
            }
        }, (error) => {
            console.error("Auth listener error:", error);
            set({ error: error.message, loading: false });
        });
    },
}));
