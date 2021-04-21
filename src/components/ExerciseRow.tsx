import * as React from "react";
import Button from "react-bootstrap/Button";
import { Day, deleteExercise } from "../slices/workoutPlansSlice";
import { Trash } from "react-bootstrap-icons";
import { useAppDispatch } from "..";
import { exerciseData } from "../slices/workoutsSlice";

interface ExerciseRowProps {
  exerciseData: exerciseData;
  day?: Day;
  weekPosition?: number;
  index?: number;
}
export function ExerciseRow({
  exerciseData: { name, sets, repetitions, weight, unit },
  day,
  weekPosition,
  index,
}: ExerciseRowProps) {
  const dispatch = useAppDispatch();

  function handleDeleteClick() {
    if (
      weekPosition !== undefined &&
      day !== undefined &&
      index !== undefined
    ) {
      dispatch(deleteExercise({ weekPosition, day, exerciseIndex: index }));
    }
  }

  return (
    <tr>
      <td>{name}</td>
      <td>
        {sets} x {repetitions}
      </td>
      <td>
        {weight} {unit}
      </td>
      {weekPosition && day ? (
        <td className="text-center">
          <Button
            variant="danger"
            onClick={handleDeleteClick}
            className="px-1 py-0 my-0"
          >
            <Trash size={15} />
          </Button>
        </td>
      ) : null}
    </tr>
  );
}
