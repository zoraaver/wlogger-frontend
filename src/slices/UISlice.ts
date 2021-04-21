import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = { sidebarOpen: false };

const slice = createSlice({
  initialState,
  name: "UI",
  reducers: {
    toggleSidebar(state, action: PayloadAction<void>) {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

export const UIReducer = slice.reducer;
export const { toggleSidebar } = slice.actions;
