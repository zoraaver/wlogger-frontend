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
  setLogNotes,
} from "../slices/workoutLogsSlice";
import { useHistory } from "react-router";
import { resetSuccess } from "../slices/workoutLogsSlice";
import { UploadProgress } from "../components/UploadProgress";
import { Form } from "react-bootstrap";

export function NewWorkoutLogPage() {
  const workoutLog = useAppSelector(
    (state) => state.workoutLogs.editWorkoutLog
  );
  const formVideoError: string | undefined = useAppSelector(
    (state) => state.workoutLogs.formVideoError
  );
  const videoUploadProgress = useAppSelector(
    (state) => state.workoutLogs.videoUploadProgress
  );
  const dispatch = useAppDispatch();
  const history = useHistory();

  React.useEffect(() => {
    dispatch(clearFormVideos());
    dispatch(clearEditWorkoutLog());
  }, []);

  if (Object.keys(videoUploadProgress).length)
    return <UploadProgress progress={videoUploadProgress} />;

  async function handleSubmit() {
    if (workoutLog) {
      await dispatch(postWorkoutLog(workoutLog));
      dispatch(resetSuccess(4));
      history.push("/logs");
    }
  }

  return (
    <Container className="mt-5 d-flex flex-column justify-content-start align-items-center">
      <h2 className="my-3">New Log</h2>
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
      <h4 className="mt-4">Logged sets:</h4>
      <WorkoutLogTable edit={true} />
      <Form className="w-75 mb-3">
        <Form.Label>Notes:</Form.Label>
        <Form.Control
          as="textarea"
          placeholder="Max 1000 characters"
          value={workoutLog.notes || ""}
          onChange={({ target }) => dispatch(setLogNotes(target.value))}
        />
      </Form>
      <Button variant="success" onClick={handleSubmit}>
        Log workout
      </Button>
    </Container>
  );
}
