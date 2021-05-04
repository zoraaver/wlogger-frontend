import * as React from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { deleteWeek, weekData } from "../slices/workoutPlansSlice";
import { useParams } from "react-router";
import { Pencil, Trash } from "react-bootstrap-icons";
import { WorkoutTable } from "../containers/WorkoutTable";
import { useAppDispatch } from "..";
import { Link } from "react-router-dom";

interface WeekCardProps {
  weekData: weekData;
}

export function WeekCard({
  weekData: { repeat, position, workouts },
}: WeekCardProps) {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  function handleDeleteClick() {
    dispatch(deleteWeek(position));
  }

  function renderTitle() {
    if (repeat !== 0) {
      return `Weeks ${position} - ${position + repeat}:`;
    } else {
      return `Week ${position}:`;
    }
  }

  return (
    <Accordion className="w-75 mt-1">
      <Card>
        <Card.Header className="w-100 d-flex flex-row justify-content-end align-items-center">
          <Accordion.Toggle
            className="mr-auto"
            as={Button}
            variant="light"
            eventKey="0"
          >
            <h6 className="d-inline font-weight-bold">{renderTitle()}</h6>{" "}
            {workouts.length} workout{workouts.length !== 1 ? "s" : ""}
          </Accordion.Toggle>
          <Link
            className="mr-3"
            to={`/plans/${id ? id : "new"}/weeks/${position}`}
          >
            <Pencil />
          </Link>
          <Button variant="danger" onClick={handleDeleteClick}>
            <Trash />
          </Button>
        </Card.Header>

        <Accordion.Collapse eventKey="0">
          <WorkoutTable workouts={workouts} weekPosition={position} />
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}
