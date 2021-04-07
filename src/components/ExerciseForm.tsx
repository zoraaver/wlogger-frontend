import * as React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import { addExercise, Day, exerciseData } from "../slices/workoutPlansSlice";
import { useAppDispatch } from "..";

interface ExerciseFormProps {
  dayOfWeek: Day;
  position: number;
}
export function ExerciseForm({ dayOfWeek, position }: ExerciseFormProps) {
  const [formData, setFormData] = React.useState<exerciseData>({
    name: "Squats",
    sets: 1,
    weight: 10,
    repetitions: 10,
    unit: "kg",
    restInterval: 0,
  });
  const [error, setError] = React.useState({ field: "", message: "" });

  function handleChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    if (target.name === "name" || target.name === "unit") {
      setFormData({ ...formData, [target.name]: target.value });
    } else {
      setFormData({ ...formData, [target.name]: Number(target.value) });
    }
  }

  const dispatch = useAppDispatch();
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (formData.name === "") {
      setError({ field: "name", message: "Name is a required field." });
    } else if (formData.sets === 0) {
      setError({ field: "sets", message: "No. of sets cannot be 0" });
    } else {
      setError({ field: "", message: "" });
      dispatch(
        addExercise({ position, day: dayOfWeek, exerciseData: formData })
      );
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Row>
        <Col>
          <Form.Label>Exercise</Form.Label>
          <Form.Control
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="exercise name"
          />
          {error.field === "name" ? (
            <div className="text-danger">{error.message}</div>
          ) : null}
        </Col>
        <Col>
          <Form.Label>Sets</Form.Label>
          <Form.Control
            name="sets"
            onChange={handleChange}
            value={formData.sets}
            placeholder="sets"
          />
          {error.field === "sets" ? (
            <div className="text-danger">{error.message}</div>
          ) : null}
        </Col>
        <Col>
          <Form.Label>Reps</Form.Label>
          <Form.Control
            name="repetitions"
            onChange={handleChange}
            value={formData.repetitions}
            placeholder="reps"
          />
        </Col>
        <Col>
          <Form.Label>Weight</Form.Label>
          <Form.Control
            name="weight"
            onChange={handleChange}
            value={formData.weight}
            placeholder="weight"
          />
        </Col>
        <Col>
          <Form.Label>Unit</Form.Label>
          <Form.Control
            as="select"
            name="unit"
            onChange={handleChange}
            value={formData.unit}
          >
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </Form.Control>
        </Col>
        <Col
          className="d-flex flex-column justify-content-end align-items-center"
          lg={50}
        >
          <Button type="submit" variant="success">
            +
          </Button>
        </Col>
      </Form.Row>
    </Form>
  );
}