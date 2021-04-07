import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { API } from "../config/axios.config";

const workoutPlansUrl = "/workoutPlans";

export interface workoutPlanData {
  _id?: string;
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

export interface workoutPlanHeaderData {
  name: string;
  length: number;
  _id: string;
}

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
  data: Array<workoutPlanHeaderData>;
  error: string | undefined;
  editWorkoutPlan: workoutPlanData | undefined;
  success: string | undefined;
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

export const getWorkoutPlans = createAsyncThunk(
  "workoutPlans/getWorkoutPlans",
  async () => {
    try {
      const response: AxiosResponse<workoutPlanHeaderData[]> = await API.get(
        workoutPlansUrl
      );
      return response.data;
    } catch (error) {
      if (error.response) return Promise.reject(error.response.data);
      return Promise.reject(error);
    }
  }
);

export const getWorkoutPlan = createAsyncThunk(
  "workoutPlans/getWorkoutPlan",
  async (_id: string) => {
    try {
      const response: AxiosResponse<workoutPlanData> = await API.get(
        `${workoutPlansUrl}/${_id}`
      );
      return response.data;
    } catch (error) {
      if (error.response) return Promise.reject(error.response.data);
      return Promise.reject(error);
    }
  }
);

export const patchWorkoutPlan = createAsyncThunk(
  "workoutPlans/patchWorkoutPlan",
  async (workoutPlanData: workoutPlanData) => {
    try {
      const response: AxiosResponse<workoutPlanData> = await API.patch(
        `${workoutPlansUrl}/${workoutPlanData._id}`,
        workoutPlanData
      );
      return response.data;
    } catch (error) {
      if (error.response) return Promise.reject(error.response.data);
      return Promise.reject(error);
    }
  }
);

export const deleteWorkoutPlan = createAsyncThunk(
  "workoutPlans/deleteWorkoutPlan",
  async (_id: string) => {
    try {
      const response: AxiosResponse<workoutPlanData["_id"]> = await API.delete(
        `${workoutPlansUrl}/${_id}`
      );
      return response.data;
    } catch (error) {
      if (error.response) return Promise.reject(error.response.data);
      return Promise.reject(error);
    }
  }
);

export const resetSuccess = createAsyncThunk(
  "workoutPlans/resetSuccess",
  async (seconds: number, { dispatch }) => {
    setTimeout(() => {
      dispatch(setSuccess(undefined));
    }, 1000 * seconds);
  }
);

const initialState: workoutPlanState = {
  data: [],
  editWorkoutPlan: undefined,
  success: undefined,
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
    deleteExercise(
      state,
      action: PayloadAction<{
        weekPosition: number;
        day: Day;
        exerciseIndex: number;
      }>
    ) {
      const { weekPosition, day, exerciseIndex } = action.payload;
      const week = state.editWorkoutPlan?.weeks.find(
        (week: weekData) => week.position === weekPosition
      );
      if (week !== undefined) {
        const workout = week.workouts.find(
          (workout: workoutData) => workout.dayOfWeek === day
        );
        if (workout !== undefined) {
          workout.exercises.splice(exerciseIndex, 1);
        }
      }
    },
    deleteWeek(state, action: PayloadAction<number>) {
      const position: number = action.payload;
      if (!state.editWorkoutPlan) return;
      const weeks = state.editWorkoutPlan.weeks;
      const weekToDeleteIndex = weeks.findIndex(
        (week: weekData) => week.position === position
      );
      if (weekToDeleteIndex !== undefined && weekToDeleteIndex >= 0) {
        weeks.forEach((week: weekData) => {
          if (week.position > weeks[weekToDeleteIndex].position) {
            --week.position;
          }
        });
        state.editWorkoutPlan?.weeks.splice(weekToDeleteIndex, 1);
      }
    },
    deleteWorkout(
      state,
      action: PayloadAction<{ position: number; day: Day }>
    ) {
      if (!state.editWorkoutPlan) return;
      const { position, day } = action.payload;
      const week = state.editWorkoutPlan.weeks.find(
        (week: weekData) => week.position === position
      );
      if (week !== undefined) {
        const workoutToDeleteIndex = week.workouts.findIndex(
          (workout: workoutData) => workout.dayOfWeek === day
        );
        if (workoutToDeleteIndex !== undefined && workoutToDeleteIndex >= 0) {
          week.workouts.splice(workoutToDeleteIndex, 1);
        }
      }
    },
    deleteEmptyWorkouts(state, action: PayloadAction<number>) {
      if (!state.editWorkoutPlan) return;
      const postion: number = action.payload;
      const week = state.editWorkoutPlan.weeks.find(
        (week: weekData) => week.position === postion
      );
      if (week !== undefined) {
        week.workouts = week.workouts.filter(
          (workout: workoutData) => workout.exercises.length !== 0
        );
      }
    },
    setSuccess(state, action: PayloadAction<string | undefined>) {
      state.success = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      postWorkoutPlan.fulfilled,
      (state, action: PayloadAction<workoutPlanData>) => {
        state.success = `${action.payload.name} successfully created`;
        state.editWorkoutPlan = action.payload;
      }
    );
    builder.addCase(postWorkoutPlan.rejected, (state, action) => {
      state.success = undefined;
    });
    builder.addCase(getWorkoutPlans.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(
      getWorkoutPlan.fulfilled,
      (state, action: PayloadAction<workoutPlanData>) => {
        state.editWorkoutPlan = action.payload;
      }
    );
    builder.addCase(getWorkoutPlan.rejected, (state, action) => {
      state.editWorkoutPlan = undefined;
    });
    builder.addCase(
      patchWorkoutPlan.fulfilled,
      (state, action: PayloadAction<workoutPlanData>) => {
        state.editWorkoutPlan = action.payload;
        state.success = `${action.payload.name} successfully updated`;
      }
    );
    builder.addCase(patchWorkoutPlan.rejected, (state, action) => {
      state.editWorkoutPlan = undefined;
    });
    builder.addCase(
      deleteWorkoutPlan.fulfilled,
      (state, action: PayloadAction<workoutPlanData["_id"]>) => {
        state.editWorkoutPlan = undefined;
        state.data = state.data.filter(
          (workoutPlanHeader: workoutPlanHeaderData) =>
            workoutPlanHeader._id !== action.payload
        );
        state.success = `Plan successfully deleted`;
      }
    );
    builder.addCase(deleteWorkoutPlan.rejected, (state, action) => {
      state.editWorkoutPlan = undefined;
    });
  },
});

export const workoutPlansReducer = slice.reducer;
export const {
  setInitialWorkoutPlanData,
  addWeek,
  addWorkout,
  addExercise,
  deleteExercise,
  deleteWeek,
  deleteWorkout,
  deleteEmptyWorkouts,
  setSuccess,
} = slice.actions;
