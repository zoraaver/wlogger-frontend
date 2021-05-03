import * as React from "react";
import { Redirect, useHistory } from "react-router";
import { useAppDispatch, useAppSelector } from "..";
import { workoutData } from "../slices/workoutsSlice";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import {
  clearEditWorkoutLog,
  postWorkoutLog,
  resetSuccess,
  setFormVideoError,
  setWorkoutId,
  workoutLogData,
} from "../slices/workoutLogsSlice";
import { GeneratedWorkoutLogTable } from "../containers/GeneratedWorkoutLogTable";
import { UploadProgressBar } from "../components/UploadProgressBar";

export function GeneratedWorkoutLogPage() {
  const dispatch = useAppDispatch();
  const workout: workoutData | undefined = useAppSelector(
    (state) => state.workouts.nextWorkout
  );
  const workoutLog: workoutLogData = useAppSelector(
    (state) => state.workoutLogs.editWorkoutLog
  );
  const formVideoError: string | undefined = useAppSelector(
    (state) => state.workoutLogs.formVideoError
  );
  const videoUploadProgress: number = useAppSelector(
    (state) => state.workoutLogs.videoUploadProgress
  );
  const history = useHistory();

  if (!workout) return <Redirect to="/" />;

  React.useEffect(() => {
    dispatch(clearEditWorkoutLog());
    dispatch(setWorkoutId(workout._id));
  }, []);

  const [positionInWorkout, setPositionInWorkout] = React.useState({
    setIndex: 0,
    exerciseIndex: 0,
  });

  if (videoUploadProgress)
    return <UploadProgressBar percentage={videoUploadProgress} />;
  const workoutFinished: boolean =
    positionInWorkout.exerciseIndex >= workout.exercises.length;

  async function handleFinishWorkoutClick() {
    if (!workoutFinished) return;
    await dispatch(postWorkoutLog(workoutLog));
    dispatch(resetSuccess(4));
    history.push("/logs");
  }

  return (
    <Container className="mt-5 d-flex flex-column justify-content-start align-items-center">
      <h2 className="my-3">Log today's workout:</h2>
      <Alert
        dismissible
        className="my-3"
        variant="danger"
        show={!!formVideoError}
        onClose={() => dispatch(setFormVideoError(undefined))}
      >
        {formVideoError}
      </Alert>
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
