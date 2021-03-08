import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
//import { BiRestaurant } from "react-icons/bi";
import { BiFoodMenu } from "react-icons/bi";
import { BsChatDots } from "react-icons/bs";

export default function NavBar() {
  return (
    <div className="navbar">
      <Link
        className="navbar__item"
        to="/feed"
        style={{ textDecoration: "none" }}
      >
        <div className="navbar__icon">
          <AiOutlineHome size={30} />
        </div>
        <div>Feed</div>
      </Link>
      <Link
        className="navbar__item"
        to="/profile"
        style={{ textDecoration: "none" }}
      >
        <div className="navbar__icon">
          <CgProfile size={30} />
        </div>
        <div>Profile</div>
      </Link>
      <Link
        className="navbar__item"
        to="/recipesearch"
        style={{ textDecoration: "none" }}
      >
        <div className="navbar__icon">
          <BiFoodMenu size={30} />
        </div>
        <div>Food</div>
      </Link>
      <Link
        className="navbar__item"
        to="/chat"
        style={{ textDecoration: "none" }}
      >
        <div className="navbar__icon">
          <BsChatDots size={30} />
        </div>
        <div>Chat</div>
      </Link>
    </div>
  );
}
