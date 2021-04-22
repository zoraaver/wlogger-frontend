import * as React from "react";
import { Redirect } from "react-router";
import { useAppSelector } from "..";
import { exerciseData, workoutData } from "../slices/workoutsSlice";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { GeneratedWorkoutLogRow } from "../components/GeneratedWorkoutLogRow";

export function GeneratedWorkoutLogPage() {
  const workout: workoutData | undefined = useAppSelector(
    (state) => state.workouts.nextWorkout
  );
  if (!workout) return <Redirect to="/" />;

  const [positionInWorkout, setPositionInWorkout] = React.useState({
    setIndex: 0,
    exerciseIndex: 0,
  });
  const [setInProgress, setSetInProgress] = React.useState(false);
  const workoutFinished: boolean =
    positionInWorkout.exerciseIndex < 0 && positionInWorkout.setIndex < 0;

  function handleSetClick() {
    if (!workout) return;
    const exercises: exerciseData[] = workout.exercises;
    const { setIndex, exerciseIndex } = positionInWorkout;
    // advance the position only if the set has been finished
    if (setInProgress) {
      if (
        // reached the end of the workout
        exerciseIndex + 1 >= exercises.length &&
        setIndex + 1 >= exercises[exerciseIndex].sets
      ) {
        setPositionInWorkout({ setIndex: -1, exerciseIndex: -1 });
      } else if (
        // reached the end of current exercise sets
        setIndex + 1 >=
        exercises[exerciseIndex].sets
      ) {
        setPositionInWorkout({
          setIndex: 0,
          exerciseIndex: positionInWorkout.exerciseIndex + 1,
        });
      } else {
        setPositionInWorkout({
          ...positionInWorkout,
          setIndex: setIndex + 1,
        });
      }
    }
    setSetInProgress(!setInProgress);
  }

  function renderSetButton(setIndex: number, exerciseIndex: number) {
    if (
      positionInWorkout.setIndex === setIndex &&
      positionInWorkout.exerciseIndex === exerciseIndex
    ) {
      return (
        <Button onClick={() => handleSetClick()} className="my-0 py-1">
          {setInProgress ? "End" : "Start"}
        </Button>
      );
    } else {
      return (
        <Button disabled className="my-0 py-1">
          Start
        </Button>
      );
    }
  }

  return (
    <Container className="mt-5 d-flex flex-column justify-content-start align-items-center">
      <h2 className="mt-3">Today's workout:</h2>
      <Table bordered striped>
        <thead>
          <tr>
            <th>Exercise name</th>
            <th>Set #</th>
            <th>Weight</th>
            <th>Reps</th>
            <th>Rest Interval</th>
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
                  />
                );
              }
              return result;
            }
          )}
        </tbody>
      </Table>
      <Button disabled={!workoutFinished}>Finish workout</Button>
    </Container>
  );
}
