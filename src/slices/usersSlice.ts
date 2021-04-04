import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";

const BACKEND_URL = "http://localhost:8080";
const BASE_URL = BACKEND_URL;
const LOGIN_URL = BASE_URL + "/auth/login";
const GOOGLE_LOGIN_URL = BASE_URL + "/auth/google";
const VALIDATE_URL = BASE_URL + "/auth/validate";
const VERIFY_URL = BASE_URL + "/auth/verify";
const USERS_URL = BASE_URL + "/users";

interface userLoginData {
  email: string;
  password: string;
}

type userSignupData = userLoginData & {
  confirmPassword: string;
};

interface userData {
  email: string;
  token: string;
}

export const loginUser = createAsyncThunk(
  "users/loginUser",
  async (formData: userLoginData) => {
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

export const validateUser = createAsyncThunk("users/validate", async () => {
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

export const verifyUser = createAsyncThunk(
  "users/verify",
  async (verificationToken: string) => {
    try {
      const response: AxiosResponse<{ user: userData }> = await axios.post(
        VERIFY_URL,
        {
          verificationToken,
        }
      );
      localStorage.setItem("token", response.data.user.token);
      return response.data.user;
    } catch (error) {
      if (error.response) return Promise.reject(error.response.data);
      return Promise.reject(error);
    }
  }
);

export const signupUser = createAsyncThunk(
  "users/signupUser",
  async (formData: userSignupData, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<{
        user: { email: string };
      }> = await axios.post(USERS_URL, formData);
      return response.data.user.email;
    } catch (error) {
      if (error.response) return rejectWithValue(error.response.data);
      return Promise.reject(error);
    }
  }
);

interface signupError {
  field: string;
  error: string;
}

interface userState {
  loginError: string | undefined;
  signupError: signupError | undefined;
  signupSuccess: string | undefined;
  verificationError: string | undefined;
  authenticationStatus: "pending" | "confirmed" | "unknown";
  data: userData | null;
}

const initialState: userState = {
  data: null,
  loginError: undefined,
  verificationError: undefined,
  signupSuccess: undefined,
  signupError: undefined,
  authenticationStatus: "unknown",
};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logoutUser(state, action: PayloadAction<void>) {
      state.data = null;
      state.authenticationStatus = "unknown";
    },
  },
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
        state.loginError = undefined;
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
        state.loginError = undefined;
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
      validateUser.fulfilled,
      (state, action: PayloadAction<userData>) => {
        const userData = action.payload;
        state.data = userData;
        state.authenticationStatus = "confirmed";
      }
    );
    builder.addCase(validateUser.pending, (state, action) => {
      state.authenticationStatus = "pending";
    });
    builder.addCase(validateUser.rejected, (state, action) => {
      state.data = null;
      state.authenticationStatus = "unknown";
    });
    builder.addCase(
      verifyUser.fulfilled,
      (state, action: PayloadAction<userData>) => {
        const userData = action.payload;
        state.data = userData;
        state.authenticationStatus = "confirmed";
      }
    );
    builder.addCase(verifyUser.rejected, (state, action) => {
      state.data = null;
      state.verificationError = action.error.message;
      state.authenticationStatus = "unknown";
    });
    builder.addCase(
      signupUser.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.signupSuccess = `Account successfully created: a verification email has been sent to ${action.payload}`;
      }
    );
    builder.addCase(
      signupUser.rejected,
      (state, action: PayloadAction<unknown>) => {
        const signupError = action.payload as signupError;
        state.signupError = {
          field: signupError.field,
          error: signupError.error,
        };
        state.signupSuccess = undefined;
      }
    );
  },
});

export const { logoutUser } = slice.actions;
export const userReducer = slice.reducer;
