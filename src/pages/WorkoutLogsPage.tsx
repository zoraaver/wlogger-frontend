import * as React from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { useAppDispatch, useAppSelector } from "..";
import { getWorkoutLogs } from "../slices/workoutLogsSlice";
import { ListGroup } from "react-bootstrap";
import { Pencil, Trash } from "react-bootstrap-icons";

export function WorkoutLogsPage() {
  const workoutLogs = useAppSelector((state) => state.workoutLogs.data);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(getWorkoutLogs());
  }, []);

  console.log(workoutLogs);
  return (
    <Container className="mt-5 d-flex flex-column justify-content-start align-items-center">
      <h2 className="mt-4">Logs</h2>
      <ListGroup variant="flush" className="w-50">
        {workoutLogs.map((workoutLog) => {
          const date = new Date(workoutLog.createdAt as string);
          return (
            <ListGroup.Item
              key={workoutLog._id}
              className="d-flex flex-row justify-content-start align-items-center"
            >
              {date.toDateString()}
              <Button variant="link" className="ml-auto my-0 py-0">
                <Pencil />
              </Button>
              <Button variant="danger" className="py-1 px-1">
                <Trash />
              </Button>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Container>
  );
}
