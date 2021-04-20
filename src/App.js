import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";

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
      </div>
    </Router>
  );
}

export default App;
