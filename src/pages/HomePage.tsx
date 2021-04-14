import * as React from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

export function HomePage() {
  return (
    <Container className="mt-5 d-flex flex-column justify-content-start align-items-center">
      <h1 className="mt-3">Homepage</h1>
      <Button variant="primary" href="/logs/new">
        Log workout
      </Button>
    </Container>
  );
}
