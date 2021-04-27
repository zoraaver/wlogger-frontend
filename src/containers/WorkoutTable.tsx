import * as React from "react";
import { exerciseData, workoutData } from "../slices/workoutsSlice";
import Table from "react-bootstrap/Table";
import { ExerciseRow } from "../components/ExerciseRow";
import { useAppSelector } from "..";
import { renderAutoIncrementField } from "../util/util";

interface WorkoutTableProps {
  workouts: workoutData[];
  weekPosition: number;
}

export function WorkoutTable({ workouts, weekPosition }: WorkoutTableProps) {
  const weekRepeat: number | undefined = useAppSelector(
    (state) =>
      state.workoutPlans.editWorkoutPlan?.weeks.find(
        (week) => week.position === weekPosition
      )?.repeat
  );

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
          {weekRepeat ? (
            <td>
              {firstExercise.autoIncrement
                ? firstExercise.autoIncrement.amount +
                  " " +
                  renderAutoIncrementField(
                    firstExercise.autoIncrement.field,
                    firstExercise.unit
                  )
                : "-"}
            </td>
          ) : null}
        </tr>
      );
      const rows: JSX.Element[] = workout.exercises.map(
        (exercise: exerciseData, index: number) => (
          <ExerciseRow
            key={index}
            exerciseData={exercise}
            weekPosition={weekPosition}
          />
        )
      );
      rows[0] = firstRow;
      return rows;
    });
  }

  return (
    <Table striped bordered size="sm" className="mb-0 text-center">
      <thead>
        <tr>
          <th>Day</th>
          <th>Exercise</th>
          <th>Sets x reps</th>
          <th>Weight</th>
          {weekRepeat ? <th>Auto-increment</th> : null}
        </tr>
      </thead>
      <tbody>{renderRows()}</tbody>
    </Table>
  );
}
