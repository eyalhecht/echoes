import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeSidebarItem: 'Home',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveSidebarItem: (state, action) => {
      state.activeSidebarItem = action.payload;
    },
  },
});

export const { setActiveSidebarItem } = uiSlice.actions;

export default uiSlice.reducer;
