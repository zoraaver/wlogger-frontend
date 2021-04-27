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
  workoutId?: string;
}

interface workoutLogState {
  success?: string;
  error?: string;
  data: Array<workoutLogHeaderData>;
  editWorkoutLog: workoutLogData;
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
  exerciseId?: string;
}

export interface exerciseLogData {
  name: string;
  exerciseId?: string;
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

export const deleteWorkoutLog = createAsyncThunk(
  "workoutLogs/deleteWorkoutLog",
  async (id: string) => {
    try {
      const response: AxiosResponse<string> = await API.delete(
        `${workoutLogUrl}/${id}`
      );
      return response.data;
    } catch (error) {
      if (error.response) return Promise.reject(error.response.data);
      return Promise.reject(error);
    }
  }
);

export const resetSuccess = createAsyncThunk(
  "workoutLogs/resetSuccess",
  async (seconds: number, { dispatch }) => {
    setTimeout(() => {
      dispatch(setSuccess(undefined));
    }, seconds * 1000);
  }
);

const initialState: workoutLogState = {
  data: [],
  editWorkoutLog: { exercises: [], createdAt: undefined },
};

const slice = createSlice({
  name: "workoutLogs",
  initialState,
  reducers: {
    addSet(state, action: PayloadAction<EntryData>) {
      const {
        name,
        repetitions,
        weight,
        unit,
        restInterval,
        exerciseId,
      } = action.payload;
      const exercises = state.editWorkoutLog.exercises;
      const lastLoggedExercise =
        exercises.length > 0 ? exercises[exercises.length - 1] : undefined;
      if (lastLoggedExercise && lastLoggedExercise.name === name) {
        lastLoggedExercise.sets.push({
          weight,
          unit,
          repetitions,
          restInterval,
        });
      } else {
        exercises.push({
          name,
          exerciseId,
          sets: [{ weight, unit, repetitions, restInterval }],
        });
      }
    },
    setWorkoutId(state, action: PayloadAction<string | undefined>) {
      state.editWorkoutLog.workoutId = action.payload;
    },
    setSuccess(state, action: PayloadAction<string | undefined>) {
      state.success = action.payload;
    },
    clearEditWorkoutLog(state, action: PayloadAction<void>) {
      state.editWorkoutLog = { exercises: [], createdAt: undefined };
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
      state.editWorkoutLog = { exercises: [] };
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
    builder.addCase(
      deleteWorkoutLog.fulfilled,
      (state, action: PayloadAction<string>) => {
        const deletedWorkoutLogId: string = action.payload;
        state.data = state.data.filter(
          (workoutLogHeader) => workoutLogHeader._id !== deletedWorkoutLogId
        );
        state.success = `Successfully deleted log`;
      }
    );
    builder.addCase(deleteWorkoutLog.rejected, (state, action) => {
      console.error(action.error.message);
      state.error = "Deleting workout failed";
      state.success = undefined;
    });
  },
});

export const workoutLogsReducer = slice.reducer;
export const {
  addSet,
  setSuccess,
  clearEditWorkoutLog,
  setWorkoutId,
} = slice.actions;
