import * as React from "react";
import { Pencil, Trash } from "react-bootstrap-icons";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { workoutPlanHeaderData } from "../slices/workoutPlansSlice";
import { Link } from "react-router-dom";

interface WorkoutPlanCardProps {
  workoutPlan: workoutPlanHeaderData;
  showDelete?: boolean;
  handleShowDeleteModal?: (id: string, name: string) => void;
  handleShowStartModal?: (id: string, name: string) => void;
  width?: number;
}

export function WorkoutPlanCard({
  workoutPlan,
  handleShowDeleteModal,
  handleShowStartModal,
  showDelete,
  width = 50,
}: WorkoutPlanCardProps) {
  const { name, length, status, _id, start, end } = workoutPlan;
  const widthString: string = `w-${width}`;

  const startButton: JSX.Element = (
    <Button
      className="py-1"
      onClick={() => handleShowStartModal && handleShowStartModal(_id, name)}
    >
      Start
    </Button>
  );

  function renderFooter(): JSX.Element | null {
    switch (status) {
      case "Not started":
        return startButton;
      case "In progress":
        return start ? <>Start date: {new Date(start).toDateString()}</> : null;
      case "Completed":
        return start && end ? (
          <>
            <span>Start date: {new Date(start).toDateString()}</span>
            <span>End date: {new Date(end).toDateString()}</span>
            {startButton}
          </>
        ) : null;
    }
  }

  return (
    <Card className={widthString + " mt-4"}>
      <Card.Header className="d-flex flex-row justify-content-end align-items-center">
        <Card.Title className="mb-0 mr-auto">{name}</Card.Title>
        <Link to={`/plans/${_id}/weeks`} className="mr-2">
          <Pencil />
        </Link>
        {showDelete && handleShowDeleteModal ? (
          <Button
            onClick={() => handleShowDeleteModal(_id, name)}
            variant="danger"
            className="ml-2 mb-0 d-inline-block py-1 px-1"
          >
            <Trash />
          </Button>
        ) : null}
      </Card.Header>
      <Card.Body>
        <strong>Length:</strong> {length} weeks
        <br></br>
        <strong>Status:</strong> {status}
      </Card.Body>
      <Card.Footer className="d-flex flex-column align-items-start justify-content-between">
        {renderFooter()}
      </Card.Footer>
    </Card>
  );
}
