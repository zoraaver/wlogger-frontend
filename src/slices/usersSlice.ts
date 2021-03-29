import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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
      const response: AxiosResponse<any> = await axios.post(
        LOGIN_URL,
        formData
      );
      console.log(response.data);
    } catch (error) {
      console.log(error.message);
    }
  }
);

export const slice = createSlice({
  name: "users",
  initialState: { user: null },
  reducers: {},
});

export const usersReducer = slice.reducer;
