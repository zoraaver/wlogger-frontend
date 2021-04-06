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

export interface exerciseData {
  name: string;
  restInterval?: number;
  sets: number;
  repetitions?: number;
  weight?: number;
  unit: weightUnit;
}

export interface workoutData {
  dayOfWeek: Day;
  exercises: Array<exerciseData>;
}

export type weightUnit = "kg" | "lb";

export type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

const daysToNumbers: { [dayOfWeek: string]: number } = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
};

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
          exercises: [],
        });
        state.editWorkoutPlan?.weeks[weekIndex].workouts.sort(
          (a, b) => daysToNumbers[a.dayOfWeek] - daysToNumbers[b.dayOfWeek]
        );
      }
    },
    addExercise(
      state,
      action: PayloadAction<{
        position: number;
        day: Day;
        exerciseData: exerciseData;
      }>
    ) {
      const { position, day, exerciseData } = action.payload;
      const weekIndex:
        | number
        | undefined = state.editWorkoutPlan?.weeks.findIndex(
        (week: weekData) => week.position === position
      );
      if (weekIndex !== undefined && weekIndex >= 0) {
        const workout = state.editWorkoutPlan?.weeks[weekIndex].workouts.find(
          (w: workoutData) => w.dayOfWeek === day
        );
        if (workout) {
          workout.exercises.push(exerciseData);
        }
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
export const {
  setInitialWorkoutPlanData,
  addWeek,
  addWorkout,
  addExercise,
} = slice.actions;
