import * as React from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { renderRestInterval } from "../util/util";
import { useInterval } from "../util/hooks";
import { EntryData } from "../slices/workoutLogsSlice";

interface WorkoutLogTimerProps {
  setInProgress: boolean;
  formData: EntryData;
  setFormData: React.Dispatch<React.SetStateAction<EntryData>>;
}

export function WorkoutLogTimer({
  setInProgress,
  formData,
  setFormData,
}: WorkoutLogTimerProps) {
  const [timeElapsedSinceEntryAdded, setTimeElapsedSinceEntryAdded] =
    React.useState(0);

  useInterval(
    () => setTimeElapsedSinceEntryAdded(Date.now() - formData.restInterval),
    setInProgress ? undefined : 1000
  );

  function handleResetTimer() {
    if (setInProgress) return;
    setFormData({ ...formData, restInterval: Date.now() });
  }

  return (
    <>
      <Col>
        <Form.Label>Rest Interval</Form.Label>
        <Form.Control
          readOnly
          value={renderRestInterval(timeElapsedSinceEntryAdded / 1000)}
        />
      </Col>
      <Col className="d-flex flex-column justify-content-end align-items-center">
        <Button disabled={setInProgress} onClick={handleResetTimer}>
          Reset timer
        </Button>
      </Col>
    </>
  );
}
