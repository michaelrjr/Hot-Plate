import React from "react";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import Dashboard from "./Dashboard";
import ForgotPassword from "./ForgotPassword";
import UpdateProfile from "./UpdateProfile";
import { AuthProvider } from "./AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
function App() {
  return (
    <AuthProvider>
      <div className="App">
        <div className="container">
          <Router>
            <Switch>
              <PrivateRoute exact path="/" component={Dashboard} />
              <PrivateRoute path="/updateProfile" component={UpdateProfile} />
              <Route path="/signUp" component={SignUp} />
              <Route path="/signIn" component={SignIn} />
              <Route path="/forgotPassword" component={ForgotPassword} />
            </Switch>
          </Router>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
