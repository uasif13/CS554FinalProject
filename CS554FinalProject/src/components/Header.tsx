import "./components.css";
import {Button} from "@material-ui/core";
import SignOut from "../components/SignOut"
import { useHistory } from "react-router-dom";
type HeaderProps = {
  doesGoToProfile: boolean,
  doesGoToScheduler: boolean,
  doesSignOut: boolean, 
  doesEdit: boolean, 
}
const Header = ({ doesGoToProfile, doesGoToScheduler, doesSignOut, doesEdit }: HeaderProps) => {
	const history = useHistory();
	const handleProfile = () => {
		history.push("/info");
	}
	const handleEdit = () => {
		history.push('/profile');
	};
	const handleUser = () => {
		history.push('/user');
	}
  return (
    <div className="header">
      <a href="/"><h1 className="header-title">Covid-19 Scheduler</h1></a>
        {doesGoToProfile ? 	<Button onClick = {handleProfile} variant="contained" color="secondary">Profile Info</Button> : null }
		{doesEdit ? <Button onClick = {handleEdit}variant="contained"color="secondary">Edit Profile</Button>: null}
        {doesGoToScheduler ? <Button onClick = {handleUser} variant="contained" color="secondary">Book Appointments</Button>: null}
		{doesSignOut ? <SignOut/> : null}
    </div>
  );
}
export default Header;
