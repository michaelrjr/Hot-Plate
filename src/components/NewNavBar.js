import React, {useState} from "react";
import { Link } from "react-router-dom";
import NavBar2 from "./NavBar2";
import { useAuth } from "../contexts/AuthContext";
import { Navbar, Nav } from "react-bootstrap";
import { AiOutlineHome } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { BiFoodMenu } from "react-icons/bi";
import { BsChatDots } from "react-icons/bs";
import { GrRestaurant } from "react-icons/gr";
import { RiRestaurantLine } from "react-icons/ri";
import { useHistory } from "react-router-dom";
import app from "../firebase";
import SignOut from "./SignOut";

export default function NewNavBar() {
  const { currentUser, signOut } = useAuth();
  const history = useHistory();
  //database ref
  const ref = app.firestore().collection("Users");
  const [expanded, setExpanded] = useState(false);

  const width = window.screen.width;

  return (
    <div>
      {currentUser === null ? (
        <NavBar2 />
      ) : (
        <Navbar collapseOnSelect expand="lg" bg="light" fixed="top" expanded={expanded}>
          <Navbar.Brand className="mr-5">
            <Link to="/">
              <img src="hotPlate_Logo_Full_gradient_fullcol_240x90.svg" width="150" alt="logo" />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={() => setExpanded(expanded ? false : "expanded")} />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Link className="link mr-5" to="/feed" onClick={() => setExpanded(false)} >
                <div>
                  <AiOutlineHome size={20} />
                </div>
                <div>Feed</div>
              </Link>
              <Link className="link mr-5" to="/recipesearch" onClick={() => setExpanded(false)}>
                <div>
                  <BiFoodMenu size={20} />
                </div>
                <div>Food</div>
              </Link>
              <Link className="link mr-5" to="/chat" onClick={() => setExpanded(false)}>
                <div>
                  <BsChatDots size={20} />
                </div>
                <div>Chat</div>
              </Link>
              <Link className="link mr-5" to="/profile" onClick={() => setExpanded(false)}>
                <div>
                  <CgProfile size={20} />
                </div>
                <div>Profile</div>
              </Link>
              <Link className="link mr-5" to="/createrecipe" onClick={() => setExpanded(false)}>
                <div>
                  <GrRestaurant size={20} />
                </div>
                <div>Create Recipe</div>
              </Link>
              <Link className="link mr-5" to="/myrecipes" onClick={() => setExpanded(false)}>
                <div>
                  <RiRestaurantLine size={20} />
                </div>
                <div>My Favourites</div>
              </Link>
              <Link className="link mr-5" to="/myrecipes2" onClick={() => setExpanded(false)}>
                <div>
                  <RiRestaurantLine size={20} />
                </div>
                <div>My Recipes</div>
              </Link>
            </Nav>
            <div>
              <SignOut />
            </div>
          </Navbar.Collapse>
        </Navbar>
      )}
    </div>
  );
}
