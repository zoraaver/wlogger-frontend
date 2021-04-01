import * as React from "react";
import { Container, Image } from "react-bootstrap";
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import { useAppDispatch } from "..";
import { googleLoginUser } from "../slices/usersSlice";

interface GoogleButtonProps {
  text: string;
  width?: number;
}

export function GoogleButton({ text, width }: GoogleButtonProps) {
  const dispatch = useAppDispatch();

  function responseGoogle(
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ): void {
    if ((response as GoogleLoginResponse).tokenId) {
      dispatch(googleLoginUser((response as GoogleLoginResponse).tokenId));
    } else {
      console.log(response.code);
    }
  }

  const GOOGLE_CLIENT_ID: string =
    "695443910196-mc7763ul6h5k5kgf1p08hjfn2pv7kccs.apps.googleusercontent.com";
  const googleImageSrc =
    "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg";
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
            src={googleImageSrc}
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
