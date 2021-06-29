import * as React from "react";
import { workoutExerciseData, workoutData } from "../slices/workoutsSlice";
import Table from "react-bootstrap/Table";
import { ExerciseRow } from "../components/ExerciseRow";
import { useAppSelector } from "..";

interface ExerciseTableProps {
  workout: workoutData;
  width?: number;
  weekPosition?: number;
}
export function ExerciseTable({
  workout,
  weekPosition,
  width,
}: ExerciseTableProps) {
  const weekRepeat: number | undefined = useAppSelector(
    (state) =>
      state.workoutPlans.editWorkoutPlan?.weeks.find(
        (week) => week.position === weekPosition
      )?.repeat
  );

  return (
    <Table className={width ? "w-" + width : ""} striped bordered>
      <thead>
        <tr>
          <th>Exercise name</th>
          <th>Sets x reps</th>
          <th>Weight</th>
          {weekRepeat ? <th>Auto-increment</th> : null}
        </tr>
      </thead>
      <tbody>
        {workout.exercises.map(
          (exerciseData: workoutExerciseData, index: number) => (
            <ExerciseRow
              key={index}
              exerciseData={exerciseData}
              weekPosition={weekPosition}
              index={index}
              day={workout.dayOfWeek}
            />
          )
        )}
      </tbody>
    </Table>
  );
}
