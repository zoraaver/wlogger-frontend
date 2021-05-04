import * as React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import { Trash } from "react-bootstrap-icons";
import { workoutLogHeaderData } from "../slices/workoutLogsSlice";
import { Link } from "react-router-dom";

interface WorkoutLogItemProps {
  workoutLog: workoutLogHeaderData;
  handleShow: (
    _id: workoutLogHeaderData["_id"],
    createdAt: workoutLogHeaderData["createdAt"]
  ) => void;
}
export function WorkoutLogItem({
  workoutLog,
  handleShow,
}: WorkoutLogItemProps) {
  const date = new Date(workoutLog.createdAt as string);
  return (
    <ListGroup.Item
      key={workoutLog._id}
      className="d-flex flex-row justify-content-start align-items-center"
    >
      <h5 className="my-0  mx-3 d-inline-block">{date.toDateString()}:</h5>{" "}
      {workoutLog.exerciseCount} exercise
      {workoutLog.exerciseCount > 1 ? "s" : null}, {workoutLog.setCount} set
      {workoutLog.setCount > 1 ? "s" : null}
      <Link className="ml-auto mr-3 my-0 py-0" to={`logs/${workoutLog._id}`}>
        View
      </Link>
      <Button
        onClick={() => handleShow(workoutLog._id, workoutLog.createdAt)}
        variant="danger"
        className="py-1 px-1"
      >
        <Trash />
      </Button>
    </ListGroup.Item>
  );
}
