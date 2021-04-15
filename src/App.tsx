import React, {useEffect, useState} from 'react'; 
import {auth, db} from './firebaseServer' 
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, makeStyles, Button} from '@material-ui/core'; 
import './App.css';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  button:{
    background: '#3D4CBC',
    color: 'white'
  }
});

interface address{ 
  city: string, 
  state: string, 
  street: string, 
  zip: string
};

interface currLocation{ 
  address: address, 
  numVaccines: number
};

interface Location{ 
  id: currLocation
};

function App() {
  const [locations, setLocations] = useState<Array<Location>>([]); 
  const classes = useStyles();

  let allLocations: Location[]= []; 
  let card = null; 

  useEffect(() => { 
    async function fetchData(){ 
      try{ 
        // Calls to Firebase to refer to Location child
        db.ref('Locations').on("value", snapshot =>{
          snapshot.forEach(snap => { 
            allLocations.push(snap.val()); 
          }); 
          setLocations(allLocations); 
        }); 

      }catch(e){ 
        console.log(e); 
      }
    }
    fetchData(); 

  }, []); 

  const buildCard =  (currLoc: any, index: number) => {
    return(
          <TableRow key={index}>
            <TableCell component="th" scope="row">
              {currLoc.address.city}
            </TableCell>
            <TableCell align="right">{currLoc.numVaccines && 
                          currLoc.numVaccines > 1 ? 
                          "Available" : "Fully Booked"} 
            </TableCell>
            <TableCell align="right">{currLoc.numVaccines && 
                        currLoc.numVaccines > 1 ? 
                        <Button variant="contained" className={classes.button}>Book</Button> : ""} 
            </TableCell>
          </TableRow>
    )
  }

  if (locations){
    card = locations && 
            locations.map((currLoc, index) =>{ 
              return buildCard(currLoc, index); 
            });
  }

  return(
    <div>
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
          <TableBody>
          {card}
          </TableBody>
          </Table>
      </TableContainer>
    </div>
  );
}

export default App;
