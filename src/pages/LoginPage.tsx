import * as React from "react";
import { Container } from "react-bootstrap";
import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
  return (
    <Container
      fluid
      className="vh-100 d-flex justify-content-left align-items-center"
      style={{
        backgroundColor: "powderblue",
      }}
    >
      <div style={{ fontFamily: "Balsamiq Sans" }} className="ml-5">
        <h1 className="display-2">
          <strong>wLogger</strong>
        </h1>
        <h1 className="display-3" style={{ paddingTop: "50px" }}>
          <strong>Track and log workouts.</strong>
        </h1>
      </div>
      <LoginForm />
    </Container>
  );
}
