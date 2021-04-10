import * as React from "react";
import Container from "react-bootstrap/Container";
import { useAppDispatch, useAppSelector } from "..";
import { WorkoutPlanCard } from "../components/WorkoutPlanCard";
import {
  deleteWorkoutPlan,
  getWorkoutPlans,
  workoutPlanHeaderData,
} from "../slices/workoutPlansSlice";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

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
      {successMessage ? (
        <Alert variant="success">Plan successfully created</Alert>
      ) : null}
      {workoutPlans.map((workoutPlan: workoutPlanHeaderData) => (
        <WorkoutPlanCard
          key={workoutPlan._id}
          name={workoutPlan.name}
          length={workoutPlan.length}
          _id={workoutPlan._id}
          handleShow={handleShow}
        />
      ))}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          Are you sure you want to delete{" "}
          <strong className="ml-1">{planToDelete.name}</strong>?
        </Modal.Header>
        <Modal.Body>This action is irreversible.</Modal.Body>
        <Modal.Footer className="py-1">
          <Button
            variant="primary"
            className="py-1"
            onClick={() => setShow(false)}
          >
            Close
          </Button>
          <Button variant="danger" className="py-1" onClick={handleDeleteClick}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
