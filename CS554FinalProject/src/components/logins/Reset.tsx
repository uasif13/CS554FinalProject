import React, {useState} from 'react'; 
import { ChangeEvent } from "react";
import { makeStyles, Button,TextField} from '@material-ui/core'; 
import Header from "../Header";
import {doPasswordReset} from "../../firebase/firebaseFunctions";
import Modal from '@material-ui/core/Modal';
import { useHistory } from "react-router-dom";

function getModalStyle() {
    const top = 50;
    const left = 50;
    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}


const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
    button:{
      background: '#3D4CBC',
      color: 'white'
    }, 
    buttonRows:{
        display: 'inline-block',
        margin: '10px'
    }, 
    root: {
        '& > *': {
          margin: '12px',
          width: '25ch',
        },
    },
	paper: {
		position: 'absolute',
		padding: '10px',
		width: 400,
		color: 'black',
		backgroundColor: 'white',
		display: 'flex',
		alignItems: 'stretch',
		justifyContent: 'center', 
		alignContent: 'center', 
		flexWrap: 'wrap', 
		flexDirection: 'column',
	},
	modal: {
		display: 'flex', 
		alignItems:'center', 
		justifyContent: 'center'
	} 
});

const Reset = () =>{
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [open, setOpen] = useState(false);
	const [modalStyle] = useState(getModalStyle);
	const history = useHistory();
	const classes = useStyles();

	const handleOpen = () => {
		setOpen(true);
	};
	
	  const handleClose = () => {
		setOpen(false);
		history.push('/');
	};

	const emailHandler = (event: ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value);
	  };

	const sendEmail = async() =>{
		if (email.trim().length === 0){
			setError("Email is required")
		}
		else if (!email.includes('@')){
			setError("Badly formed email")
		}
		else{
			setError("")
			let response = await doPasswordReset(email);
	
			if(response){
				setError(response.message);
			}else{
				console.log("Success Page")
				handleOpen();
			}
		}
	}

	const body = (
		<div style={modalStyle} className={classes.paper}>
		  <h2 id="simple-modal-title">Successfully Sent Email</h2>
		  <br/>
		  <br/>
		  <Button 
			className={classes.button}
			onClick={(e) =>{
				e.preventDefault(); 
				handleClose(); 
			}}>Close</Button>
		</div>
	  );

	return(
		<div>
			<Header/>
			<h1>Forgot Password</h1>
			<p>Enter email address that you used to register. <br/>
			We'll send you an email with your username and a link to reset your password.
			</p>
			<p className="errors">{error}</p>
			<div>
				<form className={classes.root} noValidate autoComplete="off">
					<TextField 
					id="standard-basicManualMI" 
					required 
					onChange={emailHandler}
					label="Email" />
				</form>
			</div>

			<Button 
				onClick={(e) => {
					e.preventDefault(); 
					sendEmail(); 
				}}
				variant="contained" 
				className={classes.button} 
					>
                    Send
            </Button> 

			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
				>
				{body}
      		</Modal>
		</div>
	)
};

export default Reset;