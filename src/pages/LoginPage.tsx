import * as React from "react";
import { ChangeEvent, useState } from "react";
import { Button, Container, Form, Col, Row } from "react-bootstrap";
import { GoogleButton } from "../components/GoogleButton";

export function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  return (
    <>
      <Container
        className="shadow-sm p-3 mb-5 bg-white rounded"
        style={{ width: "55%" }}
      >
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
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Col>
          <div style={{ borderLeft: "4px solid lightgrey" }}></div>
          <Col style={{ display: "flex", alignItems: "center" }}>
            <GoogleButton />
          </Col>
        </Row>
      </Container>
    </>
  );
}
