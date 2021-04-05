import axios from "axios";

const baseURL = "http://localhost:8080";

export const API = axios.create({ baseURL });

API.interceptors.request.use((config) => {
  config.headers.common["Authorisation"] = localStorage.token;
  return config;
});
