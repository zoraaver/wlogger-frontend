import * as React from "react";
import * as Bootstrap from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import { useAppDispatch, useAppSelector } from "..";
import { Link } from "react-router-dom";
import { logoutUser } from "../slices/usersSlice";
import { LayoutSidebar } from "react-bootstrap-icons";
import { toggleSidebar } from "../slices/UISlice";

export function Navbar() {
  const dispatch = useAppDispatch();
  const authenticationStatus = useAppSelector(
    (state) => state.user.authenticationStatus
  );
  const authenticated = authenticationStatus === "confirmed";

  function logout() {
    dispatch(logoutUser());
  }

  return (
    <Bootstrap.Navbar bg="info" fixed="top" variant="dark">
      {authenticated ? (
        <Nav.Item
          as="button"
          onClick={() => dispatch(toggleSidebar())}
          className="btn p-2 mr-2"
        >
          <LayoutSidebar />
        </Nav.Item>
      ) : null}
      <Bootstrap.Navbar.Brand style={{ fontFamily: "Balsamiq Sans" }}>
        wLogger
      </Bootstrap.Navbar.Brand>
      <Bootstrap.Navbar.Toggle aria-controls="basic-navbar-nav" />
      {authenticated ? (
        <Nav>
          <Link className="btn nav-link" to="/">
            Home
          </Link>
          <Link to="/logs" className="btn nav-link">
            Logs
          </Link>
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
