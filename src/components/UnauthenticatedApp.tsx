import * as React from "react";
import { Switch, Route } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { Navbar } from "./NavBar";

export function UnauthenticatedApp() {
  return (
    <>
      <Navbar />
      <Switch>
        <Route exact path="/login">
          <LoginPage />
        </Route>
      </Switch>
    </>
  );
}
