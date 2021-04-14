import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { API } from "../config/axios.config";

const loginUrl = "/auth/login";
const googleLoginUrl = "/auth/google";
const validateUrl = "/auth/validate";
const verifyUrl = "/auth/verify";
const usersUrl = "/users";

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
      const response: AxiosResponse<{ user: userData }> = await API.post(
        loginUrl,
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
      }> = await API.post(googleLoginUrl, { idToken });
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
    }> = await API.get(validateUrl);
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
      const response: AxiosResponse<{ user: userData }> = await API.post(
        verifyUrl,
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
      }> = await API.post(usersUrl, formData);
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
  authenticationStatus: "pending",
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
        state.signupError = undefined;
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
