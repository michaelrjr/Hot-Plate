import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { BiFoodMenu } from "react-icons/bi";
import { BsChatDots } from "react-icons/bs";
import { GrRestaurant } from "react-icons/gr";
import { RiRestaurantLine } from "react-icons/ri";
import { FiSettings } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { useAuth } from "../contexts/AuthContext";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import NavBar2 from "./NavBar2";
import app from "../firebase";
import SignOut from "./SignOut";

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

  //When a user logs in the above query runs listening for updates
  if (currentUser != null) notify();

  return (
    <div>
      {currentUser === null ? (
        <NavBar2 />
      ) : (
        <Navbar collapseOnSelect expand="lg" bg="light" fixed="top">
          <Navbar.Brand>
            <img src="hotPlate_Logo_Full_gradient_fullcol_240x90.svg" width="150" alt="logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse className="justify-content-end" id="responsive-navbar-nav">
            <div className="container d-flex justify-content-between">
              <Nav className="m-auto container-fluid">
                <Link className="link text-center" to="/feed">
                  <div>
                    <AiOutlineHome size={30} />
                  </div>
                  <div>Feed</div>
                </Link>
                <Link className="link text-center" to="/recipesearch">
                  <div>
                    <BiFoodMenu size={30} />
                  </div>
                  <div>Food</div>
                </Link>
                <Link className="link text-center" to="/chat">
                  <div>
                    <BsChatDots size={30} />
                  </div>
                  <div>Chat</div>
                </Link>
                <Dropdown>
                  <Dropdown.Toggle className="dropdown-toggle text-center shadow-none">
                    <FiSettings size={30} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="text-center">
                    <Dropdown.Item>
                      <Link className="link" to="/profile">
                        <div>
                          <CgProfile size={30} />
                        </div>
                        <div>Profile</div>
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Link className="link" to="/createrecipe">
                        <div>
                          <GrRestaurant size={30} />
                        </div>
                        <div>Create Recipe</div>
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Link className="link" to="/myrecipes">
                        <div>
                          <RiRestaurantLine size={30} />
                        </div>
                        <div>My Recipes</div>
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <div>
                        <SignOut setError={setError} />
                      </div>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
            </div>
          </Navbar.Collapse>
        </Navbar>
      )}
    </div>
  );
}
