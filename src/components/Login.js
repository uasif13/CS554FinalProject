import React, { useState } from "react";
import Header from "./Header";
import { TextField, Button } from "@material-ui/core";

const Login = ({ admin }) => {
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const usernameHandler = (event) => {
    setUsername(event.target.value);
  };

  const passwordHandler = (event) => {
    setPassword(event.target.value);
  };

  return (
    <div>
      <Header />
      <h1 className="title">Login as {admin == true ? "Admin" : "User"}</h1>
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
        <Button variant="contained" color="primary">
          Submit
        </Button>
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
