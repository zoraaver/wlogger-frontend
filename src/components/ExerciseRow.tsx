import * as React from "react";
import { exerciseData } from "../slices/workoutPlansSlice";

interface ExerciseRowProps {
  exerciseData: exerciseData;
}
export function ExerciseRow({
  exerciseData: { name, sets, repetitions, weight, unit },
}: ExerciseRowProps) {
  return (
    <tr>
      <td>{name}</td>
      <td>
        {sets} x {repetitions}
      </td>
      <td>
        {weight} {unit}
      </td>
    </tr>
  );
}
