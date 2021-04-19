import * as React from "react";
import Form from "react-bootstrap/Form";
import {
  setInitialWorkoutPlanData,
  workoutPlanData,
} from "../slices/workoutPlansSlice";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useAppDispatch } from "..";
import { useHistory } from "react-router-dom";

export function WorkoutPlanForm() {
  const dispatch = useAppDispatch();
  const history = useHistory();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (formData.name === "") {
      setError("Name is a required field");
    } else {
      dispatch(setInitialWorkoutPlanData(formData));
      history.push("/plans/new/weeks");
    }
  }

  const [formData, setFormData] = React.useState<workoutPlanData>({
    name: "",
    length: 0,
    status: "Not started",
    weeks: [],
  });
  const [error, setError] = React.useState("");

  function handleChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    if (target.name === "length") {
      setFormData({ ...formData, length: Number(target.value) });
    } else {
      setFormData({ ...formData, [target.name]: target.value });
    }
  }

  return (
    <Form className="w-50 rounded mt-5" onSubmit={handleSubmit}>
      <Form.Row className="rounded bg-dark text-white pl-3 py-2">
        New plan
      </Form.Row>
      <Form.Row className="px-3 pb-3 bg-light">
        <Col>
          <Form.Group controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="name"
              placeholder="name"
            />
            {error ? <div className="text-danger">{error}</div> : null}
          </Form.Group>
          <Form.Group controlId="formBasicLength">
            <Form.Label>Length (in weeks)</Form.Label>
            <Form.Control
              name="length"
              onChange={handleChange}
              value={formData.length ? formData.length : ""}
              type="length"
              placeholder="length"
            />
          </Form.Group>
          <Button className="py-1 mt-2" variant="success" type="submit">
            Next
          </Button>
        </Col>
      </Form.Row>
    </Form>
  );
}
