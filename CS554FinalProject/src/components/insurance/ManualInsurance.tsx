import React, {useEffect, useState} from 'react'; 
import { makeStyles, Button, TextField} from '@material-ui/core'; 
import { ChangeEvent } from "react";
import { useHistory } from "react-router-dom";
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
});

const ManualInsurance = () => {
    const classes = useStyles();
	const [error, setError] = useState("");
	const [memberID, setMemberID] = useState("");
	const [groupID, setGroupID] = useState("");
	const history = useHistory();

    useEffect(() =>{
        console.log('mounted'); 
    }, []);

	const memberIDHandler = (event: ChangeEvent<HTMLInputElement>) => {
		setMemberID(event.target.value);
	};

	const groupIDHandler = (event: ChangeEvent<HTMLInputElement>) => {
		setGroupID(event.target.value);
	};

	const handleSubmit = () =>{
		if (memberID.trim().length === 0){
			setError("Member ID Required");
		}
		else if (groupID.trim().length === 0){
			setError("Group ID Required")
		}else{
			setError("")
			history.push("/userhomepage");
		}
	}
    return(
        <div>
            <h1> Manual Scan</h1>
            <section className="memberID">
                <div>
                    <h2>What is your member ID? </h2>
                    <div>
                        <form className={classes.root} noValidate autoComplete="off">
                            <TextField 
								id="standard-basicManualMI" 
								required 
								onChange={memberIDHandler}
								label="Member ID" 
								/>
                        </form>
                    </div>
                </div>
            </section>

            <section className="groupPlan">
                <div>
                    <h2>What is your group number?</h2>
                    <div>
                        <form className={classes.root} noValidate autoComplete="off">
                            <TextField 
								id="standard-basicManualGI" 
								required 
								onChange={groupIDHandler}
								label="Group ID" />
                        </form>
                    </div>
                </div>
            </section>

			<p className="errors">{error}</p>
            <Button variant="contained" 
                    className={classes.button} 
					onClick={handleSubmit}
					>
                    Submit
            </Button> 
         
        </div>
    )
}

export default ManualInsurance; 