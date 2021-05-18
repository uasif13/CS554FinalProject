import React, { useEffect, useState, useContext } from "react";
import { db } from "../firebase/firebaseServer";
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
import { Redirect, useHistory } from "react-router-dom";
import Header from "./Header";
import { getCurrUserData } from "../firebase/firebaseFunctions";
import { Alert } from "@material-ui/lab";
import { AuthContext } from "../firebase/firebaseAuth";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  button: {
    background: "#3D4CBC",
    color: "white",
  },
});

interface address {
  city: string;
  state: string;
  street: string;
  zip: string;
}

interface currLocation {
  address: address;
  numVaccines: number;
}

interface Location {
  key: string | null;
  val: currLocation;
}

function UserHomePage() {
  const { currentUser } = useContext(AuthContext);
  const [locations, setLocations] = useState<Array<Location>>([]);
  const [userData, setUserData] = useState(Object);
  const classes = useStyles();
  const history = useHistory<currLocation>();

  let allLocations: Location[] = [];
  let card = null;

  useEffect(() => {
    async function fetchData() {
      try {
        let data = await getCurrUserData();
        setUserData(data);
        db.ref()
          .child("Locations")
          .on("value", (snapshot) => {
            snapshot.forEach((snap) => {
              let id = snap.key;
              let val = snap.val();
              allLocations.push({ key: id, val: val });
            });
            setLocations(allLocations);
          });
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const BookAppointment = (location: any) => {
    history.push("/schedule", location);
  };

  const buildCard = (location: any) => {
    let index = location.key;
    let currLoc = location.val;
    return (
      <TableRow key={index}>
        <TableCell component="th" scope="row">
          {currLoc.address.city}
        </TableCell>
        <TableCell align="right">
          {currLoc.numVaccines && currLoc.numVaccines > 1 ? (
            <Alert severity="success">Available</Alert>
          ) : (
            <Alert severity="error">Fully Booked</Alert>
          )}
        </TableCell>
        <TableCell align="right">
          {userData && userData.insurance.id == "" ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                history.push("/profile");
              }}
            >
              Update Insurance Before Booking
            </Button>
          ) : currLoc.numVaccines &&
            currLoc.numVaccines > 1 &&
            userData &&
            !userData.appointments.booked ? (
            <Button
              variant="contained"
              className={classes.button}
              onClick={() => {
                BookAppointment(location);
              }}
            >
              Book
            </Button>
          ) : (
            ""
          )}
        </TableCell>
      </TableRow>
    );
  };

  if (locations) {
    card =
      locations &&
      locations.map((location) => {
        return buildCard(location);
      });
  }

  console.log("Locations", locations);
  if (currentUser.email === "admin@stevens.edu") {
    return <Redirect to="/admin" />;
  } else {
    return (
      <div>
        <Header
          doesGoToProfile={true}
          doesGoToScheduler={false}
          doesSignOut={true}
          doesEdit={true}
        />
        <h1>Covid Scheduler</h1>
        <p>User Home Page</p>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell> City/Town</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right">Book Appointment</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{card}</TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}

export default UserHomePage;
