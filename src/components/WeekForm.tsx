import * as React from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
// import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import {
  addWorkout,
  changeWeekRepeat,
  Day,
  weekData,
} from "../slices/workoutPlansSlice";
import { useAppDispatch } from "..";

interface WeekFormProps {
  week: weekData;
}

export function WeekForm({ week }: WeekFormProps) {
  const dispatch = useAppDispatch();
  const [day, setDay] = React.useState<Day>("Monday");
  const [error, setError] = React.useState(false);

  const allowedRepeatValues: number[] = [0, 1, 2, 3, 4, 5];
  const days: Day[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  function handleAddWorkout(event: React.FormEvent) {
    event.preventDefault();
    if (week.workouts.map((workout) => workout.dayOfWeek).includes(day, 0)) {
      setError(true);
      return;
    }
    setError(false);
    dispatch(addWorkout({ position: week.position, day }));
  }

  function handleDayChange({
    target: { value },
  }: React.ChangeEvent<HTMLSelectElement>) {
    if (!days.includes(value as Day, 0)) return;
    setDay(value as Day);
  }

  function handleRepeatChange({
    target: { value },
  }: React.ChangeEvent<HTMLSelectElement>) {
    if (!allowedRepeatValues.includes(Number(value), 0)) return;
    dispatch(
      changeWeekRepeat({ newRepeat: Number(value), position: week.position })
    );
  }

  return (
    <Form onSubmit={handleAddWorkout}>
      <Form.Row>
        <Col>
          <Form.Label>Day of the week</Form.Label>
          <Form.Control value={day} as="select" onChange={handleDayChange}>
            {days.map((day: Day, index: number) => (
              <option key={index} value={day}>
                {day}
              </option>
            ))}
          </Form.Control>
          {error ? <div className="text-danger">Day already taken</div> : null}
          <Button type="submit" className="px-2 py-0 my-2" variant="success">
            <h5 className="py-0 my-1">+ workout</h5>
          </Button>
        </Col>
        <Col>
          <Form.Label>Repeat week: </Form.Label>
          <Form.Control
            value={week.repeat}
            as="select"
            onChange={handleRepeatChange}
          >
            {allowedRepeatValues.map((repeatNumber: number, index: number) => (
              <option key={index} value={repeatNumber}>
                {repeatNumber} time{index === 1 ? null : "s"}
              </option>
            ))}
          </Form.Control>
        </Col>
      </Form.Row>
    </Form>
  );
}
