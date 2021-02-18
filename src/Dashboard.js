import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useHistory, Link } from "react-router-dom";
export default function Dashboard() {
  const [error, setError] = useState("");
  const { currentUser, signOut } = useAuth();
  const history = useHistory();

  const handleSignOut = async () => {
    setError("");
    try {
      await signOut();
      history.pushState("/signIn");
    } catch {
      setError("Failed to sign out");
    }
  };

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <div className="card">
        <div className="heading">
          <h3>Profile</h3>
        </div>
        <div>{error && <div className="errorMsg">error</div>}</div>
        <div className="form-group">
          <strong>Email:</strong> {currentUser.email}
        </div>
        <div>
          <button className="buttons" onClick={handleSignOut}>
            Sign out
          </button>
          <div>
            <Link to="/updateProfile">
              <button className="updateBtn">Update profile</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
