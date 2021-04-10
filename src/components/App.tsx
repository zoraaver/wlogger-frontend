import * as React from "react";
import { useAppSelector, useAppDispatch } from "..";
import { validateUser } from "../slices/usersSlice";
import { AuthenticatedApp } from "./AuthenticatedApp";
import { LoadingSpinner } from "./LoadingSpinner";
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
      return <LoadingSpinner />;
    case "confirmed":
      return <AuthenticatedApp />;
    case "unknown":
      return <UnauthenticatedApp />;
  }
}
