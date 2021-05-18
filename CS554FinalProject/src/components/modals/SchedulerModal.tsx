import React, { useRef, useEffect, useCallback, useState, Dispatch, SetStateAction  } from "react";
import ReactModal from "react-modal";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { makeStyles, Button } from "@material-ui/core";
import Modal from '@material-ui/core/Modal';

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

const SchedulerModal = ( props: {
	showScheduleModal: boolean,
	setScheduleModal: Dispatch<SetStateAction<boolean>>,
	city: string | undefined,
	stateLoc: string | undefined,
	time:number | undefined,
}) => {
	const modalRef = useRef();
	const history = useHistory();
	const classes = useStyles();
	const [modalStyle] = useState(getModalStyle);

	let str = " : 00 am";
	if (props.time){
		if (props.time > 12) {
			props.time = props.time - 12;
		  str = " : 00 pm";
		}
	}


	const routeChange = () => {
		let path = `/user`;
		history.push(path);
	};

	const closeModal = (e: any) => {
		if (modalRef.current === e.target) {
			props.setScheduleModal(false);
		}
	  };
	  
	const keyPress = useCallback(
		(e) => {
		  if (e.key === "Escape" && props.showScheduleModal) {
			props.setScheduleModal(false);
			console.log("I pressed");
		  }
		},
		[props.setScheduleModal, props.showScheduleModal]
	);

	useEffect(() => {
		document.addEventListener("keydown", keyPress);
		return () => document.removeEventListener("keydown", keyPress);
	  }, [keyPress]);

	const body = (		
		<div style={modalStyle} className={classes.paper}>
			<h1>
			You have successfully booked <br />
			an appointment at{" "}
			</h1>
			<p>
			{props.city}, {props.stateLoc}
			</p>
			<br />
          	<p>
            at {props.time}
            {str}
          	</p>
			<Button className={classes.button} onClick={routeChange}>
            Return to Homepage
          </Button>
		</div>
	)


	return(
		<div>
			{props.showScheduleModal ? 
			<Modal
			open = {props.showScheduleModal}
			onClose = {closeModal}
			aria-labelledby="simple-modal-title"
			aria-describedby="simple-modal-description">
				{body}
			</Modal> : null}
		</div>
	)
};


export default SchedulerModal;