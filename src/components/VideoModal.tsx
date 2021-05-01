import * as React from "react";
import Modal from "react-bootstrap/Modal";
import { useAppDispatch, useAppSelector } from "..";
import { baseURL } from "../config/axios.config";
import {
  exerciseLogData,
  setCurrentSetVideo,
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
    (state) => state.workoutLogs.currentVideoPlaying
  );
  if (!currentSetVideo) return null;

  const { exerciseIndex, setIndex } = currentSetVideo;
  const src = `${baseURL}/workoutLogs/${workoutLog._id}/${exerciseIndex}/${setIndex}/stream`;
  const exercise: exerciseLogData = workoutLog.exercises[exerciseIndex];
  const set: setLogData = exercise.sets[setIndex];
  const title = `${exercise.name}: Set ${setIndex + 1}, ${set.repetitions} x ${
    set.weight
  } ${set.unit}`;

  return (
    <Modal
      show={currentSetVideo}
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
            width="100%"
            src={src}
            preload="metadata"
            controls
            autoPlay
          ></video>
        </>
      </Modal.Body>
    </Modal>
  );
}
