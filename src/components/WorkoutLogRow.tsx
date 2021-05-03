import * as React from "react";
import { useAppSelector } from "..";
import {
  exerciseLogData,
  setLogData,
  workoutLogData,
  WorkoutLogPosition,
} from "../slices/workoutLogsSlice";
import { renderRestInterval } from "../util/util";
import { LogVideoFileInput } from "./LogVideoFileInput";
import { RemoveVideoFileInput } from "./RemoveVideoFileInput";
import { SetVideoOptions } from "./SetVideoOptions";

export function WorkoutLogRow({
  setIndex,
  exerciseIndex,
  edit,
}: WorkoutLogPosition & { edit: boolean }) {
  const workoutLog: workoutLogData = useAppSelector(
    (state) => state.workoutLogs.editWorkoutLog
  );
  const exercise: exerciseLogData = workoutLog.exercises[exerciseIndex];
  const set: setLogData = exercise.sets[setIndex];

  function renderVideoCell(): JSX.Element {
    if (!edit && !set.formVideo) {
      return <>-</>;
    } else if (!edit) {
      return (
        <SetVideoOptions setIndex={setIndex} exerciseIndex={exerciseIndex} />
      );
    } else if (set.formVideoName) {
      return (
        <RemoveVideoFileInput
          setIndex={setIndex}
          exerciseIndex={exerciseIndex}
        />
      );
    } else {
      return (
        <LogVideoFileInput setIndex={setIndex} exerciseIndex={exerciseIndex} />
      );
    }
  }

  return (
    <tr key={setIndex}>
      {setIndex === 0 ? (
        <td rowSpan={exercise.sets.length}>{exercise.name}</td>
      ) : null}
      <td>{set.repetitions}</td>
      <td>
        {set.weight} {set.unit}
      </td>
      <td>{renderRestInterval(set.restInterval)}</td>
      <td>{renderVideoCell()}</td>
    </tr>
  );
}
