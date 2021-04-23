import * as React from "react";
import Container from "react-bootstrap/Container";
import { useAppDispatch, useAppSelector } from "..";
import { WorkoutPlanCard } from "../components/WorkoutPlanCard";
import {
  deleteWorkoutPlan,
  getWorkoutPlans,
  patchStartWorkoutPlan,
  resetError,
  resetSuccess,
  workoutPlanHeaderData,
} from "../slices/workoutPlansSlice";
import Alert from "react-bootstrap/Alert";
import { DeleteModal } from "../components/DeleteModal";
import { StartModal } from "../components/StartModal";

export function WorkoutPlansPage() {
  const dispatch = useAppDispatch();
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [planToDelete, setPlanToDelete] = React.useState({ name: "", id: "" });
  const [showStartModal, setShowStartModal] = React.useState(false);
  const [planToStart, setPlanToStart] = React.useState({ name: "", id: "" });

  const { data: workoutPlans, success: successMessage, error } = useAppSelector(
    (state) => state.workoutPlans
  );

  React.useEffect(() => {
    dispatch(getWorkoutPlans());
  }, []);

  const deleteModalTitle: JSX.Element = (
    <>
      Are you sure you want to delete{" "}
      <strong className="ml-1">{planToDelete.name}</strong>?
    </>
  );

  const startModalTitle: JSX.Element = (
    <>
      Are you sure you want to start{" "}
      <strong className="ml-1">{planToStart.name}</strong>?
    </>
  );

  function handleShowDeleteModal(id: string, name: string) {
    setPlanToDelete({ id: id, name });
    setShowDeleteModal(true);
  }

  function handleShowStartModal(id: string, name: string) {
    setPlanToStart({ id: id, name });
    setShowStartModal(true);
  }

  function handleDeleteClick() {
    dispatch(deleteWorkoutPlan(planToDelete.id));
    dispatch(resetSuccess(4));
    setShowDeleteModal(false);
  }

  function handleStartClick() {
    dispatch(patchStartWorkoutPlan(planToStart.id));
    dispatch(resetError(4));
    setShowStartModal(false);
  }

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ marginTop: 68 }}
    >
      <h2>My plans</h2>
      <Alert variant="success" show={!!successMessage}>
        {successMessage}
      </Alert>
      <Alert variant="danger" show={!!error}>
        {error}
      </Alert>
      {workoutPlans.map((workoutPlan: workoutPlanHeaderData) => (
        <WorkoutPlanCard
          key={workoutPlan._id}
          workoutPlan={workoutPlan}
          handleShowDeleteModal={handleShowDeleteModal}
          handleShowStartModal={handleShowStartModal}
          showDelete={true}
        />
      ))}
      <DeleteModal
        onHide={() => setShowDeleteModal(false)}
        show={showDeleteModal}
        title={deleteModalTitle}
        handleDeleteClick={handleDeleteClick}
        handleCloseClick={() => setShowDeleteModal(false)}
      />
      <StartModal
        show={showStartModal}
        title={startModalTitle}
        onHide={() => setShowStartModal(false)}
        handleCloseClick={() => setShowStartModal(false)}
        handleStartClick={handleStartClick}
      />
    </Container>
  );
}
