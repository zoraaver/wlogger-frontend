import * as React from "react";
import * as Bootstrap from "react-bootstrap";
import { Nav } from "react-bootstrap";

export function Navbar() {
  return (
    <Bootstrap.Navbar bg="info" fixed="top" variant="dark">
      <Bootstrap.Navbar.Brand href="#home">wLogger</Bootstrap.Navbar.Brand>
      <Bootstrap.Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Nav>
        <Nav.Link href="/">Home</Nav.Link>
        <Nav.Link href="/logs">Logs</Nav.Link>
      </Nav>
      <Nav className="ml-auto">
        <Nav.Link href="/logout">Logout</Nav.Link>
      </Nav>
    </Bootstrap.Navbar>
  );
}
