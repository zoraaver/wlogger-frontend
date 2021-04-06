import * as React from "react";
import { exerciseData } from "../slices/workoutPlansSlice";
import Table from "react-bootstrap/Table";
import { ExerciseRow } from "../components/ExerciseRow";

interface ExerciseTableProps {
  exercises: exerciseData[];
}
export function ExerciseTable({ exercises }: ExerciseTableProps) {
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
        {exercises.map((exerciseData: exerciseData, index: number) => (
          <ExerciseRow key={index} exerciseData={exerciseData} />
        ))}
      </tbody>
    </Table>
  );
}
