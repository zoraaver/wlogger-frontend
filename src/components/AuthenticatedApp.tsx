import * as React from "react";
import { Navbar } from "./NavBar";
import { Route, Switch } from "react-router-dom";
import { HomePage } from "../pages/HomePage";

export function AuthenticatedApp() {
  return (
    <>
      <Navbar />
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
      </Switch>
    </>
  );
}
