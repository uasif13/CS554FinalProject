import { Link as RouterLink } from "react-router-dom";
import React, {useEffect, useState} from 'react'; 
import { makeStyles, Button, TextField, FormControl,FormControlLabel, FormLabel, RadioGroup, Radio } from '@material-ui/core'; 

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

    useEffect(() =>{
        console.log('mounted'); 
    }, []);

    return(
        <div>
            <h1> Manual Scan</h1>
            <section className="memberID">
                <div>
                    <h4>What is your member ID? </h4>
                    <div>
                        <form className={classes.root} noValidate autoComplete="off">
                            <TextField id="standard-basic" required label="Member ID" />
                        </form>
                    </div>
                </div>
            </section>

            <section className="groupPlan">
                <div>
                    <h4>What is your group number?</h4>
                    <div>
                        <form className={classes.root} noValidate autoComplete="off">
                            <TextField id="standard-basic" required label="Group ID" />
                        </form>
                    </div>
                </div>
            </section>

        
            <Button variant="contained" 
                    className={classes.button} >
                    Submit
            </Button> 
         
        </div>
    )
}

export default ManualInsurance; 