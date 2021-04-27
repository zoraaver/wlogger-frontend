import * as React from "react";
import Button from "react-bootstrap/Button";
import { Day, deleteExercise } from "../slices/workoutPlansSlice";
import { Trash } from "react-bootstrap-icons";
import { useAppDispatch, useAppSelector } from "..";
import { exerciseData } from "../slices/workoutsSlice";
import { renderAutoIncrementField } from "../util/util";

interface ExerciseRowProps {
  exerciseData: exerciseData;
  day?: Day;
  weekPosition?: number;
  index?: number;
}
export function ExerciseRow({
  exerciseData: { name, sets, repetitions, weight, unit, autoIncrement },
  day,
  weekPosition,
  index,
}: ExerciseRowProps) {
  const dispatch = useAppDispatch();
  const weekRepeat: number | undefined = useAppSelector(
    (state) =>
      state.workoutPlans.editWorkoutPlan?.weeks.find(
        (week) => week.position === weekPosition
      )?.repeat
  );

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
      {weekRepeat ? (
        <td>
          {autoIncrement
            ? `${autoIncrement.amount} ${renderAutoIncrementField(
                autoIncrement.field,
                unit
              )}`
            : "-"}
        </td>
      ) : null}

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
