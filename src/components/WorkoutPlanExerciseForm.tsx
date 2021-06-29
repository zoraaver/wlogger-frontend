import * as React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import { addExercise, Day, weightUnit } from "../slices/workoutPlansSlice";
import { useAppDispatch, useAppSelector } from "..";
import {
  workoutExerciseData,
  incrementField,
  incrementFields,
} from "../slices/workoutsSlice";
import { renderAutoIncrementField } from "../util/util";

interface ExerciseFormProps {
  dayOfWeek: Day;
  position: number;
}
export function WorkoutPlanExerciseForm({
  dayOfWeek,
  position,
}: ExerciseFormProps) {
  const [formData, setFormData] = React.useState<workoutExerciseData>({
    name: "Squats",
    sets: 1,
    weight: 10,
    repetitions: 10,
    unit: "kg",
    restInterval: 0,
  });
  const [error, setError] = React.useState({ field: "", message: "" });
  const dispatch = useAppDispatch();
  const weekRepeat: number | undefined = useAppSelector(
    (state) =>
      state.workoutPlans.editWorkoutPlan?.weeks.find(
        (week) => week.position === position
      )?.repeat
  );

  function handleChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    const numberValue = Number(target.value);
    if (target.value === "" && target.name !== "autoIncrement") {
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
      case "autoIncrement":
        if (
          incrementFields.includes(
            formData.autoIncrement?.field as incrementField,
            0
          )
        ) {
          setFormData({ ...formData, autoIncrement: undefined });
        } else {
          setFormData({
            ...formData,
            autoIncrement: { field: "weight", amount: 0 },
          });
        }
        return;
      case "autoIncrement.field":
        if (incrementFields.includes(target.value as incrementField, 0)) {
          setFormData({
            ...formData,
            autoIncrement: {
              amount: formData.autoIncrement?.amount || 0,
              field: target.value as incrementField,
            },
          });
        }
        return;
      case "autoIncrement.amount":
        const amount = target.value.split(" ")[0];
        if (Number(amount) >= 0) {
          setFormData({
            ...formData,
            autoIncrement: {
              field: formData.autoIncrement?.field as incrementField,
              amount: Number(amount),
            },
          });
        }
        return;
      default:
        return;
    }
  }

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
        {weekRepeat ? (
          <Col className="d-flex flex-column justify-content-start align-items-center">
            <Form.Label>Auto-increment</Form.Label>
            <Form.Check
              name="autoIncrement"
              onChange={handleChange}
              value={formData.autoIncrement?.field}
            />
          </Col>
        ) : null}

        <Col
          className="d-flex flex-column justify-content-end align-items-center"
          lg={50}
        >
          <Button type="submit" variant="success">
            +
          </Button>
        </Col>
      </Form.Row>
      {formData.autoIncrement ? (
        <Form.Row className="mt-3">
          <Col>
            <Form.Label>Field to increment:</Form.Label>
            <Form.Control
              as="select"
              name="autoIncrement.field"
              value={formData.autoIncrement.field}
              className="w-50"
              onChange={handleChange}
            >
              <option value="weight">weight</option>
              <option value="repetitions">reps</option>
              <option value="sets">sets</option>
            </Form.Control>
          </Col>
          <Col>
            <Form.Label>Amount to increment by:</Form.Label>
            <div className="d-flex flex-row justify-content-start align-items-center">
              <Form.Control
                name="autoIncrement.amount"
                className="w-25 mr-2"
                value={formData.autoIncrement.amount}
                onChange={handleChange}
                type="number"
              />
              <span>
                {renderAutoIncrementField(
                  formData.autoIncrement.field,
                  formData.unit
                )}
              </span>
            </div>
          </Col>
        </Form.Row>
      ) : null}
    </Form>
  );
}
