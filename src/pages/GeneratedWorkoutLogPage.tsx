import * as React from "react";
import { Redirect, useHistory } from "react-router";
import { useAppDispatch, useAppSelector } from "..";
import { workoutData } from "../slices/workoutsSlice";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import {
  clearEditWorkoutLog,
  postWorkoutLog,
  workoutLogData,
} from "../slices/workoutLogsSlice";
import { GeneratedWorkoutLogTable } from "../containers/GeneratedWorkoutLogTable";

export function GeneratedWorkoutLogPage() {
  const dispatch = useAppDispatch();
  const workout: workoutData | undefined = useAppSelector(
    (state) => state.workouts.nextWorkout
  );
  const workoutLog: workoutLogData = useAppSelector(
    (state) => state.workoutLogs.editWorkoutLog
  );
  const history = useHistory();

  if (!workout) return <Redirect to="/" />;

  React.useEffect(() => {
    dispatch(clearEditWorkoutLog());
  }, []);

  const [positionInWorkout, setPositionInWorkout] = React.useState({
    setIndex: 0,
    exerciseIndex: 0,
  });
  const workoutFinished: boolean =
    positionInWorkout.exerciseIndex >= workout.exercises.length;

  async function handleFinishWorkoutClick() {
    if (!workoutFinished) return;
    await dispatch(postWorkoutLog(workoutLog));
    history.push("/logs");
  }

  return (
    <Container className="mt-5 d-flex flex-column justify-content-start align-items-center">
      <h2 className="my-3">Log today's workout:</h2>
      <GeneratedWorkoutLogTable
        positionInWorkout={positionInWorkout}
        setPositionInWorkout={setPositionInWorkout}
      />
      <Button
        onClick={handleFinishWorkoutClick}
        disabled={!workoutFinished}
        variant={workoutFinished ? "success" : "primary"}
      >
        Finish workout
      </Button>
    </Container>
  );
}
