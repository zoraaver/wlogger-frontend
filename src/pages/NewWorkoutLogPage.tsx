import * as React from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { WorkoutLogForm } from "../components/WorkoutLogForm";
import { WorkoutLogTable } from "../containers/WorkoutLogTable";
import { useAppDispatch, useAppSelector } from "..";
import {
  clearEditWorkoutLog,
  clearFormVideos,
  postWorkoutLog,
  setFormVideoError,
} from "../slices/workoutLogsSlice";
import { useHistory } from "react-router";
import { resetSuccess } from "../slices/workoutLogsSlice";
import { UploadProgressBar } from "../components/UploadProgressBar";

export function NewWorkoutLogPage() {
  const workoutLog = useAppSelector(
    (state) => state.workoutLogs.editWorkoutLog
  );
  const formVideoError: string | undefined = useAppSelector(
    (state) => state.workoutLogs.formVideoError
  );
  const videoUploadProgress: number = useAppSelector(
    (state) => state.workoutLogs.videoUploadProgress
  );
  const dispatch = useAppDispatch();
  const history = useHistory();

  React.useEffect(() => {
    dispatch(clearFormVideos());
    dispatch(clearEditWorkoutLog());
  }, []);

  if (videoUploadProgress)
    return <UploadProgressBar percentage={videoUploadProgress} />;

  async function handleSubmit() {
    if (workoutLog) {
      await dispatch(postWorkoutLog(workoutLog));
      dispatch(resetSuccess(4));
      history.push("/logs");
    }
  }

  return (
    <Container className="mt-5 d-flex flex-column justify-content-start align-items-center">
      <h3 className="mt-3">New Log</h3>
      <WorkoutLogForm />
      {formVideoError ? (
        <Alert
          dismissible
          className="my-3"
          variant="danger"
          show={!!formVideoError}
          onClose={() => dispatch(setFormVideoError(undefined))}
        >
          {formVideoError}
        </Alert>
      ) : null}
      <WorkoutLogTable edit={true} />
      <Button variant="success" onClick={handleSubmit}>
        Log workout
      </Button>
    </Container>
  );
}
