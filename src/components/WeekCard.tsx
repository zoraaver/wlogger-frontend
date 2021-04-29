import * as React from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { deleteWeek, weekData } from "../slices/workoutPlansSlice";
import { useHistory, useParams } from "react-router";
import { Pencil, Trash } from "react-bootstrap-icons";
import { WorkoutTable } from "../containers/WorkoutTable";
import { useAppDispatch } from "..";

interface WeekCardProps {
  weekData: weekData;
}

export function WeekCard({
  weekData: { repeat, position, workouts },
}: WeekCardProps) {
  const history = useHistory();
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
        <Card.Header className="w-100 d-flex flex-row justify-content-end">
          <Accordion.Toggle
            className="mr-auto"
            as={Button}
            variant="light"
            eventKey="0"
          >
            <h6 className="d-inline font-weight-bold">{renderTitle()}</h6>{" "}
            {workouts.length} workout{workouts.length !== 1 ? "s" : ""}
          </Accordion.Toggle>
          <Button
            className="mx-2"
            variant="link"
            onClick={() =>
              history.push(`/plans/${id ? id : "new"}/weeks/${position}`)
            }
          >
            <Pencil />
          </Button>
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