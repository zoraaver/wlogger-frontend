import * as React from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import { Redirect, useParams, useHistory } from "react-router";
import { useAppDispatch, useAppSelector } from "..";
import {
  addWorkout,
  Day,
  deleteEmptyWorkouts,
  getWorkoutPlan,
  weekData,
  workoutData,
} from "../slices/workoutPlansSlice";
import { ArrowLeft } from "react-bootstrap-icons";
import { WorkoutCard } from "../containers/WorkoutCard";
import { SomethingWentWrongAlert } from "../components/SomethingWentWrongAlert";
import { LoadingSpinner } from "../components/LoadingSpinner";

export function EditWeekPage() {
  const params = useParams<{
    position: string;
    id?: string;
  }>();
  const position: number = Number(params.position);
  const id: string | undefined = params.id;

  const [day, setDay] = React.useState<Day>("Monday");
  const [alert, setAlert] = React.useState(false);
  const history = useHistory();
  const week = useAppSelector((state) =>
    state.workoutPlans.editWorkoutPlan?.weeks.find(
      (week: weekData) => week.position === position
    )
  ) as weekData;
  const error: string | undefined = useAppSelector(
    (state) => state.workoutPlans.error
  );

  const dispatch = useAppDispatch();
  React.useEffect(() => {
    if (id && !week) {
      dispatch(getWorkoutPlan(id));
    }
  }, [id]);

  // handle errors and loading status
  if (error) {
    return <SomethingWentWrongAlert />;
  }
  if (!week && !id) {
    return <Redirect to="/plans/new/weeks" />;
  } else if (!week && id) {
    return <LoadingSpinner />;
  }

  const workouts: workoutData[] = week.workouts;
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

  function handleBackClick() {
    dispatch(deleteEmptyWorkouts(position));
    history.push(`/plans/${id ? id : "new"}/weeks`);
  }

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center mt-5"
      style={{ marginLeft: 200 }}
    >
      <h3 className="my-4">Week {position}</h3>
      <Button onClick={handleBackClick} className="mr-auto">
        <ArrowLeft className="mr-1" />
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
      {workouts.map((workout: workoutData) => {
        return (
          <WorkoutCard
            position={position}
            workout={workout}
            key={workout.dayOfWeek}
          />
        );
      })}
    </Container>
  );
}
