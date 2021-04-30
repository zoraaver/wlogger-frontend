import axios from "axios";

export const baseURL = "http://localhost:8080";

export const API = axios.create({ baseURL });

API.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});
