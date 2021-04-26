import React, {useEffect, useState, useRef} from 'react'; 
import { makeStyles, Button, TextField, FormControl,FormControlLabel, FormLabel, RadioGroup, Radio } from '@material-ui/core'; 
import ScanInsurance from '../components/insurance/ScanInsurance';
import ManualInsurance from '../components/insurance/ManualInsurance';
import { isObjectBindingPattern } from 'typescript';


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
  

function ProfilePage() {
    const classes = useStyles();
    const [radioButton, setRadioButton] = useState("scan");
    const [loading, setLoading] = useState(true); 

    useEffect(() =>{
        console.log(radioButton)
        setLoading(false); 
    }, [radioButton])

    const handleRadioButtons = (event: any) => { 
        console.log("Radio button switching to: ", event.target.value); 
        setRadioButton(event.target.value)

    }; 
    if (loading){
        return(
            <div>
                <h1>Loading</h1>
            </div>
        )
    }else{
        return(
            <div>
                <h1>User Details</h1>
    
                <FormControl component="fieldset">
                <h4>Scan Insurance Card or Input Manually</h4>
                    <RadioGroup aria-label="typeScan" name="typeScan" value={radioButton} onChange={handleRadioButtons}>
                        <FormControlLabel value="scan" control={<Radio />} label="Scan" />
                        <FormControlLabel value="manual" control={<Radio />} label="Manual" />
                    </RadioGroup>
                </FormControl>
                
                {(radioButton && radioButton === "scan") ? 
                    <ScanInsurance/> : 
                    <ManualInsurance/>}
            </div>
        );
    }


};


export default ProfilePage; 