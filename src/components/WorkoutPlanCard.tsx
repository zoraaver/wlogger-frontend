import * as React from "react";
import { Pencil, Trash } from "react-bootstrap-icons";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { workoutPlanHeaderData } from "../slices/workoutPlansSlice";
import { useHistory } from "react-router";

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
  const history = useHistory();
  const { name, length, status, _id, start, end } = workoutPlan;
  const widthString: string = `w-${width}`;

  function renderFooter(): JSX.Element | null {
    switch (status) {
      case "Not started":
        if (handleShowStartModal !== undefined) {
          return (
            <Button
              className="py-1"
              onClick={() => handleShowStartModal(_id, name)}
            >
              Start
            </Button>
          );
        }
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
        <strong>Length:</strong> {length === 0 ? "Indefinite" : length} weeks
        <br></br>
        <strong>Status:</strong> {status}
      </Card.Body>
      <Card.Footer>{renderFooter()}</Card.Footer>
    </Card>
  );
}
