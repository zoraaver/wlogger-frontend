import * as React from "react";
import { Alert, Button, Col, Form, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "..";
import { signupUser } from "../slices/usersSlice";
import { GoogleButton } from "./GoogleButton";
import { HorizontalDivider } from "./HorizontalDivider";

interface SignupModalProps {
  show: boolean;
  handleClose: () => void;
}

export function SignupModal({ handleClose, show }: SignupModalProps) {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  const dispatch = useAppDispatch();
  const errorField = useAppSelector((state) => state.user.signupError?.field);
  const error = useAppSelector((state) => state.user.signupError?.error);
  const successMessage = useAppSelector((state) => state.user.signupSuccess);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    dispatch(signupUser(formData));
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton className="bg-info text-white">
        <Modal.Title style={{ fontFamily: "Balsamiq Sans" }}>
          Sign up to wLogger
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-light">
        <Col>
          <Form
            noValidate
            validated={!!successMessage}
            onSubmit={handleSubmit}
            className="d-flex flex-column align-items-stretch"
          >
            {successMessage ? (
              <Alert variant="success">{successMessage}</Alert>
            ) : null}
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                name="email"
                onChange={handleChange}
                type="email"
                placeholder="email"
                value={formData.email}
              />
              {errorField === "email" ? (
                <div className="text-danger">{error}</div>
              ) : null}
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                onChange={handleChange}
                type="password"
                placeholder="password"
                value={formData.password}
              />
              {errorField === "password" ? (
                <div className="text-danger">{error}</div>
              ) : null}
            </Form.Group>
            <Form.Group controlId="formBasicConfirmPassword">
              <Form.Label>Confirm password</Form.Label>
              <Form.Control
                name="confirmPassword"
                onChange={handleChange}
                type="password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
              />
              {errorField === "confirmPassword" ? (
                <div className="text-danger">{error}</div>
              ) : null}
            </Form.Group>
            <Button className="py-1" variant="success" type="submit">
              Sign up
            </Button>
          </Form>
          <HorizontalDivider text="or" thickness={4} />
          <GoogleButton text="Sign up with Google" />
        </Col>
      </Modal.Body>
    </Modal>
  );
}
