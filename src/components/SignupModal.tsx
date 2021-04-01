import * as React from "react";
import { Button, Col, Form, Modal } from "react-bootstrap";
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

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    console.log(formData);
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
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
            }}
          >
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                name="email"
                onChange={handleChange}
                type="email"
                placeholder="email"
                value={formData.email}
              />
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
