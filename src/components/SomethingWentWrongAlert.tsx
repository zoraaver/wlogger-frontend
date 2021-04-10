import * as React from "react";
import Alert from "react-bootstrap/Alert";

export function SomethingWentWrongAlert() {
  return (
    <Alert variant="danger" className="mr-auto ml-auto mt-5 w-50 text-center">
      Oops, something went wrong
    </Alert>
  );
}
