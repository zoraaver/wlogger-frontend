import * as React from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { useAppDispatch, useAppSelector } from "..";
import {
  getWorkoutLogs,
  workoutLogHeaderData,
} from "../slices/workoutLogsSlice";
import { ListGroup } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import { DeleteModal } from "../components/DeleteModal";

export function WorkoutLogsPage() {
  const workoutLogs: workoutLogHeaderData[] = useAppSelector(
    (state) => state.workoutLogs.data
  );
  const successMessage: string | undefined = useAppSelector(
    (state) => state.workoutLogs.success
  );
  const dispatch = useAppDispatch();
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    dispatch(getWorkoutLogs());
  }, []);

  function handleDeleteClick() {}

  return (
    <Container className="mt-5 d-flex flex-column justify-content-start align-items-center">
      <h2 className="mt-4">Logs</h2>
      {successMessage ? (
        <Alert variant="success">{successMessage}</Alert>
      ) : null}
      <ListGroup variant="flush" className="w-50">
        {workoutLogs.map((workoutLog) => {
          const date = new Date(workoutLog.createdAt as string);
          return (
            <ListGroup.Item
              key={workoutLog._id}
              className="d-flex flex-row justify-content-start align-items-center"
            >
              <h5 className="my-0  mx-3 d-inline-block">
                {date.toDateString()}:
              </h5>{" "}
              {workoutLog.exerciseCount} exercise
              {workoutLog.exerciseCount > 1 ? "s" : null}, {workoutLog.setCount}{" "}
              set{workoutLog.setCount > 1 ? "s" : null}
              <Button
                variant="link"
                className="ml-auto my-0 py-0"
                href={"logs/" + workoutLog._id}
              >
                View
              </Button>
              <Button
                onClick={() => setShow(true)}
                variant="danger"
                className="py-1 px-1"
              >
                <Trash />
              </Button>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
      <DeleteModal
        handleCloseClick={() => setShow(false)}
        handleDeleteClick={handleDeleteClick}
        onHide={() => setShow(false)}
        show={show}
        title={"never"}
      />
    </Container>
  );
}
