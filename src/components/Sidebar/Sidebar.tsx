import * as React from "react";
import { useAppSelector } from "../..";
import Nav from "react-bootstrap/Nav";
import "./Sidebar.css";
import { useHistory } from "react-router";

export function Sidebar() {
  const sidebarOpen: boolean = useAppSelector((state) => state.UI.sidebarOpen);
  const closed = { display: "none" };
  const history = useHistory();
  return (
    <div className="sidenav" style={sidebarOpen ? {} : closed}>
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
  );
}
