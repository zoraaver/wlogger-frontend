import * as React from "react";
import { useAppDispatch, useAppSelector } from "..";
import {
  exerciseLogData,
  setCurrentSetVideo,
  setLogData,
  WorkoutLogPosition,
} from "../slices/workoutLogsSlice";
import { renderRestInterval } from "../util/util";
import { LogVideoFileInput } from "./LogVideoFileInput";
import { RemoveVideoFileInput } from "./RemoveVideoFileInput";
import { PlayCircle } from "react-bootstrap-icons";
// import Button from "react-bootstrap/Button";

export function WorkoutLogRow({
  setIndex,
  exerciseIndex,
  edit,
}: WorkoutLogPosition & { edit: boolean }) {
  const dispatch = useAppDispatch();
  const exercise: exerciseLogData = useAppSelector(
    (state) => state.workoutLogs.editWorkoutLog.exercises[exerciseIndex]
  );
  const set: setLogData = exercise.sets[setIndex];

  function renderVideoCell(): JSX.Element {
    if (!edit && !set.formVideo) {
      return <>-</>;
    } else if (!edit) {
      return (
        <PlayCircle
          size={25}
          color="white"
          onClick={() =>
            dispatch(setCurrentSetVideo({ setIndex, exerciseIndex }))
          }
        />
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
