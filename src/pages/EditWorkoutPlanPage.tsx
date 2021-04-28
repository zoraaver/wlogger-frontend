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
import { WeekCard } from "../components/WeekCard";
import { SomethingWentWrongAlert } from "../components/SomethingWentWrongAlert";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { calculateLength } from "../util/util";

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
    // only fetch data if workout being edited is different or there is no data
    if (id && (!workoutPlanData || workoutPlanData._id !== id)) {
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
    const currentPosition: number = calculateLength(workoutPlanData) + 1;
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

  function renderStartDate() {
    if (workoutPlanData.status === "In progress") {
      const startDate = new Date(workoutPlanData.start as string);
      return (
        <>
          <strong>Start date:</strong> {startDate.toLocaleDateString()}
          <br></br>
        </>
      );
    }
    return undefined;
  }

  const { name, length } = workoutPlanData;
  return (
    <Container className="mt-5 d-flex flex-column justify-content-center align-items-center">
      <Card className="w-75 bg-light mt-3">
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Card.Text>
            <strong>Length:</strong> {length} weeks<br></br>
            {renderStartDate()}
            <Button
              variant="primary"
              className="d-inline-block my-2 py-1"
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
      {workoutPlanData.weeks.map((week: weekData, weekIndex: number) => (
        <WeekCard weekData={week} key={week.position} />
      ))}
    </Container>
  );
}
