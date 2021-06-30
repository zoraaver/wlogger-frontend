import * as React from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Redirect, useParams, useHistory } from "react-router";
import { useAppDispatch, useAppSelector } from "..";
import {
  deleteEmptyWorkouts,
  getWorkoutPlan,
  weekData,
} from "../slices/workoutPlansSlice";
import { ArrowLeft } from "react-bootstrap-icons";
import { WorkoutCard } from "../containers/WorkoutCard";
import { SomethingWentWrongAlert } from "../components/SomethingWentWrongAlert";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { workoutData } from "../slices/workoutsSlice";
import { WeekForm } from "../components/WeekForm";
import { exerciseNamesSelector } from "../slices/exercisesSlice";

export function EditWeekPage() {
  const dispatch = useAppDispatch();

  const history = useHistory();

  const params = useParams<{
    position: string;
    id?: string;
  }>();

  const position: number = Number(params.position);
  const id: string | undefined = params.id;

  const week = useAppSelector((state) =>
    state.workoutPlans.editWorkoutPlan?.weeks.find(
      (week: weekData) => week.position === position
    )
  ) as weekData;

  const error: string | undefined = useAppSelector(
    (state) => state.workoutPlans.error
  );

  const exerciseNames = useAppSelector(exerciseNamesSelector);

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

  function handleBackClick() {
    dispatch(deleteEmptyWorkouts(position));
    history.push(`/plans/${id ? id : "new"}/weeks`);
  }

  function renderPageTitle() {
    if (week.repeat !== 0) {
      return `Weeks ${week.position} - ${week.position + week.repeat}`;
    } else {
      return `Week ${week.position}`;
    }
  }

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center mt-5"
      style={{ marginLeft: 200 }}
    >
      <h3 className="my-4">{renderPageTitle()}</h3>
      <Button onClick={handleBackClick} className="mr-auto">
        <ArrowLeft className="mr-1" />
        Back
      </Button>
      <Card className="w-75">
        <Card.Body>
          <WeekForm week={week} />
        </Card.Body>
      </Card>
      {workouts.map((workout: workoutData) => {
        return (
          <WorkoutCard
            exerciseNames={exerciseNames}
            position={position}
            workout={workout}
            key={workout.dayOfWeek}
          />
        );
      })}
    </Container>
  );
}
