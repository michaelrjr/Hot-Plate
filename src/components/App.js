import React from "react";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
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
import CreateRecipe from "./CreateRecipe";
import MyRecipes from "./MyRecipes";
import MyRecipes2 from "./MyRecipes2";
import NewNavBar from "./NewNavBar";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <NewNavBar />
          <br />
          <Switch>
            <PrivateRoute path="/createrecipe" component={CreateRecipe} />
            <PrivateRoute path="/myrecipes" component={MyRecipes} />
            <PrivateRoute path="/myrecipes2" component={MyRecipes2} />
            <PrivateRoute path="/chat" component={Chat} />
            <PrivateRoute path="/moreinfo" component={MoreInfo} />
            <PrivateRoute path="/profile" component={Profile} />
            <Route path="/signUp" component={SignUp} />
            <Route path="/signIn" component={SignIn} />
            <PrivateRoute path="/update-profile" component={UpdateProfile} />
            <Route path="/forgotPassword" component={ForgotPassword} />
            <PrivateRoute path="/feed" component={Feed} />
            <PrivateRoute path="/recipesearch" component={RecipeSearch} />
            <Route exact path="/" component={SignIn} />
          </Switch>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
