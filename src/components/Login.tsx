import React, { useState } from "react";
import Header from "./Header";
import { TextField, Button } from "@material-ui/core";
import { ChangeEvent } from "react";
import SocialSignIn from "./doSocialSignIn";
import { doSignInWithEmailAndPassword } from "../firebase/firebaseFunctions";
import { useHistory } from "react-router-dom";

const Login = (props: { admin: Boolean }) => {
  const history = useHistory();
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const usernameHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const passwordHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <div>
      <Header />
      <h1 className="title">
        Login as {props.admin == true ? "Admin" : "User"}
      </h1>
      <div className="form-card">
        <TextField
          variant="filled"
          onChange={usernameHandler}
          placeholder="Username"
        />
        <br />
        <br />
        <br />
        <br />
        <TextField
          type="password"
          onChange={passwordHandler}
          variant="filled"
          placeholder="Password"
        />
        <br />
        <br />
        <br />
        <p>{error}</p>
        <Button
          onClick={(e) => {
            e.preventDefault();
            doSignInWithEmailAndPassword(username, password);
            history.push("/account");
          }}
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
        <SocialSignIn />
        <br />
        <br />
        <p>
          <a>Forgot Username / Password</a>
        </p>
        <br />
        <p>
          Not on Covid-19 Scheduler yet? <a href="/register">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
