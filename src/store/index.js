import { configureStore } from '@reduxjs/toolkit';
import uiSlice from './slices/uiSlice';
import authSlice from "./slices/authSlice.js";

export const store = configureStore({
  reducer: {
    ui: uiSlice,
    auth: authSlice
  },
});

export default store;
