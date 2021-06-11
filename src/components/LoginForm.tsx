import React, { ChangeEvent, FormEvent, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { GoogleButton } from "./GoogleButton";
import { useAppDispatch, useAppSelector } from "../index";
import { loginUser } from "../slices/usersSlice";
import { SignupModal } from "./SignupModal";
import { VerticalDivider } from "./VerticalDivider";
import { AppleButton } from "./AppleButton";

export function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useAppDispatch();
  const error = useAppSelector((state) => state.user.loginError);

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
      <Container className="shadow w-50 rounded d-flex justify-content-stretch flex-column px-0">
        <div className="bg-info px-3" style={{ fontFamily: "Balsamiq Sans" }}>
          <h5 className="m-1 text-white">Sign in</h5>
        </div>
        {error ? (
          <div className="py-0">
            <Alert className="w-100 my-0" variant="danger">
              {error}
            </Alert>
          </div>
        ) : null}
        <Form className="p-3 bg-light bg-gradient" onSubmit={handleSubmit}>
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
            <Col className="d-flex flex-column justify-content-center">
              <GoogleButton text="Sign in with Google" width={240} />
              <AppleButton width={240} />
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
}
