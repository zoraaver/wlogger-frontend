import * as React from "react";
import { Redirect, useHistory } from "react-router";
import { useAppDispatch, useAppSelector } from "..";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import {
  workoutPlanData,
  weekData,
  addWeek,
} from "../slices/workoutPlansSlice";
import { Week } from "../components/Week";

export function EditWorkoutPlanPage() {
  const workoutPlanData = useAppSelector(
    (state) => state.workoutPlans.editWorkoutPlan
  ) as workoutPlanData;
  if (!workoutPlanData) {
    return <Redirect to="/plans/new" />;
  }

  function calculateLength(workoutPlanData: workoutPlanData): number {
    return workoutPlanData.weeks.reduce((acc: number, curr: weekData) => {
      return acc + curr.repeat + 1;
    }, 0);
  }

  const history = useHistory();
  const dispatch = useAppDispatch();

  function handleAddWeek() {
    const currentPosition: number = workoutPlanData.weeks.length + 1;
    dispatch(addWeek({ position: currentPosition, repeat: 0, workouts: [] }));
    history.push(`/plans/new/weeks/${currentPosition}`);
  }

  function renderAddWeek(): JSX.Element {
    if (
      calculateLength(workoutPlanData) >= workoutPlanData.length &&
      workoutPlanData.length
    ) {
      return <></>;
    }
    return (
      <Button onClick={handleAddWeek} variant="success" className="mt-2">
        + week
      </Button>
    );
  }

  const { name, length } = workoutPlanData;
  return (
    <Container className="mt-5 d-flex flex-column justify-content-center align-items-center">
      <Card className="w-75 bg-light mt-3">
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Card.Text>
            <strong>Length:</strong> {length ? length + " weeks" : "indefinite"}
          </Card.Text>
        </Card.Body>
      </Card>
      {renderAddWeek()}
      {workoutPlanData.weeks.map((week: weekData) => (
        <Week weekData={week} key={week.position} />
      ))}
    </Container>
  );
}
