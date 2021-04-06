import * as React from "react";
import { Navbar } from "./NavBar";
import { Redirect, Route, Switch } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { Sidebar } from "./Sidebar/Sidebar";
import { NewWorkoutPlanPage } from "../pages/NewWorkoutPlanPage";
import { EditWorkoutPlanPage } from "../pages/EditWorkoutPlanPage";
import { EditWeekPage } from "../pages/EditWeekPage";

export function AuthenticatedApp() {
  return (
    <>
      <Navbar />
      <Sidebar />
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route exact path="/login">
          <Redirect to="/" />
        </Route>
        <Route exact path="/plans/new/weeks/:position">
          <EditWeekPage />
        </Route>
        <Route exact path="/plans/new/weeks">
          <EditWorkoutPlanPage />
        </Route>
        <Route exact path="/plans/new">
          <NewWorkoutPlanPage />
        </Route>
        <Route path="*">
          <NotFoundPage />
        </Route>
      </Switch>
    </>
  );
}
