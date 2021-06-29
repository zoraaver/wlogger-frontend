import * as React from "react";
import { Trash } from "react-bootstrap-icons";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { exerciseData } from "../slices/exercisesSlice";
import { useAppDispatch } from "..";
import { deleteExercise } from "../slices/exercisesSlice";

interface ExerciseItemProps {
  exercise: exerciseData;
}

export function ExerciseItem({ exercise }: ExerciseItemProps) {
  const dispatch = useAppDispatch();

  function handleDelete() {
    dispatch(deleteExercise(exercise._id as string));
  }

  return (
    <Accordion className="w-75 mt-1">
      <Card>
        <Card.Header className="w-100 d-flex flex-row justify-content-end align-items-center">
          <Accordion.Toggle
            className="mr-auto"
            as={Button}
            variant="light"
            eventKey="0"
          >
            <h6 className="d-inline font-weight-bold">{exercise.name}</h6>
          </Accordion.Toggle>
          <Button variant="danger" onClick={handleDelete}>
            <Trash />
          </Button>
        </Card.Header>

        <Accordion.Collapse eventKey="0">
          <Card.Body>Notes: {exercise.notes}</Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}
