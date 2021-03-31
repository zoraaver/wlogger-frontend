import * as React from "react";
import { Container, Image } from "react-bootstrap";
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import { useAppDispatch } from "..";
import { googleLoginUser } from "../slices/usersSlice";

export function GoogleButton() {
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

  return (
    <GoogleLogin
      clientId={GOOGLE_CLIENT_ID}
      render={(renderProps) => (
        <Container
          as="button"
          className="btn btn-primary"
          style={{
            width: "210px",
            height: "40px",
            color: "white",
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
          onClick={renderProps.onClick}
          disabled={renderProps.disabled}
        >
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            rounded
            style={{
              backgroundColor: "white",
              height: "30px",
              width: "30px",
              padding: "3px",
            }}
          />
          Sign in with Google
        </Container>
      )}
      buttonText="Sign in with Google"
      jsSrc="https://apis.google.com/js/platform.js"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={"single_host_origin"}
    />
  );
}
