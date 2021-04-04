import * as React from "react";
import * as Bootstrap from "react-bootstrap";
import { Nav } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "..";
import { useHistory } from "react-router-dom";
import { logoutUser } from "../slices/usersSlice";

export function Navbar() {
  const dispatch = useAppDispatch();
  const authenticationStatus = useAppSelector(
    (state) => state.user.authenticationStatus
  );
  const authenticated = authenticationStatus === "confirmed";
  const history = useHistory();

  function logout() {
    localStorage.clear();
    dispatch(logoutUser());
    history.push("/login");
  }

  return (
    <Bootstrap.Navbar bg="info" fixed="top" variant="dark">
      <Bootstrap.Navbar.Brand
        href="#home"
        style={{ fontFamily: "Balsamiq Sans" }}
      >
        wLogger
      </Bootstrap.Navbar.Brand>
      <Bootstrap.Navbar.Toggle aria-controls="basic-navbar-nav" />
      {authenticated ? (
        <Nav>
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/logs">Logs</Nav.Link>
        </Nav>
      ) : null}
      {authenticated ? (
        <Nav className="ml-auto">
          <Nav.Link onClick={logout} as="button" className="btn">
            Logout
          </Nav.Link>
        </Nav>
      ) : null}
    </Bootstrap.Navbar>
  );
}
