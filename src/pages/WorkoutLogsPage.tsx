import * as React from "react";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useAppDispatch, useAppSelector } from "..";
import {
  deleteWorkoutLog,
  getWorkoutLogs,
  resetSuccess,
  workoutLogHeaderData,
} from "../slices/workoutLogsSlice";
import { ListGroup } from "react-bootstrap";
import { DeleteModal } from "../components/DeleteModal";
import { WorkoutLogItem } from "../components/WorkoutLogItem";

export function WorkoutLogsPage() {
  const workoutLogs: workoutLogHeaderData[] = useAppSelector(
    (state) => state.workoutLogs.data
  );
  const successMessage: string | undefined = useAppSelector(
    (state) => state.workoutLogs.success
  );
  const dispatch = useAppDispatch();
  const [show, setShow] = React.useState(false);
  const [logToDelete, setLogToDelete] = React.useState({
    _id: "",
    createdAt: new Date(),
  });

  React.useEffect(() => {
    dispatch(getWorkoutLogs());
  }, []);

  function handleDeleteClick() {
    dispatch(deleteWorkoutLog(logToDelete._id));
    dispatch(resetSuccess(4));
    setShow(false);
  }

  function handleShow(
    _id: workoutLogHeaderData["_id"],
    createdAt: workoutLogHeaderData["createdAt"]
  ) {
    setShow(true);
    setLogToDelete({ _id, createdAt: new Date(createdAt) });
  }

  const modalTitle: JSX.Element = (
    <>
      Are you sure you want to delete the log created at{" "}
      {logToDelete.createdAt.toLocaleString()}?
    </>
  );

  return (
    <Container className="mt-5 d-flex flex-column justify-content-start align-items-center">
      <h2 className="mt-4">Logs</h2>
      {successMessage ? (
        <Alert variant="success">{successMessage}</Alert>
      ) : null}
      {workoutLogs.length === 0 ? (
        <Card className="mt-3 w-50 text-center">
          <Card.Header>
            Looks like you haven't logged any workouts yet!
          </Card.Header>
          <Card.Body>
            <Button className="py-1" href="/logs/new">
              Log a workout
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <ListGroup variant="flush" className="w-50">
          {workoutLogs.map((workoutLog) => (
            <WorkoutLogItem
              workoutLog={workoutLog}
              handleShow={handleShow}
              key={workoutLog._id}
            />
          ))}
        </ListGroup>
      )}
      <DeleteModal
        handleCloseClick={() => setShow(false)}
        handleDeleteClick={handleDeleteClick}
        onHide={() => setShow(false)}
        show={show}
        title={modalTitle}
        body="Any associated form videos will also be deleted. This action is irreversible."
      />
    </Container>
  );
}
