import React, {useEffect} from 'react'; 
import { makeStyles, Button, TextField} from '@material-ui/core'; 

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
                    <h2>What is your member ID? </h2>
                    <div>
                        <form className={classes.root} noValidate autoComplete="off">
                            <TextField id="standard-basicManualMI" required label="MemberIDManual" />
                        </form>
                    </div>
                </div>
            </section>

            <section className="groupPlan">
                <div>
                    <h2>What is your group number?</h2>
                    <div>
                        <form className={classes.root} noValidate autoComplete="off">
                            <TextField id="standard-basicManualGI" required label="GroupIDManual" />
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