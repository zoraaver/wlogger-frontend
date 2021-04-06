import * as React from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { Redirect, useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "..";
import {
  addWorkout,
  Day,
  weekData,
  workoutData,
} from "../slices/workoutPlansSlice";

export function EditWeekPage() {
  const position: number = Number(useParams<{ position: string }>().position);
  const week = useAppSelector((state) =>
    state.workoutPlans.editWorkoutPlan?.weeks.find(
      (week: weekData) => week.position === position
    )
  ) as weekData;

  if (!week) return <Redirect to="/plans/new/weeks" />;

  const days: Day[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const remainingDays: Day[] = days.filter((day) => {
    return !week.workouts.map((workout) => workout.dayOfWeek).includes(day, 0);
  });

  const workouts: workoutData[] = week.workouts;

  const dispatch = useAppDispatch();
  function handleAddWorkout(event: React.FormEvent) {
    event.preventDefault();
    dispatch(addWorkout({ position, day }));
  }

  let day = remainingDays[0];

  function handleDayChange(event: React.ChangeEvent<HTMLSelectElement>) {
    day = event.target.value as Day;
  }

  return (
    <Container className="d-flex flex-column mt-5 justify-content-center align-items-center">
      <h3 className="my-4">Week {position}</h3>
      {remainingDays.length > 0 ? (
        <Card className="w-75">
          <Card.Body>
            <Form onSubmit={handleAddWorkout}>
              <Form.Row>
                <Col>
                  <Form.Label>Day of the week</Form.Label>
                  <Form.Control
                    as="select"
                    value={day}
                    onChange={handleDayChange}
                  >
                    {remainingDays.map((day: Day, index: number) => (
                      <option key={index} value={day}>
                        {day}
                      </option>
                    ))}
                  </Form.Control>
                  <Button
                    type="submit"
                    className="px-2 py-0 my-2"
                    variant="success"
                  >
                    <h5 className="py-0 my-1">+ workout</h5>
                  </Button>
                </Col>
              </Form.Row>
            </Form>
          </Card.Body>
        </Card>
      ) : null}
      {workouts.map((workout) => {
        return (
          <Card key={workout.dayOfWeek} className="w-75">
            <Card.Body>
              <Card.Title>{workout.dayOfWeek}</Card.Title>
            </Card.Body>
          </Card>
        );
      })}
    </Container>
  );
}
