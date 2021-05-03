import * as React from "react";
import Modal from "react-bootstrap/Modal";
import { useAppDispatch, useAppSelector } from "..";
import { baseURL } from "../config/axios.config";
import { setCurrentSetVideo } from "../slices/UISlice";
import {
  exerciseLogData,
  setLogData,
  workoutLogData,
  WorkoutLogPosition,
} from "../slices/workoutLogsSlice";

export function VideoModal() {
  const dispatch = useAppDispatch();
  const workoutLog = useAppSelector(
    (state) => state.workoutLogs.editWorkoutLog
  ) as workoutLogData;
  const currentSetVideo: WorkoutLogPosition | undefined = useAppSelector(
    (state) => state.UI.currentVideoPlaying
  );
  if (!currentSetVideo) return null;

  const { exerciseIndex, setIndex } = currentSetVideo;
  const exercise: exerciseLogData = workoutLog.exercises[exerciseIndex];
  const set: setLogData = exercise.sets[setIndex];
  const src = `${baseURL}/workoutLogs/${workoutLog._id}/exercises/${exercise._id}/sets/${set._id}/video`;
  const title = `${exercise.name}: Set ${setIndex + 1}, ${set.repetitions} x ${
    set.weight
  } ${set.unit}`;

  return (
    <Modal
      show={!!currentSetVideo}
      size="lg"
      onHide={() => dispatch(setCurrentSetVideo(undefined))}
      className="pb-0"
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <>
          <video
            className="my-0"
            width="100%"
            src={src}
            controls
            preload="metadata"
          ></video>
        </>
      </Modal.Body>
    </Modal>
  );
}
