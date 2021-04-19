import {
  weekData,
  workoutPlanData,
  workoutPlanHeaderData,
} from "../slices/workoutPlansSlice";

export function renderRestInterval(seconds?: number) {
  if (seconds === undefined) return "-";
  seconds = Math.round(seconds);
  const minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  const minutesString: string =
    minutes < 10 ? "0" + minutes : minutes.toString();
  const secondsString: string =
    seconds < 10 ? "0" + seconds : seconds.toString();
  return minutesString + ":" + secondsString;
}

export function calculateLength(
  workoutPlanData: workoutPlanData | workoutPlanHeaderData
): number {
  return workoutPlanData.weeks.reduce(
    (acc: number, curr: weekData | { repeat: number }) => {
      return acc + curr.repeat + 1;
    },
    0
  );
}
