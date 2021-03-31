import React, { ChangeEvent, FormEvent, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { GoogleButton } from "./GoogleButton";
import { useAppDispatch } from "../index";
import { loginUser } from "../slices/usersSlice";

export function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useAppDispatch();

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    dispatch(loginUser(formData));
  }

  return (
    <>
      <Form
        className="shadow w-50 pb-3 rounded bg-light bg-gradient"
        style={{ paddingLeft: "14px", paddingRight: "14px" }}
        onSubmit={handleSubmit}
      >
        <Row
          className="bg-info"
          style={{ fontFamily: "Balsamiq Sans", paddingLeft: "10px" }}
        >
          <h6 className="m-1 text-white">Sign in</h6>
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
          <div
            style={{ borderLeft: "4px solid lightgrey", marginTop: "10px" }}
          ></div>
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
