import * as React from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { ExerciseTable } from "../containers/ExerciseTable";
import { Trash } from "react-bootstrap-icons";
import { WorkoutPlanExerciseForm } from "../components/WorkoutPlanExerciseForm";
import { deleteWorkout } from "../slices/workoutPlansSlice";
import { useAppDispatch } from "..";
import { workoutData } from "../slices/workoutsSlice";
import { Link } from "react-router-dom";

interface WorkoutCardProps {
  position: number;
  workout: workoutData;
  exerciseNames: string[];
}

export function WorkoutCard({
  workout,
  position,
  exerciseNames,
}: WorkoutCardProps) {
  const dispatch = useAppDispatch();

  function handleDeleteClick() {
    dispatch(deleteWorkout({ position, day: workout.dayOfWeek }));
  }

  return (
    <Accordion
      key={workout.dayOfWeek}
      className="w-75 my-1"
      defaultActiveKey="0"
    >
      <Card>
        <Card.Header className="d-flex flex-row justify-content-between">
          <Accordion.Toggle as={Button} variant="light" eventKey="0">
            <strong>{workout.dayOfWeek}</strong>
          </Accordion.Toggle>
          <Button variant="danger" onClick={handleDeleteClick} className="mx-2">
            <Trash />
          </Button>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <ExerciseTable workout={workout} weekPosition={position} />
            {exerciseNames.length ? (
              <WorkoutPlanExerciseForm
                dayOfWeek={workout.dayOfWeek}
                position={position}
                exerciseNames={exerciseNames}
              />
            ) : (
              <Container className="d-flex flex-column align-items-center">
                <p>No exercises found</p>
                <Link to="/exercises" className="btn btn-primary">
                  Add Exercise
                </Link>
              </Container>
            )}
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}
