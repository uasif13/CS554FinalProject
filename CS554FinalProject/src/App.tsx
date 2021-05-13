import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/logins/Login";
import LoginAdmin from "./components/logins/LoginAdmin";
import Register from "./components/logins/Register";
import UserHomePage from "./components/UserHomePage";
import AdminHomePage from "./components/AdminHomePage";
import ProfilePage from "./components/insurance/ProfilePage";
import Schedule from "./components/Schedule";
import NotFound from "./components/NotFound";
import Reset from "./components/logins/Reset";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login">
            <Login admin={false} />
          </Route>
          <Route exact path="/login/admin">
            <LoginAdmin admin={true} />
          </Route>
          <Route exact path="/register" component={Register} />
          <Route exact path="/userhomepage" component={UserHomePage} />
          <Route exact path="/profile" component={ProfilePage} />
          <Route exact path="/schedule" component={Schedule} />
          <Route exact path="/adminhomepage" component={AdminHomePage} />
		  <Route exact path="/reset" component={Reset} />
		  <Route exact path="*" component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
