import * as React from "react";
import Container from "react-bootstrap/Container";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "..";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { WorkoutLogTable } from "../containers/WorkoutLogTable";
import { getWorkoutLog, workoutLogData } from "../slices/workoutLogsSlice";
import { ArrowLeft } from "react-bootstrap-icons";
import { VideoModal } from "../components/VideoModal";
import { Link } from "react-router-dom";

export function WorkoutLogPage() {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const workoutLog: workoutLogData | undefined = useAppSelector(
    (state) => state.workoutLogs.editWorkoutLog
  );

  React.useEffect(() => {
    if (workoutLog._id !== id) dispatch(getWorkoutLog(id));
  }, []);

  if (!workoutLog?.createdAt || workoutLog._id !== id)
    return <LoadingSpinner />;

  const workoutLogDate: Date = new Date(workoutLog.createdAt);

  return (
    <Container className="mt-5 d-flex flex-column justify-content-start align-items-center">
      <h3 className="mt-3">{workoutLogDate.toDateString()}</h3>
      <Link to="/logs" className="mr-auto">
        <ArrowLeft className="mr-1" />
        Back to Logs
      </Link>
      <WorkoutLogTable edit={false} />
      {workoutLog.notes ? (
        <Container className="w-75">
          <b>Notes</b>:{" "}
          <p style={{ wordBreak: "break-word" }}>{workoutLog.notes}</p>
        </Container>
      ) : null}
      <VideoModal />
    </Container>
  );
}
