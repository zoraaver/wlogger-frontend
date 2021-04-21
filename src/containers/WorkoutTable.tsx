import * as React from "react";
import { exerciseData, workoutData } from "../slices/workoutsSlice";
import Table from "react-bootstrap/Table";
import { ExerciseRow } from "../components/ExerciseRow";

interface WorkoutTableProps {
  workouts: workoutData[];
}

export function WorkoutTable({ workouts }: WorkoutTableProps) {
  function renderRows() {
    return workouts.map((workout: workoutData) => {
      if (workout.exercises.length === 0) return [];
      const firstExercise = workout.exercises[0];
      const firstRow: JSX.Element = (
        <tr key={-1}>
          <td rowSpan={workout.exercises.length}>{workout.dayOfWeek}</td>
          <td>{firstExercise.name}</td>
          <td>
            {firstExercise.sets} x {firstExercise.repetitions}
          </td>
          <td>
            {firstExercise.weight} {firstExercise.unit}
          </td>
        </tr>
      );
      const rows: JSX.Element[] = workout.exercises.map(
        (exercise: exerciseData, index: number) => (
          <ExerciseRow key={index} exerciseData={exercise} />
        )
      );
      rows[0] = firstRow;
      return rows;
    });
  }
  return (
    <Table striped bordered size="sm" className="mb-0">
      <thead>
        <tr>
          <th>Day</th>
          <th>Exercise</th>
          <th>Sets x reps</th>
          <th>Weight</th>
        </tr>
      </thead>
      <tbody>{renderRows()}</tbody>
    </Table>
  );
}
