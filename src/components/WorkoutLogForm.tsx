import * as React from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useAppDispatch } from "..";
import { addSet, EntryData } from "../slices/workoutLogsSlice";
import { weightUnit } from "../slices/workoutPlansSlice";

export function WorkoutLogForm() {
  const [formData, setFormData] = React.useState<EntryData>({
    name: "",
    repetitions: 0,
    weight: 0,
    restInterval: 0,
    unit: "kg",
  });
  const [error, setError] = React.useState("");

  const dispatch = useAppDispatch();

  function handleChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    const numberValue = Number(target.value);
    console.log(formData);
    if (target.value === "") {
      setFormData({ ...formData, [target.name]: target.value });
      return;
    }
    switch (target.name) {
      case "name":
        setFormData({ ...formData, name: target.value });
        return;
      case "repetitions":
        if (Number.isInteger(numberValue) && numberValue >= 0) {
          setFormData({ ...formData, repetitions: numberValue });
        }
        return;
      case "weight":
        if (!Number.isNaN(numberValue) && numberValue >= 0) {
          setFormData({ ...formData, weight: numberValue });
        }
        return;
      case "unit":
        if (["kg", "lb"].includes(target.value)) {
          setFormData({ ...formData, unit: target.value as weightUnit });
        }
        return;
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!formData.name) {
      setError("Name is a required field");
      return;
    }
    // default weight and repetitions to 0 if none is given
    if (formData.repetitions === ("" as any)) formData.repetitions = 0;
    if (formData.weight === ("" as any)) formData.weight = 0;
    setError("");
    dispatch(addSet(formData));
  }

  return (
    <Form onSubmit={handleSubmit} className="w-50 mt-3">
      <Form.Row>
        <Col>
          <Form.Label>Name</Form.Label>
          <Form.Control
            name="name"
            value={formData.name}
            onChange={handleChange}
            type="text"
            placeholder="name"
          />
        </Col>
        <Col>
          <Form.Label>Reps</Form.Label>
          <Form.Control
            name="repetitions"
            value={formData.repetitions}
            onChange={handleChange}
            type="number"
            placeholder="repetitions"
          />
        </Col>
        <Col>
          <Form.Label>Weight</Form.Label>
          <Form.Control
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            type="number"
            placeholder="weight"
          />
        </Col>
        <Col>
          <Form.Label>Unit</Form.Label>
          <Form.Control
            as="select"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
          >
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </Form.Control>
        </Col>
        <Col
          className="d-flex flex-column justify-content-end align-items-center"
          lg={50}
        >
          <Button variant="success" type="submit">
            Add Entry
          </Button>
        </Col>
      </Form.Row>
      {error ? (
        <Form.Row>
          <Col>
            <div className="text-danger">{error}</div>
          </Col>
          <Col></Col>
          <Col></Col>
          <Col></Col>
        </Form.Row>
      ) : null}
    </Form>
  );
}
