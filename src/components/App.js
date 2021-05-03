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
import Chat from "./Chat/Chat";
import CreateRecipe from "./CreateRecipe";
import MyRecipes from "./MyRecipes";
import MyRecipes2 from "./MyRecipes2";
import food from "../../src/css/food_pattern_repeating.jpg";

//style={{ maxWidth: "450px" }} for main div container

function App() {
  return (
    <AuthProvider>
      <div className="App" style={{ backgroundImage: `url(${food})` }}>
        <Router>
          <NavBar />
          <br />
          <Switch>
            <PrivateRoute path="/createrecipe" component={CreateRecipe} />
            <PrivateRoute path="/myrecipes" component={MyRecipes} />
            <PrivateRoute path="/myrecipes2" component={MyRecipes2} />
            <PrivateRoute path="/chat" component={Chat} />
            <PrivateRoute path="/moreinfo" component={MoreInfo} />
            <div className="container d-flex justify-content-center" style={{ minHeight: "100%" }}>
              <div className="w-100" style={{ maxWidth: "450px" }}>
                <Route path="/signUp" component={SignUp} />
                <Route path="/signIn" component={SignIn} />
                <PrivateRoute path="/update-profile" component={UpdateProfile} />
                <PrivateRoute path="/profile" component={Profile} />
                <Route path="/forgotPassword" component={ForgotPassword} />
                <PrivateRoute path="/feed" component={Feed} />
                <PrivateRoute path="/recipesearch" component={RecipeSearch} />
              </div>
            </div>
          </Switch>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
