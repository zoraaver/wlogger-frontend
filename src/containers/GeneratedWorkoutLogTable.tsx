import * as React from "react";
import { Button, Form } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { useAppDispatch, useAppSelector } from "..";
import { GeneratedWorkoutLogRow } from "../components/GeneratedWorkoutLogRow";
import { LogVideoFileInput } from "../components/LogVideoFileInput";
import { RemoveVideoFileInput } from "../components/RemoveVideoFileInput";
import { addSet, setLogData, workoutLogData } from "../slices/workoutLogsSlice";
import { workoutExerciseData, workoutData } from "../slices/workoutsSlice";
import { renderRestInterval } from "../util/util";

interface WorkoutPosition {
  setIndex: number;
  exerciseIndex: number;
}

interface GeneratedWorkoutLogTableProps {
  positionInWorkout: WorkoutPosition;
  setPositionInWorkout: React.Dispatch<React.SetStateAction<WorkoutPosition>>;
}

export function GeneratedWorkoutLogTable({
  positionInWorkout,
  setPositionInWorkout,
}: GeneratedWorkoutLogTableProps) {
  const dispatch = useAppDispatch();
  const [setInProgress, setSetInProgress] = React.useState(false);
  const { setIndex, exerciseIndex } = positionInWorkout;

  const loggedWorkout: workoutLogData = useAppSelector(
    (state) => state.workoutLogs.editWorkoutLog
  );

  const workout: workoutData = useAppSelector(
    (state) => state.workouts.nextWorkout
  ) as workoutData;

  const [formData, setFormData] = React.useState({
    repetitions: workout.exercises[0].repetitions,
    restInterval: Date.now(),
  });

  const [timeElapsedSinceEntryAdded, setTimeElapsedSinceEntryAdded] =
    React.useState(0);

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

  const workoutFinished: boolean =
    exerciseIndex + 1 >= workout.exercises.length &&
    setIndex + 1 >= workout.exercises[workout.exercises.length - 1].sets;

  const exerciseFinished: boolean =
    workoutFinished || setIndex + 1 >= workout.exercises[exerciseIndex].sets;

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
      setIndex === currentSetIndex && exerciseIndex === currentExerciseIndex
    );
  }

  function setFinished(
    currentSetIndex: number,
    currentExerciseIndex: number
  ): boolean {
    return (
      (exerciseIndex === currentExerciseIndex && setIndex > currentSetIndex) ||
      exerciseIndex > currentExerciseIndex
    );
  }

  function handleSetClick() {
    if (!workout) return;
    // advance the position only if the set has been finished
    if (setInProgress) {
      logSet();
    } else {
      // record time between beginning of this set and end of last set
      setFormData({
        ...formData,
        restInterval: (Date.now() - formData.restInterval) / 1000,
      });
    }
    setSetInProgress(!setInProgress);
  }

  function logSet() {
    const exercise = workout.exercises[exerciseIndex];
    // default repetitions to 0 if blank
    if (formData.repetitions === ("" as unknown as number))
      formData.repetitions = 0;
    dispatch(
      addSet({
        name: exercise.name,
        repetitions: formData.repetitions as number,
        restInterval: formData.restInterval,
        unit: exercise.unit,
        weight: exercise.weight as number,
        exerciseId: exercise._id,
      })
    );
    if (workoutFinished) {
      setPositionInWorkout({
        ...positionInWorkout,
        exerciseIndex: exerciseIndex + 1,
      });
    } else if (exerciseFinished) {
      setFormData({
        restInterval: Date.now(),
        repetitions: workout.exercises[exerciseIndex + 1].repetitions,
      });
      setPositionInWorkout({
        setIndex: 0,
        exerciseIndex: exerciseIndex + 1,
      });
    } else {
      setFormData({
        restInterval: Date.now(),
        repetitions: workout.exercises[exerciseIndex].repetitions,
      });
      setPositionInWorkout({
        ...positionInWorkout,
        setIndex: setIndex + 1,
      });
    }
  }

  function renderSetButton(
    currentSetIndex: number,
    currentExerciseIndex: number
  ) {
    if (currentSet(currentSetIndex, currentExerciseIndex)) {
      return (
        <Button
          onClick={() => handleSetClick()}
          className="my-0 py-1"
          variant={setInProgress ? "danger" : "success"}
        >
          {setInProgress ? "End" : "Start"}
        </Button>
      );
    } else if (setFinished(currentSetIndex, currentExerciseIndex)) {
      const set: setLogData =
        loggedWorkout.exercises[currentExerciseIndex].sets[currentSetIndex];
      if (set.formVideoName) {
        return (
          <RemoveVideoFileInput
            setIndex={currentSetIndex}
            exerciseIndex={currentExerciseIndex}
          />
        );
      } else {
        return (
          <LogVideoFileInput
            setIndex={currentSetIndex}
            exerciseIndex={currentExerciseIndex}
          />
        );
      }
    } else {
      return (
        <Button disabled className="my-0 py-1" variant="primary">
          Start
        </Button>
      );
    }
  }

  function renderRepetitionsCell(
    currentSetIndex: number,
    currentExerciseIndex: number
  ) {
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
      return workout?.exercises[currentExerciseIndex].repetitions;
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
    <Table bordered striped variant="dark" className="text-center">
      <thead>
        <tr>
          <th>Exercise</th>
          <th>Set #</th>
          <th>Weight</th>
          <th>Reps</th>
          <th>Rest Interval (mm : ss)</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {workout.exercises.map(
          (exercise: workoutExerciseData, exerciseIndex: number) => {
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
  );
}
