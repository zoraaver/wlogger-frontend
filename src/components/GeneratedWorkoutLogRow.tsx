import * as React from "react";
import { exerciseData } from "../slices/workoutsSlice";

interface GeneratedWorkoutLogRowProps {
  exercise: exerciseData;
  exerciseIndex: number;
  setIndex: number;
  setButton: (setIndex: number, exericseIndex: number) => JSX.Element;
  renderRepetitionsCell: (
    setIndex: number,
    exerciseIndex: number
  ) => JSX.Element | number | undefined;
  renderRestIntervalCell: (
    setIndex: number,
    exerciseIndex: number
  ) => JSX.Element | number | undefined | string;
}

export function GeneratedWorkoutLogRow({
  setIndex,
  exerciseIndex,
  exercise,
  setButton,
  renderRepetitionsCell,
  renderRestIntervalCell,
}: GeneratedWorkoutLogRowProps) {
  return (
    <tr key={setIndex}>
      {setIndex === 0 ? <td rowSpan={exercise.sets}>{exercise.name}</td> : null}
      <td>{setIndex + 1}</td>
      <td>
        {exercise.weight} {exercise.unit}
      </td>
      <td>{renderRepetitionsCell(setIndex, exerciseIndex)}</td>
      <td>{renderRestIntervalCell(setIndex, exerciseIndex)}</td>
      <td className="text-center">{setButton(setIndex, exerciseIndex)}</td>
    </tr>
  );
}
