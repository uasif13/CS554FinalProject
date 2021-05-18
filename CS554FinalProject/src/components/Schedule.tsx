import React, { useContext, useEffect, useState } from "react";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { makeStyles, Button } from "@material-ui/core";
import { db } from "../firebase/firebaseServer";
import ScheduleModal from "./modals/ScheduleModal";
import styled from "styled-components";
import { GlobalStyle } from ".././globalStyles";
import { sendOneMessage } from "../messaging/message";
import {
  getCurrUserData,
  appointmentBooked,
} from "../firebase/firebaseFunctions";
import { AuthContext } from "../firebase/firebaseAuth";

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
  const history = useHistory();
  const classes = useStyles();
  const { state } = useLocation<Location>();
  const { currentUser } = useContext(AuthContext);

  const [city, setCity] = useState<string>();
  const [stateLoc, setState] = useState<string>();
  const [street, setStreet] = useState<string>();
  const [zip, setZip] = useState<string>();
  const [time, setTime] = useState<Array<number>>();
  const [showScheduleModal, setScheduleModal] = useState<boolean>(false);
  const [data, setData] = useState<{ [key: string]: [times: number] }>();
  const [selectedTime, setSelectedTime] = useState<number>();
  const [dateSelected, setDateSelected] = useState("");
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
    if (state) {
      fetchData();
    } else {
      history.push("/admin");
    }
  }, []);

  const showTimes = (times: any) => {
    setTime(times);
  };
  const openModal = () => {
    setScheduleModal((prev) => !prev);
  };

  const buildButtons = (buttons: any, times: any) => {
    console.log(buttons);
    return (
      <div key={times}>
        <Button
          variant="contained"
          className={classes.button}
          onClick={() => {
            showTimes(times);
            setDateSelected(buttons.slice(0, 10));
          }}
        >
          {buttons.slice(0, 10)}
        </Button>
      </div>
    );
  };

  const chooseAppointment = async (times: any) => {
    setSelectedTime(times);
    await appointmentBooked(city);
    openModal();
    let data: any = await getCurrUserData();
    let time2 = times > 12 ? times - 12 + ":00pm" : times + ":00am";
    await sendOneMessage(
      data.phoneNumber,
      `Your appointment has been booked for ${dateSelected}, ${time2} at ${street}, ${city}, ${stateLoc}.`,
      data
    );
  };

  const buildTimes = (times: any, index: number) => {
    return (
      <div key={index}>
        <Button
          variant="contained"
          className={classes.button}
          key={index}
          onClick={() => {
            chooseAppointment(times);
          }}
        >
          {times > 12 ? times - 12 + ":00 pm" : times + ":00 am"}
        </Button>
      </div>
    );
  };

  if (currentUser.email === "admin@stevens.edu") {
    return <Redirect to="/admin" />;
  } else if (data) {
    return (
      <div>
        <div className={classes.address}>
          <a href="/user">
            <Button
              className={classes.backButton}
              variant="contained"
              color="secondary"
            >
              Go Back
            </Button>
          </a>
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

        <ScheduleModal
          showScheduleModal={showScheduleModal}
          setScheduleModal={setScheduleModal}
          city={city}
          stateLoc={stateLoc}
          time={selectedTime}
        />
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
