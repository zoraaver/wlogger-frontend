import * as React from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { weekData } from "../slices/workoutPlansSlice";
import { useHistory } from "react-router";
import { Pencil } from "react-bootstrap-icons";
import { WorkoutTable } from "../containers/WorkoutTable";

interface WeekProps {
  weekData: weekData;
}

export function Week({ weekData: { repeat, position, workouts } }: WeekProps) {
  const history = useHistory();
  return (
    <Accordion className="w-75 mt-1">
      <Card>
        <Card.Header className="w-100 d-flex flex-row justify-content-around">
          <Accordion.Toggle as={Button} variant="primary" eventKey="0">
            Week {position}
          </Accordion.Toggle>
          <Button
            variant="warning"
            onClick={() => history.push(`/plans/new/weeks/${position}`)}
          >
            <Pencil />
          </Button>
        </Card.Header>

        <Accordion.Collapse eventKey="0">
          <WorkoutTable workouts={workouts} />
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}
