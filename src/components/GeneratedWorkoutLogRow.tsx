import * as React from "react";
import { exerciseData } from "../slices/workoutsSlice";

interface GeneratedWorkoutLogRowProps {
  exercise: exerciseData;
  exerciseIndex: number;
  setIndex: number;
  setButton: (setIndex: number, exericseIndex: number) => JSX.Element;
}

export function GeneratedWorkoutLogRow({
  setIndex,
  exercise,
  setButton,
  exerciseIndex,
}: GeneratedWorkoutLogRowProps) {
  return (
    <tr key={setIndex}>
      {setIndex === 0 ? <td rowSpan={exercise.sets}>{exercise.name}</td> : null}
      <td>{setIndex + 1}</td>
      <td>{exercise.weight}</td>
      <td>{exercise.repetitions}</td>
      <td>{exercise.restInterval}</td>
      <td>{setButton(setIndex, exerciseIndex)}</td>
    </tr>
  );
}
