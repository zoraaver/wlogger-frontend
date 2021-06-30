import * as React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useAppDispatch, useAppSelector } from "..";
import { postExercise } from "../slices/exercisesSlice";

export function ExerciseForm() {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = React.useState({ name: "", notes: "" });
  const [exerciseNameError, setExerciseNameError] = React.useState("");
  const exerciseNames: string[] = useAppSelector((state) =>
    state.exercises.data.map((exercise) => exercise.name)
  );

  function handleChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    if (target.name === "name" && target.value.length <= 100) {
      if (exerciseNames.includes(target.value)) {
        setExerciseNameError("Exercise name already taken");
      } else {
        setExerciseNameError("");
      }
      setFormData({ ...formData, name: target.value });
    } else if (target.name === "notes" && target.value.length <= 500) {
      setFormData({ ...formData, notes: target.value });
    }
  }

  function handleSubmit() {
    if (!formData.name) {
      setExerciseNameError("Exercise name is required");
    } else if (!exerciseNameError) {
      dispatch(postExercise(formData));
      setFormData({ name: "", notes: "" });
    }
  }

  return (
    <Form className="w-75 my-3 bg-light p-4 rounded border">
      <Form.Group>
        <Form.Label>Exercise name</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter name"
          value={formData.name}
          onChange={handleChange}
          name="name"
        />
        {exerciseNameError && (
          <div className="text-danger">{exerciseNameError}</div>
        )}
      </Form.Group>

      <Form.Group>
        <Form.Label>Notes: </Form.Label>
        <Form.Control
          as="textarea"
          placeholder="500 character limit"
          value={formData.notes}
          onChange={handleChange}
          name="notes"
        />
      </Form.Group>
      <Button variant="success" className="m-auto" onClick={handleSubmit}>
        Add Exercise
      </Button>
    </Form>
  );
}
