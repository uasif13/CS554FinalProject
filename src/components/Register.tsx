import { Button, TextField } from "@material-ui/core";
import React, { useState, ChangeEvent } from "react";
import "./components.css";
import Header from "./Header";
import { doCreateUserWithEmailandPassword } from "../firebase/firebaseFunctions";
import SocialSignIn from "./doSocialSignIn";
import { useHistory } from "react-router-dom";

function Register() {
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const createAccount = async () => {
    await doCreateUserWithEmailandPassword(email, password, username);
  };
  const nameHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const emailHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const usernameHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const passwordHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <div>
      <Header />
      <h1 className="title">Sign Up as User</h1>
      <div className="form-card">
        <TextField variant="filled" onChange={nameHandler} placeholder="Name" />
        <br />
        <br />
        <TextField
          variant="filled"
          onChange={emailHandler}
          placeholder="Email"
        />
        <br />
        <br />
        <TextField
          variant="filled"
          onChange={usernameHandler}
          placeholder="Username"
        />
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
        <Button
          onClick={(e) => {
            e.preventDefault();
            createAccount();
            history.push("/profile");
          }}
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
        <br />
        <SocialSignIn />
        <p>{error}</p>
        <p>
          Already have an account? <a href="/login">Log In</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
