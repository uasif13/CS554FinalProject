import "./components.css";
import {Button} from "@material-ui/core";

type HeaderProps = {
  doesGoToProfile: boolean,
  doesGoToScheduler: boolean,
}

const Header = ({ doesGoToProfile, doesGoToScheduler }: HeaderProps) => {
  return (
    <div className="header">
      <a href="/">
        <h1 className="header-title">Covid-19 Scheduler</h1>
        {doesGoToProfile ? <a href="/profile"><Button variant="contained" color="secondary">Edit Profile</Button></a> : null}
        {doesGoToScheduler ? <a href="/userhomepage"><Button variant="contained" color="secondary">Book Appointments</Button></a> : null}
      </a>
    </div>
  );
}

export default Header;
