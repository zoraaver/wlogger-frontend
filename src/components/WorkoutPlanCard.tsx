import * as React from "react";
import { Pencil, Trash } from "react-bootstrap-icons";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import {
  patchStartWorkoutPlan,
  resetError,
  workoutPlanHeaderData,
} from "../slices/workoutPlansSlice";
import { useAppDispatch } from "..";
import { useHistory } from "react-router";

interface WorkoutPlanCardProps {
  workoutPlan: workoutPlanHeaderData;
  showDelete?: boolean;
  handleShow?: (_id: string, name: string) => void;
  width?: number;
}

export function WorkoutPlanCard({
  workoutPlan,
  handleShow,
  showDelete,
  width = 50,
}: WorkoutPlanCardProps) {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { name, length, status, _id, start, end } = workoutPlan;
  const widthString: string = `w-${width}`;

  async function handleStartClick() {
    await dispatch(patchStartWorkoutPlan(_id));
    dispatch(resetError(4));
  }

  function renderFooter(): JSX.Element | null {
    switch (status) {
      case "Not started":
        return (
          <Button className="py-1" onClick={handleStartClick}>
            Start
          </Button>
        );
      case "In progress":
        return start ? <>Start date: {new Date(start).toDateString()}</> : null;
      case "Completed":
        return start && end ? (
          <>
            Start date: {new Date(start).toDateString()}
            <br></br>End date: {new Date(end).toDateString()}
          </>
        ) : null;
    }
  }

  return (
    <Card className={widthString + " mt-4"}>
      <Card.Header className="d-flex flex-row justify-content-end align-items-center">
        <Card.Title className="mb-0 mr-auto">{name}</Card.Title>
        <Button
          onClick={() => history.push(`/plans/${_id}/weeks`)}
          variant="link"
          className="mb-0 d-inline-block"
        >
          <Pencil />
        </Button>
        {showDelete && handleShow ? (
          <Button
            onClick={() => handleShow(_id, name)}
            variant="danger"
            className="ml-2 mb-0 d-inline-block py-1 px-1"
          >
            <Trash />
          </Button>
        ) : null}
      </Card.Header>
      <Card.Body>
        <strong>Length:</strong> {length === 0 ? "Indefinite" : length} weeks
        <br></br>
        <strong>Status:</strong> {status}
      </Card.Body>
      <Card.Footer>{renderFooter()}</Card.Footer>
    </Card>
  );
}
