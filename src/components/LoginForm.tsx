import React, { ChangeEvent, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { GoogleButton } from "./GoogleButton";

export function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  return (
    <>
      <Form className="shadow px-3 w-50 pb-3 rounded bg-light bg-gradient">
        <Row className="bg-info border">
          <h6 className="m-1" style={{ fontFamily: "Balsamiq sans" }}>
            Sign in
          </h6>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                onChange={handleChange}
                type="email"
                placeholder="email"
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                onChange={handleChange}
                type="password"
                placeholder="password"
              />
            </Form.Group>
            <Button className="py-1" variant="primary" type="submit">
              Login
            </Button>
          </Col>
          <div style={{ borderLeft: "4px solid lightgrey" }}></div>
          <Col
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
            }}
          >
            <GoogleButton />
          </Col>
        </Row>
      </Form>
    </>
  );
}
