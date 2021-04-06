import * as React from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Accordion from "react-bootstrap/Accordion";
import { Redirect, useParams, useHistory } from "react-router";
import { useAppDispatch, useAppSelector } from "..";
import {
  addWorkout,
  Day,
  weekData,
  workoutData,
} from "../slices/workoutPlansSlice";
import { ExerciseForm } from "../components/ExerciseForm";
import { ExerciseTable } from "../containers/ExerciseTable";

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

  const workouts: workoutData[] = week.workouts;
  const [day, setDay] = React.useState<Day>("Monday");
  const [alert, setAlert] = React.useState(false);

  const dispatch = useAppDispatch();
  function handleAddWorkout(event: React.FormEvent) {
    event.preventDefault();
    if (week.workouts.map((workout) => workout.dayOfWeek).includes(day, 0)) {
      setAlert(true);
      return;
    }
    setAlert(false);
    dispatch(addWorkout({ position, day }));
  }

  function handleDayChange({
    target: { value },
  }: React.ChangeEvent<HTMLSelectElement>) {
    if (!days.includes(value as Day, 0)) return;
    setDay(value as Day);
  }
  const history = useHistory();

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center mt-5"
      style={{ marginLeft: 200 }}
    >
      <h3 className="my-4">Week {position}</h3>
      <Button onClick={() => history.goBack()} className="mr-auto">
        Back
      </Button>
      <Card className="w-75">
        <Card.Body>
          <Form onSubmit={handleAddWorkout}>
            <Form.Row>
              <Col>
                {alert ? (
                  <Alert variant="danger">Day already taken</Alert>
                ) : null}
                <Form.Label>Day of the week</Form.Label>
                <Form.Control
                  value={day}
                  as="select"
                  onChange={handleDayChange}
                >
                  {days.map((day: Day, index: number) => (
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
      {workouts.map((workout) => {
        return (
          <Accordion
            key={workout.dayOfWeek}
            className="w-75 my-1"
            defaultActiveKey="0"
          >
            <Card>
              <Card.Header className="text-center">
                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                  {workout.dayOfWeek}
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <ExerciseTable exercises={workout.exercises} />
                  <ExerciseForm
                    dayOfWeek={workout.dayOfWeek}
                    position={position}
                  />
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        );
      })}
    </Container>
  );
}
