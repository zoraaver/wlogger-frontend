import * as React from "react";
import { ExerciseForm } from "../components/ExerciseForm";
import Container from "react-bootstrap/Container";
import { useAppDispatch, useAppSelector } from "..";
import { exerciseData, getExercises } from "../slices/exercisesSlice";
import { ExerciseItem } from "../components/ExerciseItem";

export function ExercisesPage() {
  const dispatch = useAppDispatch();

  const exercises: exerciseData[] = useAppSelector(
    (state) => state.exercises.data
  );

  React.useEffect(() => {
    dispatch(getExercises());
  }, []);

  return (
    <Container className="d-flex flex-column mt-5 align-items-center">
      <h2 className="mt-3">Exercises</h2>
      <ExerciseForm />
      {exercises.map((exercise) => (
        <ExerciseItem exercise={exercise} key={exercise.name} />
      ))}
    </Container>
  );
}
