import * as React from "react";
import { Spinner } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "..";
import { validateUser } from "../slices/usersSlice";
import { AuthenticatedApp } from "./AuthenticatedApp";
import { UnauthenticatedApp } from "./UnauthenticatedApp";

export function App() {
  const authenticationStatus = useAppSelector(
    (state) => state.user.authenticationStatus
  );
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (localStorage.token) dispatch(validateUser());
  }, []);

  switch (authenticationStatus) {
    case "pending":
      return (
        <Spinner
          animation="border"
          style={{ position: "fixed", top: "50%", left: "50%" }}
        >
          <span className="sr-only">Loading...</span>
        </Spinner>
      );
    case "confirmed":
      return <AuthenticatedApp />;
    case "unknown":
      return <UnauthenticatedApp />;
  }
}
