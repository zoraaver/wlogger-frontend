import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { API } from "../config/axios.config";
import { weightUnit } from "./workoutPlansSlice";

const workoutLogUrl = "/workoutLogs";

export interface workoutLogData {
  exercises: Array<exerciseLogData>;
  createdAt?: string;
  updatedAt?: string;
  _id?: string;
}

interface workoutLogState {
  success?: string;
  error?: string;
  data: Array<workoutLogHeaderData>;
  editWorkoutLog?: workoutLogData;
}

export interface workoutLogHeaderData {
  createdAt: string;
  setCount: number;
  exerciseCount: number;
  _id: string;
}

export interface EntryData {
  name: string;
  repetitions: number;
  weight: number;
  unit: weightUnit;
  restInterval: number;
}

export interface exerciseLogData {
  name: string;
  sets: Array<setLogData>;
}

export interface setLogData {
  weight: number;
  repetitions: number;
  restInterval?: number;
  unit: weightUnit;
}

export const postWorkoutLog = createAsyncThunk(
  "workoutLogs/postWorkoutLog",
  async (data: workoutLogData) => {
    try {
      const response: AxiosResponse<workoutLogData> = await API.post(
        workoutLogUrl,
        data
      );
      return response.data;
    } catch (error) {
      if (error.response) return Promise.reject(error.response.data);
      return Promise.reject(error);
    }
  }
);

export const getWorkoutLogs = createAsyncThunk(
  "workoutLogs/getWorkoutLogs",
  async () => {
    try {
      const response: AxiosResponse<workoutLogHeaderData[]> = await API.get(
        workoutLogUrl
      );
      return response.data;
    } catch (error) {
      if (error.response) return Promise.reject(error.response.data);
      return Promise.reject(error);
    }
  }
);

export const getWorkoutLog = createAsyncThunk(
  "workoutLogs/getWorkoutLog",
  async (id: string) => {
    try {
      const response: AxiosResponse<workoutLogData> = await API.get(
        `${workoutLogUrl}/${id}`
      );
      return response.data;
    } catch (error) {
      if (error.response) return Promise.reject(error.response.data);
      return Promise.reject(error);
    }
  }
);

const initialState: workoutLogState = {
  data: [],
  editWorkoutLog: { exercises: [], createdAt: undefined },
};

const slice = createSlice({
  name: "workoutLogsSlice",
  initialState,
  reducers: {
    addSet(state, action: PayloadAction<EntryData>) {
      const { name, repetitions, weight, unit, restInterval } = action.payload;
      if (!state.editWorkoutLog) return;
      const exercises = state.editWorkoutLog.exercises;
      const exerciseAlreadyLogged = exercises.find(
        (exercise) => exercise.name === name
      );
      if (exerciseAlreadyLogged) {
        exerciseAlreadyLogged.sets.push({
          weight,
          unit,
          repetitions,
          restInterval,
        });
      } else {
        exercises.push({
          name,
          sets: [{ weight, unit, repetitions, restInterval }],
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      postWorkoutLog.fulfilled,
      (state, action: PayloadAction<workoutLogData>) => {
        const dateLogged: Date = new Date(action.payload.createdAt as string);
        state.success = `Successfully logged workout on ${dateLogged.toLocaleString()}`;
      }
    );
    builder.addCase(postWorkoutLog.rejected, (state, action) => {
      state.editWorkoutLog = undefined;
      console.error(action.error.message);
    });
    builder.addCase(
      getWorkoutLogs.fulfilled,
      (state, action: PayloadAction<workoutLogHeaderData[]>) => {
        state.data = action.payload;
      }
    );
    builder.addCase(
      getWorkoutLog.fulfilled,
      (state, action: PayloadAction<workoutLogData>) => {
        state.editWorkoutLog = action.payload;
      }
    );
    builder.addCase(getWorkoutLog.rejected, (state, action) => {
      console.error(action.error.message);
    });
  },
});

export const workoutLogsReducer = slice.reducer;
export const { addSet } = slice.actions;
