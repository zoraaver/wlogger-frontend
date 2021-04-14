import * as React from "react";
import { Pencil, Trash } from "react-bootstrap-icons";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { workoutPlanHeaderData } from "../slices/workoutPlansSlice";

type WorkoutPlanCardProps = workoutPlanHeaderData & {
  handleShow: (_id: string, name: string) => void;
};

export function WorkoutPlanCard({
  name,
  length,
  _id,
  handleShow,
}: WorkoutPlanCardProps) {
  return (
    <Card className="w-50 mt-4">
      <Card.Header className="d-flex flex-row justify-content-end align-items-center">
        <Card.Title className="mb-0 mr-auto">{name}</Card.Title>
        <Button
          variant="link"
          href={`/plans/${_id}/weeks`}
          className="mb-0 d-inline-block"
        >
          <Pencil />
        </Button>
        <Button
          onClick={() => handleShow(_id, name)}
          variant="danger"
          className="ml-2 mb-0 d-inline-block py-1 px-1"
        >
          <Trash />
        </Button>
      </Card.Header>
      <Card.Body>
        <strong>Length:</strong> {length === 0 ? "Indefinite" : length} weeks
      </Card.Body>
    </Card>
  );
}
