import * as React from "react";
import { Paperclip } from "react-bootstrap-icons";
import Form from "react-bootstrap/Form";
import { useAppDispatch } from "..";
import { addFormVideo, WorkoutLogPosition } from "../slices/workoutLogsSlice";

export function LogVideoFileInput({
  setIndex,
  exerciseIndex,
}: WorkoutLogPosition): JSX.Element {
  const dispatch = useAppDispatch();

  function handleFileChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    if (target.files && target.files[0]) {
      dispatch(
        addFormVideo({ exerciseIndex, setIndex, file: target.files[0] })
      );
    }
  }

  return (
    <Form.Label className="btn py-0 my-0 text-light" htmlFor="formVideo">
      <Form.File.Input
        style={{ display: "none" }}
        accept="video/quicktime,video/mp4,video/x-msvideo"
        id="formVideo"
        onChange={handleFileChange}
      />
      <Paperclip />
    </Form.Label>
  );
}
