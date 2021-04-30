import * as React from "react";
import { useAppSelector } from "..";
import {
  exerciseLogData,
  setLogData,
  WorkoutLogPosition,
} from "../slices/workoutLogsSlice";
import { renderRestInterval } from "../util/util";
import { LogVideoFileInput } from "./LogVideoFileInput";
import { RemoveVideoFileInput } from "./RemoveVideoFileInput";
// import { Video } from "react-video-stream";
// import { baseURL } from "../config/axios.config";

export function WorkoutLogRow({
  setIndex,
  exerciseIndex,
  edit,
}: WorkoutLogPosition & { edit: boolean }) {
  const exercise: exerciseLogData = useAppSelector(
    (state) => state.workoutLogs.editWorkoutLog.exercises[exerciseIndex]
  );
  //   const workoutLogId = useAppSelector(
  //     (state) => state.workoutLogs.editWorkoutLog._id
  //   ) as string;
  const set: setLogData = exercise.sets[setIndex];

  function renderVideoCell(): JSX.Element {
    if (!edit && !set.formVideoSize) {
      return <>-</>;
    } else if (!edit) {
      return (
        <>
          {/* <Video
            controls={true}
            autoPlay={false}
            options={{
              requestHeader: "Authorization",
              requestToken: token,
            }}
            remoteUrl={`${baseURL}/workoutLogs/${workoutLogId}/${exerciseIndex}/${setIndex}/videoDownload`}
          /> */}
        </>
      );
    } else if (set.formVideo) {
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
