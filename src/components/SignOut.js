import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import app from "../firebase";

export default function SignOut(props) {
  const { currentUser, signOut } = useAuth();
  const history = useHistory();

  //database ref
  const ref = app.firestore().collection("Users");

  // sign out user
  const handleSignOut = async () => {
    // update online to false if sign out is successful
    ref.doc(currentUser.email).update({ online: false });
    try {
      await signOut();
      history.push("/");
    } catch (error) {
      throw error;
    }
  };
  return (
    <div>
      <button className="btn btn-danger w-100" onClick={handleSignOut}>
        Sign out
      </button>
    </div>
  );
}
