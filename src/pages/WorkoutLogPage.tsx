import * as React from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { useHistory, useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "..";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { WorkoutLogTable } from "../containers/WorkoutLogTable";
import { getWorkoutLog, workoutLogData } from "../slices/workoutLogsSlice";
import { ArrowLeft } from "react-bootstrap-icons";

export function WorkoutLogPage() {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const workoutLog: workoutLogData | undefined = useAppSelector(
    (state) => state.workoutLogs.editWorkoutLog
  );
  const history = useHistory();

  React.useEffect(() => {
    if (workoutLog._id !== id) dispatch(getWorkoutLog(id));
  }, []);

  if (!workoutLog?.createdAt || workoutLog._id !== id)
    return <LoadingSpinner />;

  const workoutLogDate: Date = new Date(workoutLog.createdAt);

  return (
    <Container className="mt-5 d-flex flex-column justify-content-start align-items-center">
      <h3 className="mt-3">{workoutLogDate.toDateString()}</h3>
      <Button
        variant="link"
        onClick={() => history.push("/logs")}
        className="mr-auto"
      >
        <ArrowLeft className="mr-1" />
        Back to Logs
      </Button>
      <WorkoutLogTable />
    </Container>
  );
}
