import React, { useEffect, useState, useContext } from "react";
import {
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  Checkbox,
  Button,
  CircularProgress,
} from "@material-ui/core";
import ScanInsurance from "./ScanInsurance";
import ManualInsurance from "./ManualInsurance";
import Header from "../Header";
import "../components.css";
import {
  doUpdateUserPhoneAndDist,
  getCurrUserData,
} from "../../firebase/firebaseFunctions";
import { Alert } from "@material-ui/lab";
import { Redirect } from "react-router-dom";
import { AuthContext } from "../../firebase/firebaseAuth";

function ProfilePage() {
  const [radioButton, setRadioButton] = useState("scan");
  const [loading, setLoading] = useState(true);
  const [optText, setOptText] = useState(false);
  const [phoneNum, setPhoneNum] = useState("");
  const [distance, setDistance] = useState("");
  const [loading2, setLoading2] = useState(false);
  const [error, setError] = useState("");
  const [succ, setSucc] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const handleDistanceChange = (event: any) => {
    setDistance(event.target.value);
  };

  const handlePhoneChange = (event: any) => {
    setSucc(false);
    setPhoneNum(event.target.value);
  };

  const handleOptText = (event: any) => {
    setOptText(!optText);
  };

  useEffect(() => {
    async function fetchData() {
      let data = await getCurrUserData();
      setOptText(data.rabbitMQ);
      setPhoneNum(data.phoneNumber);
      setDistance(data.dist);
      setLoading(false);
    }
    fetchData();
    return () => {
      console.log("clean up func");
    };
  }, [radioButton]);

  const handleRadioButtons = (event: any) => {
    console.log("Radio button switching to: ", event.target.value);
    setRadioButton(event.target.value);
  };

  const checkPhoneNumber = (num: string) => {
    if (isNaN(parseInt(num))) return false;
    if (num.length < 10 || num.length > 11) return false;

    return true;
  };

  async function submit() {
    setLoading2(true);

    let res: any;
    if (!checkPhoneNumber(phoneNum)) {
      setError("Invalid phone number");
      setLoading2(false);
      return;
    }

    try {
      res = await doUpdateUserPhoneAndDist(phoneNum, distance, optText);

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
    setSucc(true);
  }

  if (currentUser.email === "admin@stevens.edu") {
    return <Redirect to="/admin" />;
  } else if (loading) {
    return (
      <div>
        <h1>Loading</h1>
      </div>
    );
  } else {
    return (
      <div>
        <div className="profileHeader">
          <Header
            doesGoToProfile={false}
            doesGoToScheduler={true}
            doesSignOut={true}
            doesEdit={false}
          />
          <h1>User Details</h1>
        </div>

        <div>
          <FormControl component="fieldset">
            <h2>Scan Insurance Card or Input Manually</h2>
            <RadioGroup
              aria-label="typeScan"
              name="typeScan"
              row
              value={radioButton}
              onChange={handleRadioButtons}
            >
              <FormControlLabel value="scan" control={<Radio />} label="Scan" />
              <FormControlLabel
                value="manual"
                control={<Radio />}
                label="Manual"
              />
            </RadioGroup>
          </FormControl>
          <div className="form-card-lg">
            <div className="phoneInfo">
              <h1>Contact Information</h1>
              <p>What is your phone number?</p>
              <TextField
                value={phoneNum}
                variant="filled"
                onChange={handlePhoneChange}
                id="phone-num"
                required
                label="Phone Number (No '-' or '+'):"
              />
              <p>How far are you willing to travel to get a vaccine?</p>
              <TextField
                value={distance}
                variant="filled"
                onChange={handleDistanceChange}
                id="distance"
                required
                label="Distance in Miles:"
              />
              <br />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={optText}
                    onChange={handleOptText}
                    name="textOpt"
                  />
                }
                label="Opt in for text messages?"
              />
              <br />
              <p className="errors">{error}</p>
              <br />
              <br />
              {succ ? (
                <Alert severity="success">Successfuly updated profile</Alert>
              ) : !loading2 ? (
                <Button variant="contained" onClick={submit} color="primary">
                  Save
                </Button>
              ) : (
                <CircularProgress />
              )}
            </div>

            {radioButton && radioButton === "scan" ? (
              <ScanInsurance />
            ) : (
              <ManualInsurance />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ProfilePage;
