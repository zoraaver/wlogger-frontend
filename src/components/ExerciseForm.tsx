import * as React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import {
  addExercise,
  Day,
  exerciseData,
  weightUnit,
} from "../slices/workoutPlansSlice";
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
    const numberValue = Number(target.value);
    if (target.value === "") {
      setFormData({ ...formData, [target.name]: target.value });
      return;
    }
    switch (target.name) {
      case "name":
        setFormData({ ...formData, [target.name]: target.value });
        return;
      case "unit":
        if (["kg", "lb"].includes(target.value))
          setFormData({ ...formData, unit: target.value as weightUnit });
        return;
      case "sets":
        if (Number.isInteger(numberValue) && numberValue > 0) {
          setFormData({ ...formData, sets: numberValue });
        }
        return;
      case "repetitions":
        if (Number.isInteger(numberValue) && numberValue >= 0) {
          setFormData({ ...formData, repetitions: numberValue });
        }
        return;
      case "weight":
        if (Number(numberValue) >= 0) {
          setFormData({ ...formData, weight: numberValue });
        }
        return;
      default:
        return;
    }
  }

  const dispatch = useAppDispatch();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    let field: string = "";
    // require name, sets and unit
    if (formData.name === "") field = "name";
    else if ((formData.sets as any) === "") field = "sets";
    else if ((formData.unit as any) === "") field = "unit";

    // default weight and repetitions to 0 if not given
    if ((formData.repetitions as any) === "") formData.repetitions = 0;
    if ((formData.weight as any) === "") formData.weight = 0;

    if (field !== "") {
      setError({ field, message: `${field} is a required field` });
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
            type="number"
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
            type="number"
            onChange={handleChange}
            value={formData.repetitions}
            placeholder="reps"
          />
        </Col>
        <Col>
          <Form.Label>Weight</Form.Label>
          <Form.Control
            name="weight"
            type="number"
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
