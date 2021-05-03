import * as React from "react";
import Button from "react-bootstrap/Button";
import { useAppDispatch, useAppSelector } from "..";
import {
  removeFormVideo,
  WorkoutLogPosition,
} from "../slices/workoutLogsSlice";

export function RemoveVideoFileInput({
  setIndex,
  exerciseIndex,
}: WorkoutLogPosition) {
  const dispatch = useAppDispatch();
  const formVideo = useAppSelector(
    (state) =>
      state.workoutLogs.editWorkoutLog.exercises[exerciseIndex].sets[setIndex]
        .formVideoName
  );
  return (
    <>
      {formVideo}
      <Button
        className="py-0 my-0 ml-3"
        variant="danger"
        onClick={() => dispatch(removeFormVideo({ setIndex, exerciseIndex }))}
      >
        x
      </Button>
    </>
  );
}
