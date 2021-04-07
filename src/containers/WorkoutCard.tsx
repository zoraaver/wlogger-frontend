import * as React from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { ExerciseTable } from "../containers/ExerciseTable";
import { Trash } from "react-bootstrap-icons";
import { ExerciseForm } from "../components/ExerciseForm";
import { deleteWorkout, workoutData } from "../slices/workoutPlansSlice";
import { useAppDispatch } from "..";

interface WorkoutCardProps {
  position: number;
  workout: workoutData;
}

export function WorkoutCard({ workout, position }: WorkoutCardProps) {
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
            <ExerciseForm dayOfWeek={workout.dayOfWeek} position={position} />
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}
