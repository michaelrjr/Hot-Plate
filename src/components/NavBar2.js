import React, { useState } from "react";
import { Navbar } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import app from "../firebase";

export default function NavBar2() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, currentUser } = useAuth();
  const history = useHistory();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  // db ref
  const ref = app.firestore().collection("Users");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      // sign a user in with email and password
      await signIn(email, password);
      history.push("/recipesearch");
    } catch {
      setError("Error, incorrect email or password. Please try again.");
    }
    // update online to true if sign in is successful

    ref.doc(email).update({ online: true });
  };
  return (
    <Navbar collapseOnSelect expand="lg" bg="light" fixed="top">
      <Navbar.Brand>
        <img src="hotPlate_Logo_Full_gradient_fullcol_240x90.svg" width="150" alt="logo" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse className="justify-content-end" id="responsive-navbar-nav">
        <form onSubmit={handleSignInSubmit}>
          <div className="d-flex">
            <div className="mr-2">
              <input className="form-control mr-sm-2" placeholder="Enter email" onChange={handleEmailChange} />
            </div>
            <div className="mr-2">
              <input
                type="password"
                className="form-control mr-sm-2"
                placeholder="Enter password"
                onChange={handlePasswordChange}
              />
            </div>
            <div>
              <button type="submit" className="btn btn-primary">
                Sign in
              </button>
            </div>
          </div>
        </form>
      </Navbar.Collapse>
    </Navbar>
  );
}
