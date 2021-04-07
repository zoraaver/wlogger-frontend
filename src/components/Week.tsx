import * as React from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { deleteWeek, weekData } from "../slices/workoutPlansSlice";
import { useHistory } from "react-router";
import { Pencil, Trash } from "react-bootstrap-icons";
import { WorkoutTable } from "../containers/WorkoutTable";
import { useAppDispatch } from "..";

interface WeekProps {
  weekData: weekData;
}

export function Week({ weekData: { repeat, position, workouts } }: WeekProps) {
  const history = useHistory();
  const dispatch = useAppDispatch();

  function handleDeleteClick() {
    dispatch(deleteWeek(position));
  }
  return (
    <Accordion className="w-75 mt-1">
      <Card>
        <Card.Header className="w-100 d-flex flex-row justify-content-start">
          <Accordion.Toggle
            className="mx-2"
            as={Button}
            variant="light"
            eventKey="0"
          >
            <strong>Week {position}</strong>: {workouts.length} workouts
          </Accordion.Toggle>
          <Button
            className="mx-2"
            variant="light"
            onClick={() => history.push(`/plans/new/weeks/${position}`)}
          >
            <Pencil />
          </Button>
          <Button variant="danger" className="mx-2" onClick={handleDeleteClick}>
            <Trash />
          </Button>
        </Card.Header>

        <Accordion.Collapse eventKey="0">
          <WorkoutTable workouts={workouts} />
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}
