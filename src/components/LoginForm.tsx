import React, { ChangeEvent, FormEvent, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { GoogleButton } from "./GoogleButton";
import { useAppDispatch } from "../index";
import { loginUser } from "../slices/usersSlice";
import { SignupModal } from "./SignupModal";
import { VerticalDivider } from "./VerticalDivider";

export function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useAppDispatch();

  const [show, setShow] = React.useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    dispatch(loginUser(formData));
  }

  return (
    <>
      <SignupModal handleClose={handleClose} show={show} />
      <Form
        className="shadow w-50 pb-3 rounded bg-light bg-gradient"
        style={{ paddingLeft: "14px", paddingRight: "14px" }}
        onSubmit={handleSubmit}
      >
        <Row
          className="bg-info"
          style={{ fontFamily: "Balsamiq Sans", paddingLeft: "10px" }}
        >
          <h5 className="m-1 text-white">Sign in</h5>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                name="email"
                value={formData.email}
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
                value={formData.password}
                type="password"
                placeholder="password"
              />
            </Form.Group>
            <Button className="py-1" variant="primary" type="submit">
              Login
            </Button>
            <br></br>
            <Button variant="link" onClick={handleShow} className="mt-2">
              Don't have an account? Sign up here
            </Button>
          </Col>
          <VerticalDivider text="or" thickness={4} />
          <Col
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
            }}
          >
            <GoogleButton text="Sign in with Google" width={240} />
          </Col>
        </Row>
      </Form>
    </>
  );
}
