import { Button, TextField } from "@material-ui/core";
import { useState } from "react";
import "./components.css";
import Header from "./Header";
import axios from "axios";

function Register() {
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const nameHandler = (event) => {
    setName(event.target.value);
  };

  const emailHandler = (event) => {
    setEmail(event.target.value);
  };
  const phoneHandler = (event) => {
    setPhone(event.target.value);
  };

  const usernameHandler = (event) => {
    setUsername(event.target.value);
  };

  const passwordHandler = (event) => {
    setPassword(event.target.value);
  };

  async function submit() {
    axios({
      method: "post",
      url: "http://localhost:8080/api/sendMessage",
      data: {
        destination: "+1" + phone,
        message:
          "Hello! Thank you for signing up to our Covid-19 vaccine scheduler. Use this app to look around and find vaccines near you.",
      },
    })
      .then(() => {
        console.log("Success");
      })
      .catch((e) => {
        console.log(e.message);
      });
  }

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
          onChange={phoneHandler}
          placeholder="Phone Number (E.x. 9081292233)"
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
        <Button onClick={submit} variant="contained" color="primary">
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
