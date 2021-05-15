import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { makeStyles, Button } from "@material-ui/core";
import { db } from "../firebase/firebaseServer";
import ScheduleModal from './modals/ScheduleModal';
import styled from 'styled-components';
import { GlobalStyle } from '.././globalStyles';
import {sendOneMessage} from "../messaging/message";
import {getCurrUserData} from "../firebase/firebaseFunctions";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  button: {
    background: "#3D4CBC",
    color: "white",
    margin: "10px",
  },
  backButton: {
    position: "absolute",
    top: "20px",
    left: "20px",
  },
  address: {
    textAlign: "center",
  },
  chooseDate: {
    width: "25ch",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
    padding: "12px",
    position: "relative",
  },
});
interface address {
  city: string;
  state: string;
  street: string;
  zip: string;
}

interface appointments {
  key: boolean;
}

interface currLocation {
  address: address;
  numVaccines: number;
  appointmentsForLocation: appointments;
}

interface Location {
  key: string;
  val: currLocation;
}

const Schedule = () => {
  const classes = useStyles();
  const { state } = useLocation<Location>();

  const [city, setCity] = useState<string>();
  const [stateLoc, setState] = useState<string>();
  const [street, setStreet] = useState<string>();
  const [zip, setZip] = useState<string>();
  const [time, setTime] = useState<Array<number>>();
  const [showScheduleModal, setScheduleModal]= useState<boolean>(false);
  const [data, setData] = useState<{ [key: string]: [times: number] }>();
  const [selectedTime, setSelectedTime] = useState<number>();
  useEffect(() => {
    async function fetchData() {
      try {
        let location = state.val.appointmentsForLocation;
        let obj: { [key: string]: [times: number] } = {};

        await Promise.all(
          Object.keys(location).map(async (key) => {
            let snapshot = await db.ref("Appointments/" + key).once("value");

            let value = snapshot.val();
            let day = value.date.day;
            let month = value.date.month;
            let year = value.date.year;
            let time = value.time;

            let apt = new Date(year, month, day);

            if (!obj[apt.toString()]) {
              obj[apt.toString()] = [time];
            } else {
              obj[apt.toString()].push(time);
            }

            return obj;
          })
        );

        setData(obj);

        setCity(state.val.address.city);
        setState(state.val.address.state);
        setStreet(state.val.address.street);
        setZip(state.val.address.zip);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [
    state.val.address.city,
    state.val.address.state,
    state.val.address.street,
    state.val.address.zip,
    state.val.appointmentsForLocation,
  ]);

  const showTimes =  (times: any) => {
   setTime(times);
  };
  const openModal = () =>{
    setScheduleModal(prev => !prev);
}



  const buildButtons = (buttons: any, times: any) => {
    return (
      <div key={times}>
        <Button
          variant="contained"
          className={classes.button}
          onClick={() => {
            showTimes(times);
          }}
        >
          {buttons.slice(0, 10)}
        </Button>
      </div>
    );
  };


  const chooseAppointment = async (times:any) => {
    console.log("User Chose Appointment. Push to Firebase");
    // TODO: Connect to firebase, {need user to be logged in}
    //Open the modal
    // handleOpenScheduleModal(city,stateLoc,street, zip, date)
    setSelectedTime(times);
   // console.log("Time selected is: ", times);
    openModal();
    let data: any = await getCurrUserData();
    console.log(data);
    await sendOneMessage(data.phoneNumber, `Your appointment has been booked for [date] at ${times}:00 at ${street}, ${city}, ${stateLoc}.`);
  }

  const buildTimes = (times: any, index: number) => {

    return (
      <div key={index}>
        <Button
          variant="contained"
          className={classes.button}
          key={index}
          onClick={() => {chooseAppointment(times)}}
        >
          {times > 12 ? times - 12 + ":00 pm" : times + ":00 am"}
        </Button>

      </div>
    );
  };

  if (data) {
    return (
      <div>
        <div className={classes.address}>
          <a href="/user"><Button className={classes.backButton} variant="contained" color="secondary">Go Back</Button></a>
          <h1>
            Location: {city}, {stateLoc}
          </h1>
          <p>{street}</p>
          <p>
            {city}, {stateLoc}, {zip}
          </p>
        </div>
        <div className="form-card">
          <div className={classes.chooseDate}>
            <h2>Choose Date: </h2>
            <br />
            <div>
              {Object.keys(data).map((key) => {
                return buildButtons(key, data[key]);
              })}
            </div>
          </div>
        </div>
        <div className="form-card">
          <h2>Choose Time:</h2>
          {time
            ? time.map((key, index) => {
                return buildTimes(key, index);
              })
            : "No Times Available"}
        </div>

        <ScheduleModal showScheduleModal={showScheduleModal} setScheduleModal={setScheduleModal} city={city} stateLoc={stateLoc} time={selectedTime}/>
        <GlobalStyle />


      </div>
    );
  } else {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }
};

export default Schedule;
