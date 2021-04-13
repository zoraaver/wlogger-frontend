import * as React from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { WorkoutLogForm } from "../components/WorkoutLogForm";
import { WorkoutLogTable } from "../containers/WorkoutLogTable";
import { useAppDispatch, useAppSelector } from "..";
import { postWorkoutLog } from "../slices/workoutLogsSlice";

export function NewWorkoutLogPage() {
  const workoutLog = useAppSelector(
    (state) => state.workoutLogs.editWorkoutLog
  );
  const dispatch = useAppDispatch();

  function handleSubmit() {
    if (workoutLog) {
      dispatch(postWorkoutLog(workoutLog));
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
