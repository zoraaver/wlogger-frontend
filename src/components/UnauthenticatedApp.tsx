import * as React from "react";
import { Switch, Route } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { NotFoundPage } from "../pages/NotFoundPage";
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
          <NotFoundPage />
        </Route>
      </Switch>
    </>
  );
}
