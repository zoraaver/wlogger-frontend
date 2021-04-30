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
  formVideoError?: string;
  videoUploadInProgress: boolean;
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
  formVideo?: string;
  formVideoSize?: number;
  restInterval?: number;
  unit: weightUnit;
}

type videoFileExtension = "mp4" | "mkv" | "mov";
const validVideoFileExtensions: videoFileExtension[] = ["mov", "mp4", "mkv"];

export type WorkoutLogPosition = { setIndex: number; exerciseIndex: number };
type FileObj = WorkoutLogPosition & { file: File };

const logVideoFiles: FileObj[] = [];

export const addFormVideo = createAsyncThunk(
  "workoutLogs/addFormVideo",
  async (position: WorkoutLogPosition & { file: File }, { dispatch }) => {
    const megaByte = 1000000;
    const { file, setIndex, exerciseIndex } = position;
    const fileExtension = file.name.split(".").pop();
    if (
      !fileExtension ||
      !validVideoFileExtensions.includes(fileExtension as videoFileExtension)
    ) {
      dispatch(
        setFormVideoError(
          `${fileExtension} is not an allowed file type: Allowed types are 'mov', 'mp4' and 'avi'`
        )
      );
    } else if (file.size > 50 * megaByte) {
      dispatch(setFormVideoError(`File size cannot exceed 50 MB`));
    } else if (logVideoFiles.length >= 5) {
      dispatch(
        setFormVideoError(
          "A maximum of 5 form videos are allowed per workout log"
        )
      );
    } else {
      logVideoFiles.push({ file, setIndex, exerciseIndex });
      dispatch(setFormVideo({ exerciseIndex, setIndex, fileName: file.name }));
    }
    console.log(logVideoFiles);
  }
);

export const removeFormVideo = createAsyncThunk(
  "workoutLogs/removeFormVideo",
  async (position: WorkoutLogPosition, { dispatch }) => {
    const { setIndex, exerciseIndex } = position;
    const fileToRemoveIndex: number = logVideoFiles.findIndex(
      (fileObj: FileObj) =>
        fileObj.exerciseIndex === exerciseIndex && fileObj.setIndex === setIndex
    );
    if (fileToRemoveIndex >= 0) {
      logVideoFiles.splice(fileToRemoveIndex, 1);
    }
    dispatch(setFormVideo(position));
    console.log(logVideoFiles);
  }
);

export const clearFormVideos = createAsyncThunk(
  "workoutLogs/clearFormVideos",
  async () => {
    logVideoFiles.splice(0, logVideoFiles.length);
  }
);

export const postFormVideos = createAsyncThunk(
  "workoutLogs/postFormVideos",
  async (id: string) => {
    const logFormData = new FormData();

    for (const { file, setIndex, exerciseIndex } of logVideoFiles) {
      const fileExtension: string = file.name.split(".").pop() as string;
      const fileName = [exerciseIndex, setIndex, fileExtension].join(".");
      logFormData.append("formVideos", file, fileName);
    }

    try {
      const response: AxiosResponse<any> = await API.post(
        `${workoutLogUrl}/${id}/videoUpload`,
        logFormData
      );
      return response.data;
    } catch (error) {
      if (error.response) return Promise.reject(error.response.data);
      return Promise.reject(error);
    }
  }
);

export const postWorkoutLog = createAsyncThunk(
  "workoutLogs/postWorkoutLog",
  async (data: workoutLogData, { dispatch }) => {
    try {
      const response: AxiosResponse<workoutLogData> = await API.post(
        workoutLogUrl,
        data
      );
      if (logVideoFiles.length > 0)
        await dispatch(postFormVideos(response.data._id as string));
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
  videoUploadInProgress: false,
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
    setFormVideo(
      state,
      action: PayloadAction<WorkoutLogPosition & { fileName?: string }>
    ) {
      const { setIndex, exerciseIndex, fileName } = action.payload;
      state.formVideoError = undefined;
      state.editWorkoutLog.exercises[exerciseIndex].sets[
        setIndex
      ].formVideo = fileName;
    },
    setFormVideoError(state, action: PayloadAction<string | undefined>) {
      state.formVideoError = action.payload;
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
    builder.addCase(postFormVideos.pending, (state, action) => {
      state.videoUploadInProgress = true;
    });
    builder.addCase(postFormVideos.rejected, (state, action) => {
      state.videoUploadInProgress = false;
      console.error(action.error.message);
    });
    builder.addCase(postFormVideos.fulfilled, (state, action) => {
      state.videoUploadInProgress = false;
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
  setFormVideo,
  setFormVideoError,
} = slice.actions;
