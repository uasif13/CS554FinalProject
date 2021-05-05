import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import UserHomePage from "./components/UserHomePage";
import ProfilePage from "./components/ProfilePage";
import Schedule from "./components/Schedule";

function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path="/" component={Home} />
        <Route exact path="/login">
          <Login admin={false} />
        </Route>
        <Route exact path="/login/admin">
          <Login admin={true} />
        </Route>
        <Route exact path="/register" component={Register} />
        <Route exact path="/userhomepage" component={UserHomePage} />
        <Route exact path="/profile" component={ProfilePage} />
        <Route exact path="/schedule" component={Schedule} />
      </div>
    </Router>
  );
}

export default App;
