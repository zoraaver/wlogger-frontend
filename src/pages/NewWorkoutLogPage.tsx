import * as React from "react";
import Container from "react-bootstrap/Container";
import { WorkoutLogForm } from "../components/WorkoutLogForm";

export function NewWorkoutLogPage() {
  return (
    <Container className="mt-5 d-flex flex-column justify-content-start align-items-center">
      <WorkoutLogForm />
    </Container>
  );
}
