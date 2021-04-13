import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { API } from "../config/axios.config";
import { weightUnit } from "./workoutPlansSlice";

const workoutLogUrl = "/workoutLogs";

interface workoutLogData {
  exercises: Array<exerciseLogData>;
  createdAt?: string;
  updatedAt?: string;
  _id?: string;
}

interface workoutLogState {
  data: Array<workoutLogHeaderData>;
  editWorkoutLog?: workoutLogData;
}

interface workoutLogHeaderData {
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
      const response: AxiosResponse<any> = await API.post(workoutLogUrl, data);
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
      (state, action: PayloadAction<any>) => {
        console.log(action.payload);
      }
    );
    builder.addCase(postWorkoutLog.rejected, (state, action) => {
      console.error(action.error.message);
    });
    builder.addCase(
      getWorkoutLogs.fulfilled,
      (state, action: PayloadAction<workoutLogHeaderData[]>) => {
        state.data = action.payload;
      }
    );
  },
});

export const workoutLogsReducer = slice.reducer;
export const { addSet } = slice.actions;
