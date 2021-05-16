import React, { useEffect, useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import { auth, db } from "../firebase/firebaseServer";
import { doUpdateVaccineCount, getCurrUserData } from "../firebase/firebaseFunctions";
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
import SignOutButton from "./SignOut";
import { AuthContext } from "../firebase/firebaseAuth";
import { sendMessageBatch } from "../messaging/message";

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
  let vaccineCount = 0;
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
        let data = await getCurrUserData();
        setAdmin(data.isAdmin);
      } catch (e) {
        alert(e);
      }
    }
    fetchData();
    checkAdminPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doDecrementVaccines =  async (currLoc: any) => {
    console.log(currLoc.address.city);
    vaccineCount = currLoc.numVaccines;
    if(vaccineCount > 0)
    {
      vaccineCount=vaccineCount - 1;
    }
    console.log(vaccineCount);

  await doUpdateVaccineCount(currLoc.address.city, vaccineCount);
    window.location.reload(true);
   };

   const doIncrementVaccines = async (currLoc: any) => {
    console.log(currLoc);
    vaccineCount = currLoc.numVaccines;
    
      vaccineCount=vaccineCount +1;
    
    console.log(vaccineCount);
    await doUpdateVaccineCount(currLoc.address.city, vaccineCount);
    window.location.reload(true);
   };

  async function notify(location: string) {
    let res = await sendMessageBatch(`Vaccine Scheduler Alert: New vaccines have been added to the ${location} location. Log into your account to schedule a shot today!`);
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
          {currLoc.address.city}
        </TableCell>
        <TableCell align="right">
          {currLoc.numVaccines}
        </TableCell>
        <TableCell align="right">
          {currLoc.numVaccines !=0 ? (
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
          {currLoc.numVaccines >=0 ? (
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
          <Button onClick={() => {
            notify(currLoc.address.city);
          }
          } variant="contained" color="secondary">
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
		<Header doesGoToProfile={false} doesGoToScheduler={false} doesSignOut={true} doesEdit={false}/>
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
