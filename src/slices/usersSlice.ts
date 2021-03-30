import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";

const BACKEND_URL = "http://localhost:8080";
const BASE_URL = BACKEND_URL;
const LOGIN_URL = BASE_URL + "/auth/login";

interface userFormData {
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk(
  "users/loginUser",
  async (formData: userFormData) => {
    try {
      const response: AxiosResponse<{ user: userData }> = await axios.post(
        LOGIN_URL,
        formData
      );
      localStorage.setItem("wloggerUserToken", response.data.user.token);
      return response.data.user;
    } catch (error) {
      return Promise.reject(error.response.data);
    }
  }
);

interface userData {
  email: string;
  token: string;
}

interface userState {
  loginError: string | undefined;
  data: userData | null;
}

const initialState: userState = {
  data: null,
  loginError: undefined,
};

export const slice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginUser.rejected, (state, action) => {
      state.data = null;
      state.loginError = action.error.message;
    });
    builder.addCase(
      loginUser.fulfilled,
      (state, action: PayloadAction<userData>) => {
        const userData = action.payload;
        state.data = userData;
      }
    );
  },
});

export const userReducer = slice.reducer;
