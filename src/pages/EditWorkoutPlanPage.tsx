import * as React from "react";
import { Redirect, useHistory, useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "..";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
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
    return (
      <Spinner
        animation="border"
        style={{ position: "fixed", top: "50%", left: "50%" }}
      >
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  }

  function calculateLength(workoutPlanData: workoutPlanData): number {
    return workoutPlanData.weeks.reduce((acc: number, curr: weekData) => {
      return acc + curr.repeat + 1;
    }, 0);
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
      history.push("/plans");
    }
  }

  function renderAddWeek(): JSX.Element {
    if (
      calculateLength(workoutPlanData) >= workoutPlanData.length &&
      workoutPlanData.length
    ) {
      return <></>;
    }
    return (
      <Button onClick={handleAddClick} variant="success" className="mt-2">
        + week
      </Button>
    );
  }

  const { name, length } = workoutPlanData;
  return (
    <Container className="mt-5 d-flex flex-column justify-content-center align-items-center">
      <Card className="w-75 bg-light mt-3">
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Card.Text>
            <strong>Length:</strong> {length ? length + " weeks" : "indefinite"}
            <Button
              variant="primary"
              className="d-inline-block mx-4 mb-1 py-1"
              onClick={handleSaveClick}
            >
              {workoutPlanData._id ? "Update" : "Create"}
            </Button>
            {successMessage ? (
              <Alert className="d-inline-block mb-1 py-1" variant="success">
                {successMessage}
              </Alert>
            ) : null}
          </Card.Text>
        </Card.Body>
      </Card>
      {renderAddWeek()}
      {workoutPlanData.weeks.map((week: weekData) => (
        <Week weekData={week} key={week.position} />
      ))}
    </Container>
  );
}
