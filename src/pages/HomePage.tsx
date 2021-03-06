import * as React from "react";
import Container from "react-bootstrap/Container";
import { useAppDispatch, useAppSelector } from "..";
import { getNextWorkout, workoutData } from "../slices/workoutsSlice";
import { ExerciseTable } from "../containers/ExerciseTable";
import { isToday, isTomorrow } from "../util/util";
import { Card } from "react-bootstrap";
import { getCurrentPlan } from "../slices/workoutPlansSlice";
import { WorkoutPlanCard } from "../components/WorkoutPlanCard";
import { Link } from "react-router-dom";

export function HomePage() {
  const dispatch = useAppDispatch();
  const nextWorkout: workoutData | undefined = useAppSelector(
    (state) => state.workouts.nextWorkout
  );
  const message: string | undefined = useAppSelector(
    (state) => state.workouts.message
  );
  const currentPlan = useAppSelector((state) => state.workoutPlans.currentPlan);

  React.useEffect(() => {
    dispatch(getCurrentPlan()).then(() => {
      dispatch(getNextWorkout());
    });
  }, []);

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
      return "Tomorrow's workout:";
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
          <Link className="btn btn-success" to="/plans">
            Start a new plan
          </Link>
          or
          <Link className="btn btn-success" to="/logs/new">
            Log a workout
          </Link>
        </Card.Body>
      );
    }
  }

  function renderBeginWorkoutButton() {
    if (!nextWorkout || !nextWorkout.date) return;
    const workoutDate: Date = new Date(nextWorkout.date as string);
    if (isToday(workoutDate)) {
      return (
        <Link className="btn btn-success" to="/workout/logs/new">
          Begin workout
        </Link>
      );
    } else {
      return (
        <Link className="btn btn-success" to="/logs/new">
          Log a separate workout
        </Link>
      );
    }
    return;
  }

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
