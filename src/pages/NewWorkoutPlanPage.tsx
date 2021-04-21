import * as React from "react";
import { Container } from "react-bootstrap";
import { WorkoutPlanForm } from "../components/WorkoutPlanForm";
import Card from "react-bootstrap/Card";
import { HorizontalDivider } from "../components/HorizontalDivider";

export function NewWorkoutPlanPage() {
  return (
    <Container
      fluid
      className="mt-5 justify-content-center align-items-center d-flex flex-column mb-3 ml-5"
    >
      <Card className="w-50 bg-light mt-3">
        <Card.Body>
          <Card.Title>New workout plan</Card.Title>
          <HorizontalDivider text="" thickness={4} marginTop={10} />
          <Card.Text>
            Create a new workout plan. You don't need to create a plan to start
            logging workouts. However, creating a plan allows you to template
            workouts and save you manually adding exercises/sets/weight every
            time you want to log a new workout.
          </Card.Text>
        </Card.Body>
      </Card>
      <WorkoutPlanForm />
    </Container>
  );
}
