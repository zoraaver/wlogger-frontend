import { useRef, useEffect } from "react";

export function useInterval(
  callback: () => void,
  delayInMilliSeconds?: number
) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delayInMilliSeconds !== undefined) {
      function tick() {
        savedCallback.current();
      }
      const intervalId = setInterval(tick, delayInMilliSeconds);
      return () => clearInterval(intervalId);
    }
  }, [delayInMilliSeconds]);
}
