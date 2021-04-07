import * as React from "react";
import { exerciseData, workoutData } from "../slices/workoutPlansSlice";
import Table from "react-bootstrap/Table";
import { ExerciseRow } from "../components/ExerciseRow";

interface ExerciseTableProps {
  workout: workoutData;
  weekPosition: number;
}
export function ExerciseTable({ workout, weekPosition }: ExerciseTableProps) {
  return (
    <Table striped bordered>
      <thead>
        <tr>
          <th>Exercise name</th>
          <th>Sets x reps</th>
          <th>Weight</th>
        </tr>
      </thead>
      <tbody>
        {workout.exercises.map((exerciseData: exerciseData, index: number) => (
          <ExerciseRow
            key={index}
            exerciseData={exerciseData}
            weekPosition={weekPosition}
            index={index}
            day={workout.dayOfWeek}
          />
        ))}
      </tbody>
    </Table>
  );
}
