import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./components/App";
import { BrowserRouter as Router } from "react-router-dom";
import { workoutPlansReducer } from "./slices/workoutPlansSlice";
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
    workoutPlans: workoutPlansReducer,
  },
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);
