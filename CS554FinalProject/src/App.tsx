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
import { AuthProvider } from "./firebase/firebaseAuth";
import PrivateRoute from "./PrivateRoute";


function App() {
  return (
    <AuthProvider>
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
            <PrivateRoute exact path="/user" component={UserHomePage} />
            <PrivateRoute exact path="/profile" component={ProfilePage} />
            <PrivateRoute exact path="/schedule" component={Schedule} />
            <PrivateRoute exact path="/admin" component={AdminHomePage} />
			      <Route exact path="/reset" component={Reset} />
            <Route exact path="*" component={NotFound} />
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
