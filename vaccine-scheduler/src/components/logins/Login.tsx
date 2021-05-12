import React, { useState } from "react";
import Header from "../Header";
import { TextField, Button } from "@material-ui/core";
import { ChangeEvent } from "react";
import SocialSignIn from "../doSocialSignIn";
import { doSignInWithEmailAndPassword } from "../../firebase/firebaseFunctions";
import { useHistory } from "react-router-dom";

const Login = (props: { admin: Boolean }) => {
	const history = useHistory();
	const [error, setError] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
  
	const checkInputs = async () => {
	  if (email.trim().length === 0){
		  setError("Email is Required")
	  }
	  else if (!email.includes('@')){
		  setError("Badly formatted email")
	  }
	  else if(password.trim().length === 0){
		  setError("Password is Required")
	  }
	  else{
		  let response = await doSignInWithEmailAndPassword(email, password);
  
		  if (response){
			  setError(response.message);
		  }
		  else{
			  history.push("/userhomepage");
		  }
	  }
	}
  
	const emailHandler = (event: ChangeEvent<HTMLInputElement>) => {
	  setEmail(event.target.value);
	};
  
	const passwordHandler = (event: ChangeEvent<HTMLInputElement>) => {
	  setPassword(event.target.value);
	};
  
	return (
	  <div>
		<Header />
		<h1 className="title">
		  Login as User
		</h1>
		<div className="form-card">
		  <TextField
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
  