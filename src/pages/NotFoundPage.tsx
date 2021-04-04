import * as React from "react";
import { Container } from "react-bootstrap";

export function NotFoundPage() {
  return (
    <Container
      fluid
      className="vh-100 d-flex justify-content-center align-items-center"
    >
      <h2>Sorry, we couldn't find that page.</h2>
    </Container>
  );
}
