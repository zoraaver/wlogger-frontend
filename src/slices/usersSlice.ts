import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";

const BACKEND_URL = "http://localhost:8080";
const BASE_URL = BACKEND_URL;
const LOGIN_URL = BASE_URL + "/auth/login";
const GOOGLE_LOGIN_URL = BASE_URL + "/auth/google";
const VALIDATE_URL = BASE_URL + "/auth/validate";

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
      localStorage.setItem("token", response.data.user.token);
      return response.data.user;
    } catch (error) {
      if (error.response) return Promise.reject(error.response.data);
      return Promise.reject(error);
    }
  }
);

export const googleLoginUser = createAsyncThunk(
  "users/googleLoginUser",
  async (idToken: string) => {
    try {
      const response: AxiosResponse<{
        user: userData;
      }> = await axios.post(GOOGLE_LOGIN_URL, { idToken });
      localStorage.setItem("token", response.data.user.token);
      return response.data.user;
    } catch (error) {
      if (error.response) return Promise.reject(error.response.data);
      return Promise.reject(error);
    }
  }
);

export const validate = createAsyncThunk("users/validate", async () => {
  try {
    const response: AxiosResponse<{
      user: userData;
    }> = await axios.get(VALIDATE_URL, {
      headers: { Authorisation: localStorage.token },
    });
    return response.data.user;
  } catch (error) {
    if (error.response) return Promise.reject(error.response.data);
    return Promise.reject(error);
  }
});

interface userData {
  email: string;
  token: string;
}

interface userState {
  loginError: string | undefined;
  authenticationStatus: "pending" | "confirmed" | "unknown";
  data: userData | null;
}

const initialState: userState = {
  data: null,
  loginError: undefined,
  authenticationStatus: "unknown",
};

export const slice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginUser.rejected, (state, action) => {
      state.data = null;
      state.loginError = action.error.message;
      state.authenticationStatus = "unknown";
    });
    builder.addCase(
      loginUser.fulfilled,
      (state, action: PayloadAction<userData>) => {
        const userData = action.payload;
        state.data = userData;
        state.authenticationStatus = "confirmed";
      }
    );
    builder.addCase(loginUser.pending, (state, action) => {
      state.authenticationStatus = "pending";
    });
    builder.addCase(
      googleLoginUser.fulfilled,
      (state, action: PayloadAction<userData>) => {
        const userData = action.payload;
        state.data = userData;
        state.authenticationStatus = "confirmed";
      }
    );
    builder.addCase(googleLoginUser.rejected, (state, action) => {
      state.data = null;
      state.loginError = action.error.message;
      state.authenticationStatus = "unknown";
    });
    builder.addCase(googleLoginUser.pending, (state, action) => {
      state.authenticationStatus = "pending";
    });
    builder.addCase(
      validate.fulfilled,
      (state, action: PayloadAction<userData>) => {
        const userData = action.payload;
        state.data = userData;
        state.authenticationStatus = "confirmed";
      }
    );
    builder.addCase(validate.pending, (state, action) => {
      state.authenticationStatus = "pending";
    });
    builder.addCase(validate.rejected, (state, action) => {
      state.data = null;
      state.authenticationStatus = "unknown";
    });
  },
});

export const userReducer = slice.reducer;
