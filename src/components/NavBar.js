import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { BiFoodMenu } from "react-icons/bi";
import { BsChatDots } from "react-icons/bs";
import { GrRestaurant } from "react-icons/gr";
import { RiRestaurantLine } from "react-icons/ri";
import { useAuth } from "../contexts/AuthContext";
import app from "../firebase";
import SignOut from "./SignOut";
import { SettingsSystemDaydreamRounded } from "@material-ui/icons";

export default function NavBar() {
  const { currentUser } = useAuth();
  const db = app.firestore().collection("conversations");
  const [error, setError] = useState("");

  //query 'conversations' collection -> 'users' document (email address) -> collection 'messages'
  //in all the docs in messages collection where message is to current user, see if any are unread.
  function notify() {
    db.doc(`${currentUser.email}`)
      .collection("messages")
      .where("to", "==", currentUser.email)
      .where("read", "==", false)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.id, "=>", doc.data());
        });
      });
  }

//When a user logs in the above 'listener' query runs 
  if(currentUser != null) notify();

  return (
    <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link
          className="navbar__item"
          to="/feed"
          style={{ textDecoration: "none" }}>
          <div className="navbar__icon">
            <AiOutlineHome size={30} />
          </div>
          <div>Feed</div>
        </Link>
        <Link
          className="navbar__item"
          to="/recipesearch"
          style={{ textDecoration: "none" }}>
          <div className="navbar__icon">
            <BiFoodMenu size={30} />
          </div>
          <div>Food</div>
        </Link>
        <Link
          className="navbar__item"
          to="/createrecipe"
          style={{ textDecoration: "none" }}>
          <div className="navbar__icon" style={{ marginLeft: "30px" }}>
            <GrRestaurant size={30} />
          </div>
          <div>Create Recipe</div>
        </Link>
        <Link
          className="navbar__item"
          to="/myrecipes"
          style={{ textDecoration: "none" }}>
          <div className="navbar__icon" style={{ marginLeft: "25px" }}>
            <RiRestaurantLine size={30} />
          </div>
          <div>My Recipes</div>
        </Link>
        <Link
          className="navbar__item"
          to="/profile"
          style={{ textDecoration: "none" }}>
          <div className="navbar__icon" style={{ marginLeft: "7px" }}>
            <CgProfile size={30} />
          </div>
          <div>Profile</div>
        </Link>
        <Link
          className="navbar__item"
          to="/chat"
          style={{ textDecoration: "none" }}>
          <div className="navbar__icon">
            <BsChatDots size={30} />
          </div>
          <div>Chat</div>
        </Link>
        <div>
          <SignOut setError={setError} />
        </div>
      </div>
    </nav>
  );
}
          //UI change for if notify returns true or false
          //<div>{notify? "New Msg": "Chat"</div>