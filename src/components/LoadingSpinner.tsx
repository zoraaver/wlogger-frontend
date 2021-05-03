import * as React from "react";
import Spinner from "react-bootstrap/Spinner";

export function LoadingSpinner() {
  return (
    <Spinner
      animation="border"
      className="position-fixed"
      style={{ top: "50%", left: "50%" }}
    >
      <span className="sr-only">Loading...</span>
    </Spinner>
  );
}
