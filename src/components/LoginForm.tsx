import React, { ChangeEvent, FormEvent, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { GoogleButton } from "./GoogleButton";
import { useAppDispatch } from "../index";
import { loginUser } from "../slices/usersSlice";

export function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    dispatch(loginUser(formData));
  }

  const dispatch = useAppDispatch();

  return (
    <>
      <Form
        className="shadow px-3 w-50 pb-3 rounded bg-light bg-gradient"
        onSubmit={handleSubmit}
      >
        <Row className="bg-info border">
          <h6 className="m-1 " style={{ fontFamily: "Balsamiq sans" }}>
            Sign in
          </h6>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                name="email"
                onChange={handleChange}
                type="email"
                placeholder="email"
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
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
