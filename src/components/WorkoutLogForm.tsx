import * as React from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useAppDispatch, useAppSelector } from "..";
import { addSet, EntryData, setLogDate } from "../slices/workoutLogsSlice";
import { weightUnit } from "../slices/workoutPlansSlice";
import { isToday, renderRestInterval } from "../util/util";

export function WorkoutLogForm() {
  const [formData, setFormData] = React.useState<EntryData>({
    name: "",
    repetitions: 0,
    weight: 0,
    restInterval: Date.now(),
    unit: "kg",
  });
  const [error, setError] = React.useState("");
  const [timeElapsedSinceEntryAdded, setTimeElapsedSinceEntryAdded] =
    React.useState(0);
  const [setInProgress, setSetInProgress] = React.useState(false);
  const dispatch = useAppDispatch();
  const logDateString = useAppSelector(
    (state) => state.workoutLogs.editWorkoutLog.createdAt
  );
  const [restIntervalTimer, setRestIntervalTimer] = React.useState(false);

  const maxDate: string = new Date(Date.now()).toISOString().split("T")[0];
  const logDate: string = logDateString || maxDate;

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!setInProgress) {
      timer = setInterval(() => {
        setTimeElapsedSinceEntryAdded(Date.now() - formData.restInterval);
      }, 1000);
    } else {
      setTimeElapsedSinceEntryAdded(formData.restInterval * 1000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [setInProgress, formData.restInterval]);

  function handleChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    const numberValue = Number(target.value);
    if (target.value === "") {
      setFormData({ ...formData, [target.name]: target.value });
      return;
    }
    switch (target.name) {
      case "name":
        setFormData({ ...formData, name: target.value });
        return;
      case "repetitions":
        if (Number.isInteger(numberValue) && numberValue >= 0) {
          setFormData({ ...formData, repetitions: numberValue });
        }
        return;
      case "weight":
        if (!Number.isNaN(numberValue) && numberValue >= 0) {
          setFormData({ ...formData, weight: numberValue });
        }
        return;
      case "unit":
        if (["kg", "lb"].includes(target.value)) {
          setFormData({ ...formData, unit: target.value as weightUnit });
        }
        return;
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!formData.name) {
      setError("Name is a required field");
      return;
    }
    // default weight and repetitions to 0 if none is given
    if (formData.repetitions === ("" as any)) formData.repetitions = 0;
    if (formData.weight === ("" as any)) formData.weight = 0;

    if (setInProgress || !restIntervalTimer) {
      setSetInProgress(false);
      setError("");
      // set restInterval to 0 if timer is not enabled
      const restInterval: number = restIntervalTimer
        ? formData.restInterval
        : 0;
      dispatch(addSet({ ...formData, restInterval }));
      // reset time for new set
      formData.restInterval = Date.now();
    } else {
      setSetInProgress(true);
      // record time between beginning of last set and start of current set
      formData.restInterval = (Date.now() - formData.restInterval) / 1000;
    }
  }

  function renderSetButton() {
    if (restIntervalTimer) {
      return (
        <Button variant={setInProgress ? "danger" : "success"} type="submit">
          {setInProgress ? "End set" : "Begin set"}
        </Button>
      );
    } else {
      return (
        <Button variant="success" type="submit">
          Add set
        </Button>
      );
    }
  }

  function handleRestIntervalTimerChange() {
    if (!isToday(logDate) || setInProgress) return;
    setRestIntervalTimer(!restIntervalTimer);
  }

  function handleDateChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    const newDateIsToday: boolean = isToday(target.value);
    if (!newDateIsToday && restIntervalTimer) {
      setRestIntervalTimer(!restIntervalTimer);
    }
    if (newDateIsToday) {
      dispatch(setLogDate(undefined));
    } else {
      dispatch(setLogDate(target.value));
    }
  }

  function handleResetTimer() {
    if (setInProgress) return;
    setFormData({ ...formData, restInterval: Date.now() });
  }

  return (
    <Form onSubmit={handleSubmit} className="w-75 mt-3">
      <Form.Row className="mb-5">
        <Form.Label column sm="2" className="mr-0">
          Log date:
        </Form.Label>
        <Col sm="3" className="mr-3">
          <Form.Control
            type="date"
            max={maxDate}
            value={logDate}
            onChange={handleDateChange}
            readOnly={setInProgress}
          />
        </Col>
        <Col sm="4" className="d-flex align-items-center">
          <Form.Check
            label="Rest interval timer"
            checked={restIntervalTimer}
            disabled={!isToday(logDate) || setInProgress}
            onChange={handleRestIntervalTimerChange}
          />
        </Col>
      </Form.Row>
      <Form.Row>
        <Col>
          <Form.Label>Exercise</Form.Label>
          <Form.Control
            name="name"
            value={formData.name}
            onChange={handleChange}
            type="text"
            placeholder="exercise name"
          />
        </Col>
        <Col>
          <Form.Label>Reps</Form.Label>
          <Form.Control
            name="repetitions"
            value={formData.repetitions}
            onChange={handleChange}
            type="number"
            placeholder="repetitions"
          />
        </Col>
        <Col>
          <Form.Label>Weight</Form.Label>
          <Form.Control
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            type="number"
            placeholder="weight"
          />
        </Col>
        <Col>
          <Form.Label>Unit</Form.Label>
          <Form.Control
            as="select"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
          >
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </Form.Control>
        </Col>
        {restIntervalTimer ? (
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
        ) : null}
        <Col
          className="d-flex flex-column justify-content-end align-items-center"
          lg={50}
        >
          {renderSetButton()}
        </Col>
      </Form.Row>
      {error ? (
        <Form.Row>
          <Col>
            <div className="text-danger">{error}</div>
          </Col>
          <Col></Col>
          <Col></Col>
          <Col></Col>
        </Form.Row>
      ) : null}
    </Form>
  );
}
