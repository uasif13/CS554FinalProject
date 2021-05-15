import React, { useContext } from "react";
import { Button } from "@material-ui/core";
import { useHistory, Redirect } from "react-router-dom";
import { AuthContext } from "../firebase/firebaseAuth";

function Home() {
  const { currentUser } = useContext(AuthContext);
  const history = useHistory();

  function handleLoginUser() {
    history.push("/login");
  }

  function handleLoginAdmin() {
    history.push("/login/admin");
  }

  function handleRegister() {
    history.push("/register");
  }

  if (currentUser) {
    return <Redirect to="/user" />;
  } else {
    return (
      <div className="home-container">
        <h1>Covid-19 Scheduler</h1>
        <p>
          Our team saw the difficulty of scheduling a vaccine appointment as the
          group of people eligible for the vaccine grows. Our group hopes to
          allow our clients to be notified immediately if there is an open
          appointment in the vicinity.
        </p>
        <p className="subtext">Click below to get started</p>
        <Button variant="contained" color="primary" onClick={handleLoginAdmin}>
          Login as Admin
        </Button>
        <Button variant="contained" color="primary" onClick={handleLoginUser}>
          Login as User
        </Button>
        <Button variant="contained" color="primary" onClick={handleRegister}>
          Sign up as User
        </Button>
      </div>
    );
  }
}

export default Home;
