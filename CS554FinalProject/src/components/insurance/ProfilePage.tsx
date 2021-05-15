import React, {useEffect, useState} from 'react'; 
import { FormControl,FormControlLabel, RadioGroup, Radio, TextField, Checkbox, Button, CircularProgress } from '@material-ui/core'; 
import ScanInsurance from './ScanInsurance'
import ManualInsurance from './ManualInsurance';
import Header from '../Header'
import "../components.css";
import {doUpdateUserPhoneAndDist} from "../../firebase/firebaseFunctions";

function ProfilePage() {
    const [radioButton, setRadioButton] = useState("scan");
    const [loading, setLoading] = useState(true); 
    const [optText, setOptText] = useState(false);
    const [phoneNum, setPhoneNum] = useState("");
    const [distance, setDistance] = useState("");
    const [loading2, setLoading2] = useState(false);
    const [error, setError] = useState("");

    const handleDistanceChange = (event: any) => {
        setDistance(event.target.value);
    }

    const handlePhoneChange = (event: any) => {
        setPhoneNum(event.target.value);
    }

    const handleOptText = (event: any) => {
        setOptText(!optText);
    }

    useEffect(() =>{
        console.log(radioButton)
        setLoading(false); 
    }, [radioButton])

    const handleRadioButtons = (event: any) => { 
        console.log("Radio button switching to: ", event.target.value); 
        setRadioButton(event.target.value)
    }; 

    const checkPhoneNumber = (num: string) => {
        if (isNaN(parseInt(num))) return false;
        if (num.length < 10 || num.length > 11) return false;

        return true;
    }


    async function submit() {
        setLoading2(true);

        if (!checkPhoneNumber(phoneNum)) {
            setError("Invalid phone number");
            setLoading2(false);
            return;
        }

        try {
            let res: any = await doUpdateUserPhoneAndDist(phoneNum, distance, optText);
            console.log(res)

            if (res.status === 500) {
                setError(res.message);
                setLoading2(false);
                return;
            }

        } catch (e) {
            setError(e.message);
            setLoading2(false);
            return;
        }

        setLoading2(false);
    }


    if (loading){
        return(
            <div>
                <h1>Loading</h1>
            </div>
        )
    }else{
        return(
            <div>
				<div className="profileHeader">
                <Header doesGoToProfile={false} doesGoToScheduler={true}/>
                <h1>User Details</h1>
				</div>

				<div>
                <FormControl component="fieldset">
                <h2>Scan Insurance Card or Input Manually</h2>
                    <RadioGroup aria-label="typeScan" name="typeScan" row value={radioButton} onChange={handleRadioButtons}>
                        <FormControlLabel value="scan" control={<Radio />} label="Scan" />
                        <FormControlLabel value="manual" control={<Radio />} label="Manual" />
                    </RadioGroup>
                </FormControl>
                <div className="form-card-lg">


                <div className="phoneInfo">
                    <h1>Contact Information</h1>
                    <TextField variant="filled" onChange={handlePhoneChange} id="phone-num" required label="Phone Number (No '-' or '+'):" />
                    <p>How far are you willing to travel to get a vaccine?</p>
                    <TextField variant="filled" onChange={handleDistanceChange} id="distance" required label="Distance in Miles:" />
                    <br />
                    <FormControlLabel
                        control={<Checkbox checked={optText} onChange={handleOptText} name="textOpt" />}
                        label="Opt in for text messages?"
                    />
                    <br />
                    <p className="errors">{error}</p>
                    <br />
                    <br />
                    {!loading2 ? <Button variant="contained" onClick={submit} color="primary">Save</Button> : <CircularProgress />}
                </div>

				{(radioButton && radioButton === "scan") ? 
                    <ScanInsurance/> : 
                    <ManualInsurance/>}

                </div>
				</div>
            </div>
        );
    }


};


export default ProfilePage; 