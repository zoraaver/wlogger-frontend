import * as React from "react";
import { Pencil, Trash } from "react-bootstrap-icons";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { exerciseData, patchExercise } from "../slices/exercisesSlice";
import { useAppDispatch } from "..";
import { deleteExercise } from "../slices/exercisesSlice";

interface ExerciseItemProps {
  exercise: exerciseData;
}

export function ExerciseItem({ exercise }: ExerciseItemProps) {
  const dispatch = useAppDispatch();

  const [editing, setEditing] = React.useState(false);
  const [exerciseNotes, setExerciseNotes] = React.useState(exercise.notes);

  function handleDelete() {
    dispatch(deleteExercise(exercise._id as string));
  }

  function handleChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    if (target.value.length <= 500) {
      setExerciseNotes(target.value);
    }
  }

  function handleEdit() {
    if (editing) {
      dispatch(patchExercise({ ...exercise, notes: exerciseNotes }));
    }

    setEditing(!editing);
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
          <Card.Body className="d-flex flex-row justify-content-start align-items-center">
            <b className="mr-3">Notes:</b>
            {editing ? (
              <Form.Control
                as="textarea"
                placeholder="500 character limit"
                value={exerciseNotes}
                onChange={handleChange}
                name="notes"
                className="mr-3"
              />
            ) : (
              exercise.notes
            )}
            <Button className="ml-auto" onClick={handleEdit}>
              {editing ? "Save" : <Pencil />}
            </Button>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}
