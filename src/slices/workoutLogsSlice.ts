import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { weightUnit } from "./workoutPlansSlice";

interface workoutLogData {
  exercises: Array<exerciseLogData>;
  createdAt?: Date;
  updatedAt?: Date;
}

interface workoutLogState {
  data: Array<workoutLogData>;
  editWorkoutLog?: workoutLogData;
}

export interface EntryData {
  name: string;
  repetitions: number;
  weight: number;
  unit: weightUnit;
  restInterval?: number;
}

interface exerciseLogData {
  name: string;
  sets: Array<setLogData>;
}

interface setLogData {
  weight: number;
  repetitions: number;
  restInterval?: number;
  unit: weightUnit;
}

const initialState: workoutLogState = {
  data: [],
  editWorkoutLog: { exercises: [], createdAt: undefined },
};

const slice = createSlice({
  name: "workoutLogsSlice",
  initialState,
  reducers: {
    addSet(state, action: PayloadAction<EntryData>) {
      const { name, repetitions, weight, unit, restInterval } = action.payload;
      if (!state.editWorkoutLog) return;
      const exercises = state.editWorkoutLog.exercises;
      const exerciseAlreadyLogged = exercises.find(
        (exercise) => exercise.name === name
      );
      if (exerciseAlreadyLogged) {
        exerciseAlreadyLogged.sets.push({
          weight,
          unit,
          repetitions,
          restInterval,
        });
      } else {
        exercises.push({
          name,
          sets: [{ weight, unit, repetitions, restInterval }],
        });
      }
    },
  },
});

export const workoutLogsReducer = slice.reducer;
export const { addSet } = slice.actions;
