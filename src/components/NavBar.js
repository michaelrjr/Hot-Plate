import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { BiFoodMenu } from "react-icons/bi";
import { BsChatDots } from "react-icons/bs";
import { GrRestaurant } from "react-icons/gr";
import { RiRestaurantLine } from "react-icons/ri";

export default function NavBar() {
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
      </div>
    </nav>
  );
}
