import * as React from "react";
import { Container, Image } from "react-bootstrap";
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import { useAppDispatch } from "..";
import { OAuthLoginUser } from "../slices/usersSlice";

// @ts-ignore
import GoogleLogo from "../assets/google_logo.png";

interface GoogleButtonProps {
  text: string;
  width?: number;
}

export function GoogleButton({ text, width }: GoogleButtonProps) {
  const dispatch = useAppDispatch();

  function responseGoogle(
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ): void {
    const idToken = (response as GoogleLoginResponse).tokenId;
    if (idToken) {
      dispatch(OAuthLoginUser({ OAuthProvider: "google", idToken }));
    } else {
      console.log(response.code);
    }
  }

  const GOOGLE_CLIENT_ID: string =
    "695443910196-mc7763ul6h5k5kgf1p08hjfn2pv7kccs.apps.googleusercontent.com";
  const googleJsSrc = "https://apis.google.com/js/platform.js";

  return (
    <GoogleLogin
      clientId={GOOGLE_CLIENT_ID}
      render={(renderProps) => (
        <Container
          as="button"
          className="btn btn-primary"
          style={{
            width: width ? `${width}px` : undefined,
            height: "40px",
            color: "white",
          }}
          onClick={renderProps.onClick}
          disabled={renderProps.disabled}
        >
          <Image
            src={GoogleLogo}
            rounded
            style={{
              backgroundColor: "white",
              height: "30px",
              width: "30px",
              padding: "3px",
              marginRight: "10px",
              marginTop: "-2px",
            }}
          />
          {text}
        </Container>
      )}
      buttonText="Sign in with Google"
      jsSrc={googleJsSrc}
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={"single_host_origin"}
    />
  );
}
