import * as React from "react";
import Table from "react-bootstrap/Table";
import { useAppSelector } from "..";
import { WorkoutLogRow } from "../components/WorkoutLogRow";
import { exerciseLogData, setLogData } from "../slices/workoutLogsSlice";

interface WorkoutLogTableProps {
  edit: boolean;
}
export function WorkoutLogTable({ edit }: WorkoutLogTableProps) {
  const exercises: exerciseLogData[] | undefined = useAppSelector(
    (state) => state.workoutLogs.editWorkoutLog?.exercises
  );

  if (!exercises) return <></>;

  return (
    <Table striped bordered className="mt-4 w-75 text-center" variant="dark">
      <thead>
        <tr>
          <th>Exercise</th>
          <th>Reps</th>
          <th>Weight</th>
          <th>Rest Interval (mm:ss)</th>
          <th>Form video</th>
        </tr>
      </thead>
      <tbody>
        {exercises.map((exercise: exerciseLogData, exerciseIndex: number) =>
          exercise.sets.map((set: setLogData, setIndex: number) => (
            <WorkoutLogRow
              key={setIndex}
              setIndex={setIndex}
              exerciseIndex={exerciseIndex}
              edit={edit}
            />
          ))
        )}
      </tbody>
    </Table>
  );
}
