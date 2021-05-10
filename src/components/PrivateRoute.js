import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
export default function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser, isSignedIn } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        console.log(props);
        return currentUser ? <Component {...props} /> : <Redirect to="/sign-in" />;
      }}></Route>
  );
}
