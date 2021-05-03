import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WorkoutLogPosition } from "./workoutLogsSlice";

interface UIState {
  sidebarOpen: boolean;
  currentVideoPlaying?: WorkoutLogPosition;
}

const initialState: UIState = { sidebarOpen: true };

const slice = createSlice({
  initialState,
  name: "UI",
  reducers: {
    toggleSidebar(state, action: PayloadAction<void>) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setCurrentSetVideo(
      state,
      action: PayloadAction<WorkoutLogPosition | undefined>
    ) {
      state.currentVideoPlaying = action.payload;
    },
  },
});

export const UIReducer = slice.reducer;
export const { toggleSidebar, setCurrentSetVideo } = slice.actions;
