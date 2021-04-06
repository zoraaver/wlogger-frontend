import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { API } from "../config/axios.config";

const workoutPlansUrl = "/workoutPlans";

export interface workoutPlanData {
  name: string;
  length: number;
  current: boolean;
  weeks: Array<weekData>;
}

export interface weekData {
  position: number;
  workouts: Array<workoutData>;
  repeat: number;
}

export type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface workoutData {
  dayOfWeek: Day;
}

interface workoutPlanState {
  data: Array<workoutPlanData>;
  error: string | undefined;
  editWorkoutPlan: workoutPlanData | undefined;
}

export const postWorkoutPlan = createAsyncThunk(
  "workoutPlans/postWorkoutPlan",
  async (data: workoutPlanData) => {
    try {
      const response: AxiosResponse<any> = await API.post(
        workoutPlansUrl,
        data
      );
      return response.data;
    } catch (error) {
      if (error.response) return Promise.reject(error.response.data);
      return Promise.reject(error);
    }
  }
);

const initialState: workoutPlanState = {
  data: [],
  editWorkoutPlan: undefined,
  error: undefined,
};

const slice = createSlice({
  name: "workoutPlans",
  initialState,
  reducers: {
    setInitialWorkoutPlanData(state, action: PayloadAction<workoutPlanData>) {
      state.editWorkoutPlan = action.payload;
    },
    addWeek(state, action: PayloadAction<weekData>) {
      state.editWorkoutPlan?.weeks.push(action.payload);
    },
    addWorkout(state, action: PayloadAction<{ position: number; day: Day }>) {
      const { position, day } = action.payload;
      const weekIndex:
        | number
        | undefined = state.editWorkoutPlan?.weeks.findIndex(
        (week: weekData) => week.position === position
      );
      if (weekIndex !== undefined && weekIndex >= 0) {
        state.editWorkoutPlan?.weeks[weekIndex].workouts.push({
          dayOfWeek: day,
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(postWorkoutPlan.fulfilled, (state, action) => {
      console.log(action.payload);
    });
  },
});

export const workoutPlansReducer = slice.reducer;
export const { setInitialWorkoutPlanData, addWeek, addWorkout } = slice.actions;
