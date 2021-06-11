import * as React from "react";
import { Container, Image } from "react-bootstrap";
import { backendUrl } from "../config/axios.config";
import AppleLogin from "react-apple-login";

// @ts-ignore
import AppleLogo from "../assets/apple_logo.png";
import { AppDispatch, useAppDispatch } from "..";
import { OAuthLoginUser } from "../slices/usersSlice";

const APPLE_CLIENT_ID = "uk.wlogger";
const redirectURI = backendUrl;

interface AppleResponse {
  authorization?: {
    state: string;
    code: string;
    id_token?: string;
  };
  user: {
    email: string;
    name: {
      firstName: string;
      lastName: string;
    };
  };
}

interface AppleButtonProps {
  width?: number;
}

function handleAppleResponse(response: AppleResponse, dispatch: AppDispatch) {
  if (response.authorization?.id_token) {
    dispatch(
      OAuthLoginUser({
        idToken: response.authorization.id_token,
        OAuthProvider: "apple",
      })
    );
  } else {
    console.log(response);
  }
}

export function AppleButton({ width }: AppleButtonProps) {
  const dispatch = useAppDispatch();

  return (
    <AppleLogin
      clientId={APPLE_CLIENT_ID}
      redirectURI={redirectURI}
      scope="email"
      usePopup
      responseType="id_token"
      responseMode="form_post"
      callback={(response) => handleAppleResponse(response, dispatch)}
      render={(renderProps) => (
        <Container
          as="button"
          className="btn"
          style={{
            width,
            height: 40,
            backgroundColor: "black",
            color: "white",
            marginTop: 10,
          }}
          onClick={renderProps.onClick}
          disabled={renderProps.disabled}
        >
          <Image
            src={AppleLogo}
            rounded
            style={{
              height: 30,
              width: 30,
              marginRight: 12,
            }}
          />
          Sign in with Apple
        </Container>
      )}
    />
  );
}
