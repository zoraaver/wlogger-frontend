import * as React from "react";
import Container from "react-bootstrap/Container";

interface TimerProps {
  title?: string;
}

export function Timer({ title }: TimerProps) {
  const [count, setCount] = React.useState(0);

  const hours: number = Math.floor(count / 3600);
  const minutes: number = Math.floor((count % 3600) / 60);
  const seconds: number = count % 60;

  function displayTime(): string {
    let time: string = "";
    time += hours < 10 ? "0" + hours : hours;
    time += ":";
    time += minutes < 10 ? "0" + minutes : minutes;
    time += ":";
    time += seconds < 10 ? "0" + seconds : seconds;
    return time;
  }

  const interval: NodeJS.Timeout = setInterval(() => {
    setCount(count + 1);
  }, 1000);

  React.useEffect(() => () => {
    clearInterval(interval);
  });

  return (
    <Container className="mx-auto text-dark bg-light d-flex justify-content-center align-items-center w-25">
      <h5 className="my-1 text-center">
        {title ? title + ":" : null} {displayTime()}
      </h5>
    </Container>
  );
}
