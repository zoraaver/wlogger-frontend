import * as React from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { WorkoutLogForm } from "../components/WorkoutLogForm";
import { WorkoutLogTable } from "../containers/WorkoutLogTable";
import { useAppDispatch, useAppSelector } from "..";
import { postWorkoutLog } from "../slices/workoutLogsSlice";
import { useHistory } from "react-router";
import { resetSuccess } from "../slices/workoutLogsSlice";

export function NewWorkoutLogPage() {
  const workoutLog = useAppSelector(
    (state) => state.workoutLogs.editWorkoutLog
  );
  const dispatch = useAppDispatch();
  const history = useHistory();

  async function handleSubmit() {
    if (workoutLog) {
      await dispatch(postWorkoutLog(workoutLog));
      dispatch(resetSuccess(4));
      history.push("/logs");
    }
  }
  return (
    <Container className="mt-5 d-flex flex-column justify-content-start align-items-center">
      <WorkoutLogForm />
      <WorkoutLogTable />
      <Button variant="success" onClick={handleSubmit}>
        Log workout
      </Button>
    </Container>
  );
}
