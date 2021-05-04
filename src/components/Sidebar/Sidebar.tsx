import * as React from "react";
import { useAppSelector } from "../..";
import "./Sidebar.css";
import Fade from "react-bootstrap/Fade";
import { Link } from "react-router-dom";

export function Sidebar() {
  const sidebarOpen: boolean = useAppSelector((state) => state.UI.sidebarOpen);
  return (
    <Fade in={sidebarOpen} unmountOnExit={true}>
      <div className="sidenav">
        <Link className="btn nav-link" to="/plans/new">
          Create a new plan
        </Link>
        <Link className="btn nav-link" to="/plans">
          Manage my plans
        </Link>
        <Link className="btn nav-link" to="/statistics">
          Statistics
        </Link>
        <Link className="btn nav-link" to="/exercises">
          Exercises
        </Link>
      </div>
    </Fade>
  );
}
