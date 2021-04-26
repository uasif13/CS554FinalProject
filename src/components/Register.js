import { Button, TextField } from "@material-ui/core";
import { useState } from "react";
import "./components.css";
import Header from "./Header";

function Register() {
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const nameHandler = (event) => {
    setName(event.target.value);
  };

  const emailHandler = (event) => {
    setEmail(event.target.value);
  };

  const usernameHandler = (event) => {
    setUsername(event.target.value);
  };

  const passwordHandler = (event) => {
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
        <Button variant="contained" color="primary">
          Submit
        </Button>
        <br />
        <p>{error}</p>
        <p>
          Already have an account? <a href="/login">Log In</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
