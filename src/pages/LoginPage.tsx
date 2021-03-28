import * as React from "react";
import { ChangeEvent, useState } from "react";
import { Button, Container, Form } from "semantic-ui-react";

export function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  return (
    <Container>
      <Form>
        <Form.Field>
          <label>email</label>
          <input
            type="email"
            name="email"
            placeholder="email"
            onChange={handleChange}
          />
        </Form.Field>
        <Form.Field>
          <label>password</label>
          <input
            type="password"
            name="password"
            placeholder="password"
            onChange={handleChange}
          />
        </Form.Field>
        <Button type="submit">Submit</Button>
      </Form>
    </Container>
  );
}
