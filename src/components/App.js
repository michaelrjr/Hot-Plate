import React from "react";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import Dashboard from "./Dashboard";
import ForgotPassword from "./ForgotPassword";
import UpdateProfile from "./UpdateProfile";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import MoreInfo from "./MoreInfo";
import Feed from "./Feed";
import NavBar from "./NavBar";
import Profile from "./Profile";
import RecipeSearch from "./RecipeSearch";
import Chat from "./Chat";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <NavBar />
          <br />
          <Switch>
            <PrivateRoute exact path="/" component={Dashboard} />
            <Route path="/chat" component={Chat} />
            <Route path="/moreinfo" component={MoreInfo} />
            <Route path="/recipesearch" component={RecipeSearch} />
            <div
              className="container d-flex justify-content-center"
              style={{ minHeight: "100vh" }}
            >
              <div className="w-100" style={{ maxWidth: "400px" }}>
                <Route path="/signUp" component={SignUp} />
                <Route path="/signIn" component={SignIn} />
                <PrivateRoute path="/updateProfile" component={UpdateProfile} />
                <PrivateRoute path="/profile" component={Profile} />
                <Route path="/forgotPassword" component={ForgotPassword} />
                <Route path="/feed" component={Feed} />
              </div>
            </div>
          </Switch>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
