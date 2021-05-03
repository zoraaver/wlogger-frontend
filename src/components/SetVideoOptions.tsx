import * as React from "react";
import { Download, PlayCircle, Trash } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { useAppDispatch, useAppSelector } from "..";
import { baseURL } from "../config/axios.config";
import { setCurrentSetVideo } from "../slices/UISlice";
import {
  deleteSetVideo,
  exerciseLogData,
  setLogData,
  workoutLogData,
  WorkoutLogPosition,
} from "../slices/workoutLogsSlice";

export function SetVideoOptions({
  setIndex,
  exerciseIndex,
}: WorkoutLogPosition) {
  const dispatch = useAppDispatch();
  const workoutLog: workoutLogData = useAppSelector(
    (state) => state.workoutLogs.editWorkoutLog
  );
  const exercise: exerciseLogData = workoutLog.exercises[exerciseIndex];
  const set: setLogData = exercise.sets[setIndex];

  return (
    <Container className="d-flex flex-row justify-content-between align-items-center">
      <Button
        variant="success"
        onClick={() =>
          dispatch(setCurrentSetVideo({ setIndex, exerciseIndex }))
        }
        className="mx-0 px-1 py-0"
      >
        <PlayCircle size={15} color="white" />
      </Button>
      <Button
        className="mx-0 px-1 py-0"
        as="a"
        href={`${baseURL}/workoutLogs/${workoutLog._id}/exercises/${exercise._id}/sets/${set._id}/video`}
        download
      >
        <Download size={15} />
      </Button>
      <Button
        variant="danger"
        className="mx-0 px-1 py-0"
        onClick={() =>
          dispatch(
            deleteSetVideo({
              workoutLogId: workoutLog._id as string,
              exerciseId: exercise._id as string,
              setId: set._id as string,
            })
          )
        }
      >
        <Trash size={15} />
      </Button>
    </Container>
  );
}
