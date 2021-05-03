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
  videoUploadProgress: number;
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
  _id?: string;
  exerciseId?: string;
  sets: Array<setLogData>;
}

export interface setLogData {
  _id?: string;
  weight: number;
  repetitions: number;
  formVideoName?: string;
  formVideo?: { size: number; extension: videoFileExtension };
  restInterval?: number;
  unit: weightUnit;
}

type videoFileExtension = "mp4" | "mkv" | "mov";
const validVideoFileExtensions: videoFileExtension[] = ["mov", "mp4", "mkv"];

export type WorkoutLogPosition = { setIndex: number; exerciseIndex: number };
type logVideoFile = WorkoutLogPosition & { file: File };

const logVideoFiles: logVideoFile[] = [];

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
  }
);

export const removeFormVideo = createAsyncThunk(
  "workoutLogs/removeFormVideo",
  async (position: WorkoutLogPosition, { dispatch }) => {
    const { setIndex, exerciseIndex } = position;
    const fileToRemoveIndex: number = logVideoFiles.findIndex(
      (fileObj: logVideoFile) =>
        fileObj.exerciseIndex === exerciseIndex && fileObj.setIndex === setIndex
    );
    if (fileToRemoveIndex >= 0) {
      logVideoFiles.splice(fileToRemoveIndex, 1);
    }
    dispatch(setFormVideo(position));
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
  async (workoutLog: workoutLogData, { dispatch }) => {
    const logFormData = new FormData();

    // send each video file with name {exerciseId}.{setId}.{fileExtension}
    for (const { file, setIndex, exerciseIndex } of logVideoFiles) {
      const exerciseId: string | undefined =
        workoutLog.exercises[exerciseIndex]._id;
      const setId: string | undefined =
        workoutLog.exercises[exerciseIndex].sets[setIndex]._id;
      const fileExtension: string = file.name.split(".").pop() as string;
      const fileName = [exerciseId, setId, fileExtension].join(".");
      logFormData.append("formVideos", file, fileName);
    }

    try {
      const response: AxiosResponse<any> = await API.post(
        `${workoutLogUrl}/${workoutLog._id}/videoUpload`,
        logFormData,
        {
          onUploadProgress: (progressEvent) => {
            const loadedPercentage: number = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100.0
            );
            dispatch(setVideoUploadProgress(loadedPercentage));
          },
        }
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
        await dispatch(postFormVideos(response.data));
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

export const deleteSetVideo = createAsyncThunk(
  "workoutLogs/deleteSetVideo",
  async ({
    workoutLogId,
    exerciseId,
    setId,
  }: {
    workoutLogId: string;
    exerciseId: string;
    setId: string;
  }) => {
    try {
      const response: AxiosResponse<{
        setId: string;
        exerciseId: string;
      }> = await API.delete(
        `${workoutLogUrl}/${workoutLogId}/exercises/${exerciseId}/sets/${setId}`
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
  videoUploadProgress: 0,
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
      ].formVideoName = fileName;
    },
    setFormVideoError(state, action: PayloadAction<string | undefined>) {
      state.formVideoError = action.payload;
    },
    setVideoUploadProgress(state, action: PayloadAction<number>) {
      state.videoUploadProgress = action.payload;
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
    builder.addCase(postFormVideos.rejected, (state, action) => {
      state.videoUploadProgress = 0;
      console.error(action.error.message);
    });
    builder.addCase(postFormVideos.fulfilled, (state, action) => {
      state.videoUploadProgress = 0;
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
    builder.addCase(
      deleteSetVideo.fulfilled,
      (state, action: PayloadAction<{ exerciseId: string; setId: string }>) => {
        const { exerciseId, setId } = action.payload;
        const set: setLogData | undefined = state.editWorkoutLog.exercises
          .find((exercise) => exercise._id === exerciseId)
          ?.sets.find((set) => set._id === setId);
        if (set) {
          delete set.formVideo;
        }
      }
    );
    builder.addCase(deleteSetVideo.rejected, (state, action) => {
      console.error(action.error.message);
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
  setVideoUploadProgress,
} = slice.actions;
