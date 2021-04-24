import * as React from "react";
import Table from "react-bootstrap/Table";
import { useAppSelector } from "..";
import { exerciseLogData, setLogData } from "../slices/workoutLogsSlice";
import { renderRestInterval } from "../util/util";

export function WorkoutLogTable() {
  const exercises: exerciseLogData[] | undefined = useAppSelector(
    (state) => state.workoutLogs.editWorkoutLog?.exercises
  );

  if (!exercises) return <></>;

  function renderRows() {
    return exercises?.map((exercise: exerciseLogData, index: number) =>
      exercise.sets.map((set: setLogData, index: number) => (
        <tr key={index}>
          {index === 0 ? (
            <td rowSpan={exercise.sets.length}>{exercise.name}</td>
          ) : null}
          <td>{set.repetitions}</td>
          <td>
            {set.weight} {set.unit}
          </td>
          <td>{renderRestInterval(set.restInterval)}</td>
        </tr>
      ))
    );
  }

  return (
    <Table striped bordered className="mt-4 w-75 text-center" variant="dark">
      <thead>
        <tr>
          <th>Exercise</th>
          <th>Reps</th>
          <th>Weight</th>
          <th>Rest Interval (mm:ss)</th>
        </tr>
      </thead>
      <tbody>{renderRows()}</tbody>
    </Table>
  );
}
