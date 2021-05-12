import React, {useEffect, useState} from 'react'; 
import { FormControl,FormControlLabel, RadioGroup, Radio } from '@material-ui/core'; 
import ScanInsurance from '../components/insurance/ScanInsurance';
import ManualInsurance from '../components/insurance/ManualInsurance';

function ProfilePage() {
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
                <h2>Scan Insurance Card or Input Manually</h2>
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