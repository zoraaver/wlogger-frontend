import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
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
  videoUploadProgress: { [fileName: string]: number };
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
  formVideoExtension?: videoFileExtension;
  restInterval?: number;
  unit: weightUnit;
}
interface S3SignedPostForm {
  url: string;
  fields: { [Key: string]: string };
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
    const fileSizeLimit = 50 * megaByte;
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
    } else if (file.size > fileSizeLimit) {
      dispatch(setFormVideoError(`File size cannot exceed 50 MB`));
    } else if (logVideoFiles.length >= 5) {
      dispatch(
        setFormVideoError(
          "A maximum of 5 form videos are allowed per workout log"
        )
      );
    } else {
      logVideoFiles.push({ file, setIndex, exerciseIndex });
      dispatch(
        setFormVideo({
          exerciseIndex,
          setIndex,
          fileName: file.name,
          fileExtension: fileExtension as videoFileExtension,
        })
      );
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
  async (S3UploadForms: S3SignedPostForm[], { dispatch }) => {
    const requests = constructAndSendS3VideoUploadRequests(
      S3UploadForms,
      dispatch
    );
    try {
      await axios.all(requests);
      return;
    } catch (error) {
      if (error.response) return Promise.reject(error.response.data);
      return Promise.reject(error);
    }
  }
);

function constructAndSendS3VideoUploadRequests(
  S3UploadForms: S3SignedPostForm[],
  dispatch: any
): Promise<AxiosResponse<any>>[] {
  const requests: Promise<AxiosResponse<any>>[] = [];
  S3UploadForms.forEach((S3Form: S3SignedPostForm, index: number) => {
    const form: FormData = new FormData();
    form.append("Content-Type", logVideoFiles[index].file.type);
    Object.entries(S3Form.fields).forEach(([key, value]) => {
      form.append(key, value);
    });
    form.append("file", logVideoFiles[index].file);
    requests.push(sendS3VideoUploadRequest(S3Form.url, form, dispatch, index));
  });
  return requests;
}

function sendS3VideoUploadRequest(
  S3UploadUrl: string,
  form: FormData,
  dispatch: any,
  requestIndex: number
): Promise<AxiosResponse<any>> {
  return axios.post(S3UploadUrl, form, {
    onUploadProgress: (progressEvent) => {
      const loadedPercentage: number = Math.round(
        (progressEvent.loaded / progressEvent.total) * 100.0
      );
      dispatch(
        addVideoUploadProgress({
          fileName:
            logVideoFiles[requestIndex].file.name +
            " " +
            requestIndex.toString(),
          percentage: loadedPercentage,
        })
      );
    },
  });
}

export const postWorkoutLog = createAsyncThunk(
  "workoutLogs/postWorkoutLog",
  async (data: workoutLogData, { dispatch }) => {
    try {
      const response: AxiosResponse<
        workoutLogData & { uploadUrls: S3SignedPostForm[] }
      > = await API.post(workoutLogUrl, data);
      if (logVideoFiles.length > 0)
        await dispatch(postFormVideos(response.data.uploadUrls));
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
  videoUploadProgress: {},
};

const slice = createSlice({
  name: "workoutLogs",
  initialState,
  reducers: {
    addSet(state, action: PayloadAction<EntryData>) {
      const { name, repetitions, weight, unit, restInterval, exerciseId } =
        action.payload;
      const exercises = state.editWorkoutLog.exercises;
      const lastLoggedExercise =
        exercises.length > 0 ? exercises[exercises.length - 1] : undefined;
      const exercisesMatch: boolean | undefined =
        lastLoggedExercise &&
        (exerciseId !== undefined
          ? lastLoggedExercise.exerciseId === exerciseId
          : lastLoggedExercise.name == name);
      if (exercisesMatch) {
        lastLoggedExercise!.sets.push({
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
      action: PayloadAction<
        WorkoutLogPosition & {
          fileName?: string;
          fileExtension?: videoFileExtension;
        }
      >
    ) {
      const { setIndex, exerciseIndex, fileName, fileExtension } =
        action.payload;
      state.formVideoError = undefined;
      const set = state.editWorkoutLog.exercises[exerciseIndex].sets[setIndex];
      set.formVideoName = fileName;
      set.formVideoExtension = fileExtension;
    },
    setFormVideoError(state, action: PayloadAction<string | undefined>) {
      state.formVideoError = action.payload;
    },
    addVideoUploadProgress(
      state,
      action: PayloadAction<{ fileName: string; percentage: number }>
    ) {
      const { fileName, percentage } = action.payload;
      state.videoUploadProgress[fileName] = percentage;
    },
    setLogDate(state, action: PayloadAction<string>) {
      const newDate = new Date(action.payload);
      if (newDate.getTime() !== NaN)
        state.editWorkoutLog.createdAt = action.payload;
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
      state.videoUploadProgress = {};
      console.error(action.error.message);
    });
    builder.addCase(postFormVideos.fulfilled, (state, action) => {
      state.videoUploadProgress = {};
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
          delete set.formVideoExtension;
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
  addVideoUploadProgress,
  setLogDate,
} = slice.actions;
