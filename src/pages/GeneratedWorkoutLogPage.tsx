import * as React from "react";
import { Redirect } from "react-router";
import { useAppDispatch, useAppSelector } from "..";
import { exerciseData, workoutData } from "../slices/workoutsSlice";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { GeneratedWorkoutLogRow } from "../components/GeneratedWorkoutLogRow";
import { Check } from "react-bootstrap-icons";
import {
  addSet,
  clearEditWorkoutLog,
  workoutLogData,
} from "../slices/workoutLogsSlice";
import { renderRestInterval } from "../util/util";

export function GeneratedWorkoutLogPage() {
  const dispatch = useAppDispatch();
  const workout: workoutData | undefined = useAppSelector(
    (state) => state.workouts.nextWorkout
  );
  if (!workout) return <Redirect to="/" />;
  const [positionInWorkout, setPositionInWorkout] = React.useState({
    setIndex: 0,
    exerciseIndex: 0,
  });
  const [setInProgress, setSetInProgress] = React.useState(false);
  const [
    timeElapsedSinceEntryAdded,
    setTimeElapsedSinceEntryAdded,
  ] = React.useState(0);
  const [formData, setFormData] = React.useState({
    repetitions: workout.exercises[0].repetitions,
    restInterval: Date.now(),
  });
  const loggedWorkout: workoutLogData = useAppSelector(
    (state) => state.workoutLogs.editWorkoutLog
  );
  const workoutFinished: boolean =
    positionInWorkout.exerciseIndex >= workout.exercises.length;
  React.useEffect(() => {
    dispatch(clearEditWorkoutLog());
  }, []);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!setInProgress) {
      timer = setTimeout(() => {
        setTimeElapsedSinceEntryAdded(Date.now() - formData.restInterval);
      }, 1000);
    } else {
      setTimeElapsedSinceEntryAdded(formData.restInterval * 1000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [timeElapsedSinceEntryAdded, setInProgress]);

  function handleRepetitionsChange({
    target,
  }: React.ChangeEvent<HTMLInputElement>) {
    const numberValue: number = Number(target.value);
    if (target.value === "") {
      setFormData({ ...formData, repetitions: target.value as any });
    } else if (Number.isInteger(numberValue) && numberValue >= 0) {
      setFormData({ ...formData, repetitions: numberValue });
    }
  }

  function currentSet(
    currentSetIndex: number,
    currentExerciseIndex: number
  ): boolean {
    return (
      positionInWorkout.setIndex === currentSetIndex &&
      positionInWorkout.exerciseIndex === currentExerciseIndex
    );
  }

  function setFinished(
    currentSetIndex: number,
    currentExerciseIndex: number
  ): boolean {
    return (
      (positionInWorkout.exerciseIndex === currentExerciseIndex &&
        positionInWorkout.setIndex > currentSetIndex) ||
      positionInWorkout.exerciseIndex > currentExerciseIndex
    );
  }

  function handleSetClick() {
    if (!workout) return;
    const exercises: exerciseData[] = workout.exercises;
    const { setIndex, exerciseIndex } = positionInWorkout;
    const endOfWorkout: boolean =
      exerciseIndex + 1 >= exercises.length &&
      setIndex + 1 >= exercises[exerciseIndex].sets;
    const endOfExercise: boolean =
      setIndex + 1 >= exercises[exerciseIndex].sets;
    // advance the position only if the set has been finished
    if (setInProgress) {
      const exercise = exercises[exerciseIndex];
      // default repetitions to 0 if blank
      if (formData.repetitions === (("" as unknown) as number))
        formData.repetitions = 0;
      dispatch(
        addSet({
          name: exercise.name,
          repetitions: formData.repetitions as number,
          restInterval: formData.restInterval,
          unit: exercise.unit,
          weight: exercise.weight as number,
        })
      );
      if (endOfWorkout) {
        setPositionInWorkout({
          ...positionInWorkout,
          exerciseIndex: exerciseIndex + 1,
        });
      } else if (endOfExercise) {
        setFormData({
          restInterval: Date.now(),
          repetitions: exercises[exerciseIndex + 1].repetitions,
        });
        setPositionInWorkout({
          setIndex: 0,
          exerciseIndex: exerciseIndex + 1,
        });
      } else {
        setFormData({
          restInterval: Date.now(),
          repetitions: exercises[exerciseIndex].repetitions,
        });
        setPositionInWorkout({
          ...positionInWorkout,
          setIndex: setIndex + 1,
        });
      }
    } else {
      // record time between beginning of this set and end of last set
      setFormData({
        ...formData,
        restInterval: (Date.now() - formData.restInterval) / 1000,
      });
    }
    setSetInProgress(!setInProgress);
  }

  function renderSetButton(
    currentSetIndex: number,
    currentExerciseIndex: number
  ) {
    if (currentSet(currentSetIndex, currentExerciseIndex)) {
      return (
        <Button
          onClick={() => handleSetClick()}
          className="my-0 py-0"
          variant={setInProgress ? "danger" : "success"}
        >
          {setInProgress ? "End" : "Start"}
        </Button>
      );
    } else if (setFinished(currentSetIndex, currentExerciseIndex)) {
      return <Check size={25} className="text-success"></Check>;
    } else {
      return (
        <Button disabled className="my-0 py-0" variant="primary">
          Start
        </Button>
      );
    }
  }

  function renderRepetitionsCell(
    currentSetIndex: number,
    currentExerciseIndex: number
  ) {
    const { exerciseIndex } = positionInWorkout;
    if (currentSet(currentSetIndex, currentExerciseIndex)) {
      return (
        <Form.Control
          className="w-25 my-0 mx-auto text-center"
          name="repetitions"
          value={formData.repetitions}
          onChange={handleRepetitionsChange}
          placeholder="reps"
          type="number"
        />
      );
    } else if (setFinished(currentSetIndex, currentExerciseIndex)) {
      return loggedWorkout.exercises[currentExerciseIndex].sets[currentSetIndex]
        .repetitions;
    } else {
      return workout?.exercises[exerciseIndex].repetitions;
    }
  }

  function renderRestIntervalCell(
    currentSetIndex: number,
    currentExerciseIndex: number
  ) {
    if (currentSet(currentSetIndex, currentExerciseIndex)) {
      return (
        <Form.Control
          readOnly
          value={renderRestInterval(timeElapsedSinceEntryAdded / 1000)}
          className="text-center w-25 mx-auto"
        />
      );
    } else if (setFinished(currentSetIndex, currentExerciseIndex)) {
      const rawRestInterval =
        loggedWorkout.exercises[currentExerciseIndex].sets[currentSetIndex]
          .restInterval;
      return renderRestInterval(rawRestInterval);
    } else {
      return "-";
    }
  }

  return (
    <Container className="mt-5 d-flex flex-column justify-content-start align-items-center">
      <h2 className="my-3">Log today's workout:</h2>
      <Table bordered striped variant="dark" className="text-center">
        <thead>
          <tr>
            <th>Exercise</th>
            <th>Set #</th>
            <th>Weight</th>
            <th>Reps</th>
            <th>Rest Interval (mm:ss)</th>
          </tr>
        </thead>
        <tbody>
          {workout.exercises.map(
            (exercise: exerciseData, exerciseIndex: number) => {
              const result: JSX.Element[] = [];
              for (let setIndex = 0; setIndex < exercise.sets; ++setIndex) {
                result.push(
                  <GeneratedWorkoutLogRow
                    key={setIndex}
                    exercise={exercise}
                    exerciseIndex={exerciseIndex}
                    setIndex={setIndex}
                    setButton={renderSetButton}
                    renderRepetitionsCell={renderRepetitionsCell}
                    renderRestIntervalCell={renderRestIntervalCell}
                  />
                );
              }
              return result;
            }
          )}
        </tbody>
      </Table>
      <Button
        disabled={!workoutFinished}
        variant={workoutFinished ? "success" : "primary"}
      >
        Finish workout
      </Button>
    </Container>
  );
}
