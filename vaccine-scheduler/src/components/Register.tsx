import { Button, TextField, FormControl } from "@material-ui/core";
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

  const validatePassword = (pw) => {

    return /[A-Z]/       .test(pw) &&
           /[a-z]/       .test(pw) &&
           /[0-9]/       .test(pw) &&
           /[^A-Za-z0-9]/.test(pw) &&
           pw.length > 4;

}

  const createAccount = async () => {
	if (name.trim().length === 0){
		setError("Name is required")
	}
	else if(email.trim().length === 0){
		setError("Email is required"); 
	}
	else if(!email.includes('@')){
		setError("Badly formed email")
	}
	else if(username.trim().length === 0){
		setError("Username is required");
	}
	else if(password.trim().length < 5){
		setError("Password must be of length 5 or greater");
	}
	else{

		if (!validatePassword(password.trim())) {		
			setError("Password must contain an uppercase, lowercase letter and a number");
			return;
		}

		let response = await doCreateUserWithEmailandPassword(email, password, username);

		if (response === "auth/email-already-in-use"){
			setError("The email address is already in use by another account.")
		}else{
			history.push("/profile");
		}
	}


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
		<form>
			<TextField 
				variant="filled" 
				onChange={nameHandler} 
				placeholder="First Name" 
				required
			/>
			<br />
			<br />
			<TextField
			variant="filled"
			onChange={emailHandler}
			placeholder="Email"
			required
			/>
			<br />
			<br />
			<TextField
			variant="filled"
			onChange={usernameHandler}
			placeholder="Username"
			required
			/>
			<br />
			<br />
			<TextField
			type="password"
			onChange={passwordHandler}
			variant="filled"
			placeholder="Password"
			required
			/>
			<br />
			<br />
			<p className="errors">{error}</p>
			<Button
			onClick={(e) => {
				e.preventDefault();
				createAccount();

			}}
			variant="contained"
			color="primary"
			>
			Submit
			</Button>
			<br />
			<SocialSignIn />
			<p>
			Already have an account? <a href="/login">Log In</a>
			</p>
		</form>
      </div>
	  
    </div>
  );
}

export default Register;
