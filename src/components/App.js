import React from "react";
import SignUp from "./auth/SignUp";
import SignIn from "./auth/SignIn";
import ForgotPassword from "./auth/ForgotPassword";
import UpdateProfile from "./auth/UpdateProfile";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import MoreInfo from "./Food/MoreInfo";
import Feed from "./Feed/Feed";
import NewNavBar from "./nav/NewNavBar";
import Profile from "./profile/Profile";
import RecipeSearch from "./Food/RecipeSearch";
import Chat from "./Chat/Chat";
import CreateRecipe from "./create-recipe/CreateRecipe";
import MyFavourites from "./MyFavourites";
import MyRecipes from "./MyRecipes";
//import food from "../../src/css/food_pattern_repeating.jpg";

//style={{ maxWidth: "450px" }} for main div container
{
  /* <div className="App" style={{ backgroundImage: `url(${food})` }}> */
}

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <NewNavBar />
          <br />
          <Switch>
            <PrivateRoute path="/create-recipe" component={CreateRecipe} />
            <PrivateRoute path="/my-favourites" component={MyFavourites} />
            <PrivateRoute path="/my-recipes" component={MyRecipes} />
            <PrivateRoute path="/chat" component={Chat} />
            <PrivateRoute path="/more-info" component={MoreInfo} />
            <PrivateRoute path="/profile" component={Profile} />
            <Route path="/sign-up" component={SignUp} />
            <Route path="/sign-in" component={SignIn} />
            <PrivateRoute path="/update-profile" component={UpdateProfile} />
            <Route path="/forgot-password" component={ForgotPassword} />
            <PrivateRoute path="/feed" component={Feed} />
            <PrivateRoute path="/recipe-search" component={RecipeSearch} />
            <Route exact path="/" component={SignIn} />
          </Switch>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
