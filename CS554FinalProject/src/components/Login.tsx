import React, { useState, useContext } from "react";
import Header from "./Header";
import { TextField, Button } from "@material-ui/core";
import { ChangeEvent } from "react";
import SocialSignIn from "./doSocialSignIn";
import {
  doPasswordReset,
  doSignInWithEmailAndPassword,
} from "../firebase/firebaseFunctions";
import { useHistory, Redirect } from "react-router-dom";
import { AuthContext } from "../firebase/firebaseAuth";

const Login = (props: { admin: Boolean }) => {
  const history = useHistory();
  const { currentUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const login = async (e: any) => {
    e.preventDefault();
    try {
      console.log("before", currentUser);
      await doSignInWithEmailAndPassword(username, password);
      console.log("after", currentUser);
      history.push("/user");
    } catch (e) {
      alert(e);
    }
  };
  const changePassword = async (event: any) => {
    event.preventDefault();
    try {
      await doPasswordReset(username);
    } catch (e) {
      alert(e);
    }
  };

  const usernameHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const passwordHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  console.log(currentUser);
  if (currentUser) {
    return <Redirect to="/user" />;
  } else {
    return (
      <div>
      <Header doesGoToProfile={false} doesGoToScheduler={false}/>	
        <h1 className="title">Login as User</h1>
        <div className="form-card">
          <TextField
            variant="filled"
            onChange={usernameHandler}
            placeholder="Email"
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
          <Button onClick={login} variant="contained" color="primary">
            Submit
          </Button>
          <SocialSignIn />
          <br />
          <br />
          <p>
            <Button variant="contained" onClick={changePassword}>
              Forgot Password
            </Button>
          </p>
          <br />
          <p>
            Not on Covid-19 Scheduler yet? <a href="/register">Sign Up</a>
          </p>
        </div>
      </div>
    );
  }
};

export default Login;
