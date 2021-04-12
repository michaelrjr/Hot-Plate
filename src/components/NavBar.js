import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { BiFoodMenu } from "react-icons/bi";
import { BsChatDots } from "react-icons/bs";
import { GrRestaurant } from "react-icons/gr";
import { RiRestaurantLine } from "react-icons/ri";
import { FiSettings } from "react-icons/fi";
import SignOut from "./SignOut";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import NavBar2 from "./NavBar2";

export default function NavBar() {
  const { currentUser } = useAuth();

  const [error, setError] = useState("");

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
          <Navbar.Collapse id="responsive-navbar-nav">
            <div className="container d-flex justify-content-between">
              <Nav className="m-auto container-fluid">
                <div>
                  <Link to="/feed">
                    <div>
                      <AiOutlineHome size={30} />
                    </div>
                    <div>Feed</div>
                  </Link>
                </div>
                <div>
                  <Link to="/recipesearch">
                    <div>
                      <BiFoodMenu size={30} />
                    </div>
                    <div>Food</div>
                  </Link>
                </div>
                <div>
                  <Link to="/chat">
                    <div>
                      <BsChatDots size={30} />
                    </div>
                    <div>Chat</div>
                  </Link>
                </div>
                <Dropdown drop="left">
                  <Dropdown.Toggle>
                    <FiSettings size={30} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="text-center">
                    <Dropdown.Item>
                      <Link to="/profile">
                        <div>
                          <CgProfile size={30} />
                        </div>
                        <div>Profile</div>
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Link to="/createrecipe">
                        <div>
                          <GrRestaurant size={30} />
                        </div>
                        <div>Create Recipe</div>
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Link to="/myrecipes">
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
