import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./components/App";
import { BrowserRouter as Router } from "react-router-dom";
import { userReducer } from "./slices/usersSlice";
import {
  Provider,
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import "bootstrap/dist/css/bootstrap.min.css";

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const root: HTMLDivElement = document.getElementById("root") as HTMLDivElement;
root.style.height = "100%";
root.style.width = "100%";

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);
