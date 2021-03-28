import * as React from "react";
import { ChangeEvent, useState } from "react";
import { Button, Form, Col, Row, Container } from "react-bootstrap";
import { GoogleButton } from "../components/GoogleButton";

export function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  return (
    <Container
      fluid
      className="vh-100"
      style={{
        backgroundColor: "powderblue",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
      }}
    >
      <h1
        className="display-3"
        style={{ fontFamily: "Monaco", paddingTop: "50px" }}
      >
        <strong>Track and log workouts</strong>
      </h1>
      <Form className="shadow p-4 mt-5 w-50 rounded bg-light bg-gradient">
        <Row>
          <Col>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                onChange={handleChange}
                type="email"
                placeholder="Enter email"
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                onChange={handleChange}
                type="password"
                placeholder="Password"
              />
            </Form.Group>
            <Button className="py-1" variant="primary" type="submit">
              Login
            </Button>
          </Col>
          <div style={{ borderLeft: "4px solid lightgrey" }}></div>
          <Col style={{ display: "flex", alignItems: "center" }}>
            <GoogleButton />
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
