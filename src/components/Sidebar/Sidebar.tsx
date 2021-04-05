import * as React from "react";
import { Nav } from "react-bootstrap";
import "./Sidebar.css";

export function Sidebar() {
  return (
    <div className="sidenav">
      <Nav.Link href="/plans/new">Create a new plan</Nav.Link>
      <Nav.Link href="/plans">Manage my plans</Nav.Link>
      <Nav.Link href="/statistics">Statistics</Nav.Link>
      <Nav.Link href="/exercises">Exercises</Nav.Link>
    </div>
  );
}
