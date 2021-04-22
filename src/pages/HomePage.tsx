import * as React from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { useAppDispatch, useAppSelector } from "..";
import { getNextWorkout, workoutData } from "../slices/workoutsSlice";
import { ExerciseTable } from "../containers/ExerciseTable";
import { isToday, isTomorrow } from "../util/util";
import { Card } from "react-bootstrap";
import { useHistory } from "react-router";
import { getCurrentPlan } from "../slices/workoutPlansSlice";
import { WorkoutPlanCard } from "../components/WorkoutPlanCard";

export function HomePage() {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const nextWorkout: workoutData | undefined = useAppSelector(
    (state) => state.workouts.nextWorkout
  );
  const message: string | undefined = useAppSelector(
    (state) => state.workouts.message
  );
  const currentPlan = useAppSelector((state) => state.workoutPlans.currentPlan);

  function renderHeader() {
    switch (message) {
      case undefined:
        break;
      case "Completed":
        const header: string = `You've finished your current workout plan!`;
        return header;
      default:
        return message;
    }
    if (!nextWorkout || !nextWorkout.date) return;
    const workoutDate: Date = new Date(nextWorkout.date as string);
    if (isToday(workoutDate)) {
      return "Today's workout:";
    } else if (isTomorrow(workoutDate)) {
      return "Tomorrow's workout";
    } else {
      return `Next workout: ${workoutDate.toDateString()}`;
    }
  }

  function renderBody() {
    if (message === undefined) {
      return;
    } else {
      return (
        <Card.Body className="d-flex flex-row justify-content-around align-items-center">
          <Button variant="success" onClick={() => history.push("/plans")}>
            Start a new plan
          </Button>
          or
          <Button variant="success" onClick={() => history.push("/logs/new")}>
            Log a workout
          </Button>
        </Card.Body>
      );
    }
  }

  function renderBeginWorkoutButton() {
    if (!nextWorkout || !nextWorkout.date) return;
    const workoutDate: Date = new Date(nextWorkout.date as string);
    if (isToday(workoutDate)) {
      return (
        <Button
          variant="success"
          onClick={() => history.push("/workout/logs/new")}
        >
          Begin workout
        </Button>
      );
    }
    return;
  }

  React.useEffect(() => {
    dispatch(getNextWorkout());
    dispatch(getCurrentPlan());
  }, []);

  return (
    <Container className="mt-5 py-1 d-flex flex-column justify-content-start align-items-center">
      <Card className="mt-4 mb-0 w-75 text-center align-middle">
        <Card.Header
          as="h4"
          className="d-flex flex-row justify-content-around align-items-center"
        >
          {renderHeader()}
          {renderBeginWorkoutButton()}
        </Card.Header>
        {renderBody()}
      </Card>
      {nextWorkout ? (
        <>
          <ExerciseTable workout={nextWorkout} width={75} />{" "}
        </>
      ) : null}
      {currentPlan && (
        <>
          <h3>Current plan:</h3>
          <WorkoutPlanCard
            showDelete={false}
            workoutPlan={currentPlan}
            width={75}
          />
        </>
      )}
    </Container>
  );
}
