import * as React from "react";
import { useAppSelector } from "../..";
import Nav from "react-bootstrap/Nav";
import "./Sidebar.css";
import { useHistory } from "react-router";
import Fade from "react-bootstrap/Fade";

export function Sidebar() {
  const sidebarOpen: boolean = useAppSelector((state) => state.UI.sidebarOpen);
  const history = useHistory();
  return (
    <Fade in={sidebarOpen}>
      <div className="sidenav">
        <Nav.Link
          as="button"
          className="btn"
          onClick={() => history.push("/plans/new")}
        >
          Create a new plan
        </Nav.Link>
        <Nav.Link
          as="button"
          className="btn"
          onClick={() => history.push("/plans")}
        >
          Manage my plans
        </Nav.Link>
        <Nav.Link
          as="button"
          className="btn"
          onClick={() => history.push("/statistics")}
        >
          Statistics
        </Nav.Link>
        <Nav.Link
          as="button"
          className="btn"
          onClick={() => history.push("/exercises")}
        >
          Exercises
        </Nav.Link>
      </div>
    </Fade>
  );
}
