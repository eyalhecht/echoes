// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../../firebaseConfig'; // Your initialized Firebase Auth instance

// Async Thunks for Firebase Auth Operations
const signUpWithEmail = createAsyncThunk(
    'auth/signUpWithEmail',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            return userCredential.user.toJSON(); // Return plain object
        } catch (error) {
            console.error("Sign Up Error:", error);
            return rejectWithValue(error.message); // Return error message
        }
    }
);

const loginWithEmail = createAsyncThunk(
    'auth/loginWithEmail',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user.toJSON();
        } catch (error) {
            console.error("Login Error:", error);
            return rejectWithValue(error.message);
        }
    }
);

const signInWithGoogle = createAsyncThunk(
    'auth/signInWithGoogle',
    async (_, { rejectWithValue }) => { // No payload needed for Google sign-in
        try {
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);
            return userCredential.user.toJSON();
        } catch (error) {
            console.error("Google Sign-In Error:", error);
            return rejectWithValue(error.message);
        }
    }
);

const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout Error:", error);
            return rejectWithValue(error.message);
        }
    }
);

// Manual Thunk for onAuthStateChanged listener
// This is not an async operation in the same way, it sets up a subscription
export const startListeningForAuthChanges = () => (dispatch) => {
    // This listener is crucial for keeping Redux state in sync with Firebase's internal auth state
    // It fires on initial load, login, logout, and token refresh.
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in. Dispatch action to update Redux state.
            dispatch(authSlice.actions.setUser(user.toJSON()));
        } else {
            // User is signed out. Dispatch action to clear Redux state.
            dispatch(authSlice.actions.clearUser());
        }
        // Also dispatch action to indicate initial loading is complete
        dispatch(authSlice.actions.setLoading(false));
    }, (error) => {
        // Handle errors during auth state observation
        console.error("Firebase Auth state change listener error:", error);
        dispatch(authSlice.actions.setError(error.message));
        dispatch(authSlice.actions.setLoading(false));
    });
};


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null, // Stores user object (uid, email, displayName, etc.) or null
        isAuthenticated: false,
        loading: true, // True initially while checking auth state
        error: null,
    },
    reducers: {
        // Synchronous reducers for internal state updates from onAuthStateChanged
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            state.error = null;
        },
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Handle pending, fulfilled, and rejected states for our async thunks
        builder
            // Sign Up, Login, Google Sign-In
            .addCase(signUpWithEmail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signUpWithEmail.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(signUpWithEmail.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload || 'Signup failed';
            })

            .addCase(loginWithEmail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginWithEmail.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginWithEmail.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload || 'Login failed';
            })

            .addCase(signInWithGoogle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signInWithGoogle.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(signInWithGoogle.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload || 'Google sign-in failed';
            })

            // Logout
            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                // Even if logout fails, we might want to clear local user state for safety
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload || 'Logout failed';
            });
    },
});

export default authSlice.reducer;

// Export generated actions for direct use (e.g., authSlice.actions.setUser)
export const { setUser, clearUser, setLoading, setError } = authSlice.actions;

// Export async thunks
export { signUpWithEmail, loginWithEmail, signInWithGoogle, logout };