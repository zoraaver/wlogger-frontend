import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./components/App";
import { BrowserRouter as Router } from "react-router-dom";
import { workoutPlansReducer } from "./slices/workoutPlansSlice";
import { workoutsReducer } from "./slices/workoutsSlice";
import { workoutLogsReducer } from "./slices/workoutLogsSlice";
import { userReducer } from "./slices/usersSlice";
import {
  Provider,
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import "bootstrap/dist/css/bootstrap.min.css";
import { UIReducer } from "./slices/UISlice";
import { exercisesReducer } from "./slices/exercisesSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    workoutPlans: workoutPlansReducer,
    workoutLogs: workoutLogsReducer,
    workouts: workoutsReducer,
    exercises: exercisesReducer,
    UI: UIReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
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
