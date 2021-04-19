import * as React from "react";
import { Redirect, useHistory, useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "..";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import {
  workoutPlanData,
  weekData,
  addWeek,
  postWorkoutPlan,
  getWorkoutPlan,
  patchWorkoutPlan,
  resetSuccess,
} from "../slices/workoutPlansSlice";
import { Week } from "../components/Week";
import { SomethingWentWrongAlert } from "../components/SomethingWentWrongAlert";
import { LoadingSpinner } from "../components/LoadingSpinner";

export function EditWorkoutPlanPage() {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const workoutPlanData = useAppSelector(
    (state) => state.workoutPlans.editWorkoutPlan
  ) as workoutPlanData;

  const successMessage: string | undefined = useAppSelector(
    (state) => state.workoutPlans.success
  );

  const error: string | undefined = useAppSelector(
    (state) => state.workoutPlans.error
  );

  React.useEffect(() => {
    if (id && !workoutPlanData) {
      dispatch(getWorkoutPlan(id));
    }
  }, [id]);

  // handle redirects if workout data is still loading or if there was an error fetching the data
  if (error) {
    return <SomethingWentWrongAlert />;
  }
  if (!id && !workoutPlanData) {
    return <Redirect to="/plans/new" />;
  } else if (id && !workoutPlanData) {
    return <LoadingSpinner />;
  }

  function handleAddClick() {
    const currentPosition: number = workoutPlanData.weeks.length + 1;
    dispatch(addWeek({ position: currentPosition, repeat: 0, workouts: [] }));
    history.push(`/plans/${id ? id : "new"}/weeks/${currentPosition}`);
  }

  async function handleSaveClick() {
    if (id) {
      await dispatch(patchWorkoutPlan(workoutPlanData));
      dispatch(resetSuccess(4));
    } else {
      await dispatch(postWorkoutPlan(workoutPlanData));
      dispatch(resetSuccess(4));
      history.push("/plans");
    }
  }

  const { name, length } = workoutPlanData;
  return (
    <Container className="mt-5 d-flex flex-column justify-content-center align-items-center">
      <Card className="w-75 bg-light mt-3">
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Card.Text>
            <strong>Length:</strong> {length} weeks
            <Button
              variant="primary"
              className="d-inline-block mx-4 mb-1 py-1"
              onClick={handleSaveClick}
            >
              {workoutPlanData._id ? "Save" : "Create"}
            </Button>
          </Card.Text>
          <Alert show={!!successMessage} variant="success">
            {successMessage}
          </Alert>
        </Card.Body>
      </Card>
      <Button onClick={handleAddClick} variant="success" className="mt-2">
        + week
      </Button>
      {workoutPlanData.weeks.map((week: weekData) => (
        <Week weekData={week} key={week.position} />
      ))}
    </Container>
  );
}
