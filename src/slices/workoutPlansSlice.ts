import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { API } from "../config/axios.config";

const workoutPlansUrl = "/workoutPlans";

export interface workoutPlanData {
  name: string;
  length: number;
  current: boolean;
}

interface workoutPlanState {
  data: Array<workoutPlanData>;
  error: string | undefined;
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
  error: undefined,
};

const slice = createSlice({
  name: "workoutPlans",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(postWorkoutPlan.fulfilled, (state, action) => {
      console.log(action.payload);
    });
  },
});

export const workoutPlansReducer = slice.reducer;
