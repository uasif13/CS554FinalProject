import React, { useState, useContext } from "react";
import Header from "../Header";
import { TextField, Button } from "@material-ui/core";
import { ChangeEvent } from "react";
import { doSignInWithEmailAndPassword } from "../../firebase/firebaseFunctions";
import { useHistory, Redirect } from "react-router-dom";
import { AuthContext } from "../../firebase/firebaseAuth";

const LoginAdmin = (props: { admin: Boolean }) => {
  const { currentUser } = useContext(AuthContext);
  const history = useHistory();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const checkInputs = async () => {
    if (email.trim().length === 0) {
      setError("Email is Required");
    } else if (!email.includes("@")) {
      setError("Badly formatted email");
    } else if (password.trim().length === 0) {
      setError("Password is Required");
    } else if (email !== "admin@stevens.edu") {
      setError("Email and Password is not a valid admin credential");
    } else {
      let response = await doSignInWithEmailAndPassword(
        email.trim(),
        password.trim()
      );

      if (response) {
        setError(response.message);
      } else {
        history.push("/admin");
      }
    }
  };

  const emailHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const passwordHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  if (currentUser) {
    return <Redirect to="/user" />;
  } else if (currentUser && currentUser.email === "admin@stevens.edu") {
    return <Redirect to="/admin" />;
  } else {
    return (
      <div>
        <Header
          doesGoToProfile={false}
          doesGoToScheduler={false}
          doesSignOut={false}
          doesEdit={false}
        />
        <h1 className="title">Login as Admin</h1>
        <div className="form-card">
          <TextField id="email-id"
            variant="filled"
            onChange={emailHandler}
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
          <p className="errors">{error}</p>
          <Button
            onClick={(e) => {
              e.preventDefault();
              checkInputs();
            }}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
          <br />
          <br />
          <p>
            <a href="/reset">Forgot Password</a>
          </p>
          <br />
        </div>
      </div>
    );
  }
};

export default LoginAdmin;
