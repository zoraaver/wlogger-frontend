import * as React from "react";
import { Container } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { useAppDispatch } from "..";
import { verifyUser } from "../slices/usersSlice";

interface verifyPageParams {
  verificationToken: string;
}

export function VerifyPage() {
  const { verificationToken } = useParams<verifyPageParams>();
  const dispatch = useAppDispatch();
  const history = useHistory();

  React.useEffect(() => {
    dispatch(verifyUser(verificationToken)).then(() => history.push("/"));
  }, []);

  return (
    <Container
      fluid
      className="vh-100 d-flex align-items-center justify-content-center"
    >
      <h2>Verifying email address...</h2>
    </Container>
  );
}
