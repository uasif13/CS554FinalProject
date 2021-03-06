import React, { useEffect, useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import { auth, db } from "../firebase/firebaseServer";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import {
  doUpdateVaccineCount,
  getCurrUserData,
} from "../firebase/firebaseFunctions";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  makeStyles,
  Button,
} from "@material-ui/core";
import Header from "./Header";
import { AuthContext } from "../firebase/firebaseAuth";
import { sendMessageBatch } from "../messaging/message";
import { useHistory } from "react-router-dom";

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: "#ee003b",
    },
  },
});
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  button: {
    background: "#3D4CBC",
    color: "white",
  },
  buttonRows: {
    display: "inline-block",
    margin: "10px",
  },
  root: {
    "& > *": {
      margin: "12px",
      width: "25ch",
    },
  },
  paper: {
    position: "absolute",
    padding: "10px",
    width: 400,
    color: "black",
    backgroundColor: "white",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "center",
    alignContent: "center",
    flexWrap: "wrap",
    flexDirection: "column",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

interface appointments {
  [keys: string]: any;
}
interface address {
  city: string;
  state: string;
  street: string;
  zip: string;
}

interface currLocation {
  address: address;
  appointmentsForLocation: appointments;
  numVaccines: number;
}

interface Location {
  key: string | null;
  value: currLocation;
}

function AdminHomePage() {
  const { currentUser } = useContext(AuthContext);
  const [locations, setLocations] = useState<Array<Location>>([]);
  const [admin, setAdmin] = useState<Boolean>(true);
  const history = useHistory();
  const classes = useStyles();
  let vaccineCount = 0;

  let allLocations: Location[] = [];
  let card = null;

  useEffect(() => {
    async function fetchData() {
      try {
        // Calls to Firebase to refer to Location child
        db.ref("Locations").on("value", (snapshot) => {
          snapshot.forEach((snap) => {
            const locationData = {
              key: snap.key,
              value: snap.val(),
            };
            allLocations.push(locationData);
          });
          setLocations(allLocations);
        });
      } catch (e) {
        console.log(e);
      }
    }
    async function checkAdminPermissions() {
      try {
        let userData = await getCurrUserData();
        if (currentUser.email !== "admin@stevens.edu") {
          alert("Hey, you're not an admin! Kicking you out to user pages");
        }
      } catch (e) {
        alert(e);
      }
    }
    fetchData();
    checkAdminPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doDecrementVaccines = async (currLoc: any) => {
    vaccineCount = currLoc.value.numVaccines;
    if (vaccineCount > 0) {
      vaccineCount = vaccineCount - 1;
    }
    const appointmentArray = Object.keys(currLoc.value.appointmentsForLocation);
    let deletedAppointmentID = appointmentArray[appointmentArray.length - 1];
    await db
      .ref(
        "Locations/" +
          currLoc.key +
          "/appointmentsForLocation/" +
          deletedAppointmentID
      )
      .remove();
    await db.ref("Appointments/" + deletedAppointmentID).remove();
    await doUpdateVaccineCount(currLoc.value.address.city, vaccineCount);
    window.location.reload(true);
  };

  const doIncrementVaccines = async (currLoc: any) => {
    vaccineCount = currLoc.value.numVaccines;

    vaccineCount = vaccineCount + 1;

    const currentLocationRef = db.ref("Locations/" + currLoc.key + "/");
    const appointmentListRef = db.ref("Appointments");
    if (vaccineCount === 1) {
      const newAppointment = appointmentListRef.push();
      newAppointment.set({
        date: {
          day: 25,
          month: 5,
          year: 2021,
        },
        time: 8,
      });
      const appointmentsForLocation: any = {};
      if (newAppointment.key !== null) {
        appointmentsForLocation[newAppointment.key] = true;
        currentLocationRef.update({
          appointmentsForLocation,
        });
      }
    } else {
      const appointmentArray = Object.keys(
        currLoc.value.appointmentsForLocation
      );
      let mostRecentAppointmentID =
        appointmentArray[appointmentArray.length - 1];
      const recentAppointment = await db
        .ref("Appointments")
        .child(mostRecentAppointmentID)
        .once("value");
      const newTime = (recentAppointment.val().time % 6) + 7;
      const newAppointment = appointmentListRef.push();
      newAppointment.set({
        date: {
          day: recentAppointment.val().date.day,
          month: recentAppointment.val().date.month,
          year: recentAppointment.val().date.year,
        },
        time: newTime,
      });
      const newAppointmentForLocation = currentLocationRef.child(
        "appointmentsForLocation"
      );
      const appointmentsForLocation: any = {};
      if (newAppointment.key !== null) {
        appointmentsForLocation[newAppointment.key] = true;
        newAppointmentForLocation.update({
          ...appointmentsForLocation,
        });
      }
    }
    await doUpdateVaccineCount(currLoc.value.address.city, vaccineCount);
    window.location.reload(true);
  };

  async function notify(location: string) {
    let res = await sendMessageBatch(
      `Vaccine Scheduler Alert: New vaccines have been added to the ${location} location. Log into your account to schedule a shot today!`
    );
    if (res.status == 200) {
      alert("Batch sent successfully");
    } else {
      alert("Batch failed to send");
    }
  }

  const buildCard = (currLoc: any, index: number) => {
    return (
      <TableRow key={index}>
        <TableCell component="th" scope="row">
          {currLoc.value.address.city}
        </TableCell>
        <TableCell align="right">{currLoc.value.numVaccines}</TableCell>
        <TableCell align="right">
          {currLoc.value.numVaccines != 0 ? (
            <Button
              variant="contained"
              className={classes.button}
              onClick={(e) => {
                e.preventDefault();
                doDecrementVaccines(currLoc);
              }}
            >
              Decrease Vaccines by 1
            </Button>
          ) : (
            ""
          )}
        </TableCell>
        <TableCell align="right">
          {currLoc.value.numVaccines >= 0 ? (
            <Button
              variant="contained"
              className={classes.button}
              onClick={(e) => {
                e.preventDefault();
                doIncrementVaccines(currLoc);
              }}
            >
              Increase Vaccines by 1
            </Button>
          ) : (
            ""
          )}
        </TableCell>
        <TableCell align="right">
          <ThemeProvider theme={theme}>
            <Button
              className="alert-btn"
              onClick={() => {
                notify(currLoc.value.address.city);
              }}
              variant="contained"
              color="secondary"
            >
              Send Alert
            </Button>
          </ThemeProvider>
        </TableCell>
      </TableRow>
    );
  };

  if (locations) {
    card =
      locations &&
      locations.map((currLoc, index) => {
        return buildCard(currLoc, index);
      });
  }

  if (currentUser.email !== "admin@stevens.edu") {
    return <Redirect to="/user" />;
  } else {
    return (
      <div>
        <Header
          doesGoToProfile={false}
          doesGoToScheduler={false}
          doesSignOut={true}
          doesEdit={false}
        />
        <h1>Covid Scheduler</h1>
        <p>Admin Home Page</p>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell> City/Town</TableCell>
                <TableCell align="right">Number of Vaccines</TableCell>
                <TableCell align="right">Decrease Vaccines</TableCell>
                <TableCell align="right">Increase Vaccines</TableCell>
                <TableCell align="right">Notify Subscribers</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{card}</TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}

export default AdminHomePage;
