import * as React from "react";
import Container from "react-bootstrap/Container";
import { useAppDispatch, useAppSelector } from "..";
import { WorkoutPlanCard } from "../components/WorkoutPlanCard";
import {
  deleteWorkoutPlan,
  getWorkoutPlans,
  resetSuccess,
  workoutPlanHeaderData,
} from "../slices/workoutPlansSlice";
import Alert from "react-bootstrap/Alert";
import { DeleteModal } from "../components/DeleteModal";

export function WorkoutPlansPage() {
  const dispatch = useAppDispatch();
  const [show, setShow] = React.useState(false);
  const [planToDelete, setPlanToDelete] = React.useState({ name: "", _id: "" });

  function handleShow(_id: string, name: string) {
    setPlanToDelete({ _id, name });
    setShow(true);
  }

  function handleDeleteClick() {
    dispatch(deleteWorkoutPlan(planToDelete._id));
    dispatch(resetSuccess(4));
    setShow(false);
  }

  const { data: workoutPlans, success: successMessage } = useAppSelector(
    (state) => state.workoutPlans
  );

  React.useEffect(() => {
    dispatch(getWorkoutPlans());
  }, []);

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ marginLeft: 200, marginTop: 68 }}
    >
      <h2>My plans</h2>
      <Alert variant="success" show={!!successMessage}>
        {successMessage}
      </Alert>
      {workoutPlans.map((workoutPlan: workoutPlanHeaderData) => (
        <WorkoutPlanCard
          key={workoutPlan._id}
          name={workoutPlan.name}
          length={workoutPlan.length}
          _id={workoutPlan._id}
          handleShow={handleShow}
        />
      ))}
      <DeleteModal
        onHide={() => setShow(false)}
        show={show}
        title={planToDelete.name}
        handleDeleteClick={handleDeleteClick}
        handleCloseClick={() => setShow(false)}
      />
    </Container>
  );
}
