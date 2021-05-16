import "./components.css";
import {Button} from "@material-ui/core";
import SignOut from "../components/SignOut"

type HeaderProps = {
  doesGoToProfile: boolean,
  doesGoToScheduler: boolean,
  doesSignOut: boolean, 
  doesEdit: boolean, 
}

const Header = ({ doesGoToProfile, doesGoToScheduler, doesSignOut, doesEdit }: HeaderProps) => {

  return (
    <div className="header">
      <a href="/"><h1 className="header-title">Covid-19 Scheduler</h1></a>
        {doesGoToProfile ? 	<a href="/info"><Button variant="contained" color="secondary">Profile Info</Button></a> : null }
		{doesEdit ? <a href="/profile"><Button variant="contained" color="secondary">Edit Profile</Button></a>: null}
        {doesGoToScheduler ? <a href="/user"><Button variant="contained" color="secondary">Book Appointments</Button></a> : null}
		{doesSignOut ? <SignOut/> : null}

    </div>
  );
}

export default Header;
