import React, { useEffect, useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import { auth, db } from "../firebase/firebaseServer";
import { doIncrementVaccines } from "../firebase/firebaseFunctions";
import { doDecrementVaccines } from "../firebase/firebaseFunctions";
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
import SignOutButton from "./SignOut";
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
  id: currLocation;
}

function AdminHomePage() {
  const { currentUser } = useContext(AuthContext);
  const [locations, setLocations] = useState<Array<Location>>([]);
  const classes = useStyles();
  const [admin, setAdmin] = useState<Boolean>(true);

  let allLocations: Location[] = [];
  let card = null;

  useEffect(() => {
    async function fetchData() {
      try {
        // Calls to Firebase to refer to Location child
        db.ref("Locations").on("value", (snapshot) => {
          snapshot.forEach((snap) => {
            allLocations.push(snap.val());
          });
          setLocations(allLocations);
        });
      } catch (e) {
        console.log(e);
      }
    }
    async function checkAdminPermissions() {
      try {
        db.ref("Users").on("value", (snapshot) => {
          snapshot.forEach((snap) => {
            if (snap.val().email === currentUser.email) {
              setAdmin(snap.val().isAdmin);
            }
          });
        });
      } catch (e) {
        alert(e);
      }
    }
    fetchData();
    checkAdminPermissions();
  }, []);

  const buildCard = (currLoc: any, index: number) => {
    return (
      <TableRow key={index}>
        <TableCell component="th" scope="row">
          {currLoc.address.city}
        </TableCell>
        <TableCell align="right">
          {currLoc.numVaccines && currLoc.numVaccines > 1
            ? "Available"
            : "Fully Booked"}
        </TableCell>
        <TableCell align="right">
          {currLoc.numVaccines ? (
            <Button
              variant="contained"
              className={classes.button}
              onClick={(e) => {
                e.preventDefault();
                doDecrementVaccines(currLoc);
              }}
            >
              Increase Vaccines by 1
            </Button>
          ) : (
            ""
          )}
        </TableCell>
        <TableCell align="right">
          {currLoc.numVaccines ? (
            <Button
              variant="contained"
              className={classes.button}
              onClick={(e) => {
                e.preventDefault();
                doIncrementVaccines(currLoc);
              }}
            >
              Decrease Vaccines by 1
            </Button>
          ) : (
            ""
          )}
        </TableCell>
        <TableCell align="right">
          <Button variant="contained" color="secondary">
            Send Alert
          </Button>
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

  if (!admin) {
    return <Redirect to="/user" />;
  } else {
    return (
      <div>
        <SignOutButton />
        <h1>Covid Scheduler</h1>
        <p>Admin Home Page</p>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell> City/Town</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right">Increase Vaccines</TableCell>
                <TableCell align="right">Decrease Vaccines</TableCell>
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
