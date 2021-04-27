import * as React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { VerifyPage } from "../pages/VerifyPage";
import { Navbar } from "../containers/NavBar";

export function UnauthenticatedApp() {
  return (
    <>
      <Navbar />
      <Switch>
        <Route exact path="/login">
          <LoginPage />
        </Route>
        <Route exact path="/verify/:verificationToken">
          <VerifyPage />
        </Route>
        <Route path="*">
          <Redirect to="/login" />
        </Route>
      </Switch>
    </>
  );
}
