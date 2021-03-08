import React, { useState } from "react";
import SignOut from "./SignOut";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function Profile() {
  const [error, setError] = useState("");
  const { currentUser } = useAuth();

  return (
    <div className="container">
      <div className="card">
        <div>{error && <div className="errorMsg">{error}</div>}</div>
        <div className="card-body">
          <div className="card-title">
            <h3>Profile</h3>
          </div>
          <div className="form-group">
            <strong>Email:</strong> {currentUser.email}
          </div>
          <SignOut setError={setError} />
          <Link to="/updateProfile">
            <button className="updateBtn">Update profile</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
