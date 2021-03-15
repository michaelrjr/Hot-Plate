import React, { useState, useEffect } from "react";
import SignOut from "./SignOut";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import app from "../firebase";

export default function Profile() {
  const [error, setError] = useState("");
  const { currentUser } = useAuth();
  const [userDetails, setUserDetails] = useState([]);
  // db ref
  const ref = app.firestore().collection("Users");

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = () => {
    ref
      .doc(currentUser.email)
      .get()
      .then((doc) => {
        let tempArr = [];
        if (doc.exists) {
          tempArr.push(doc.data());
          setUserDetails(tempArr);
        }
      })
      .catch((error) => {
        setError("Error retrieving user details");
      });
  };

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title text-center mb-4">Profile</h3>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        {userDetails.map((user) => (
          <div key={user.email}>
            <div className="mb-3">
              <strong>First Name:</strong> {user.firstName}
            </div>
            <div className="mb-3">
              <strong>Last Name:</strong> {user.lastName}
            </div>
            <div className="mb-3">
              <strong>Email:</strong> {user.email}
            </div>
          </div>
        ))}
        <div className="mb-3">
          <SignOut setError={setError} />
        </div>
        <div className="mb-3">
          <Link to="/updateProfile">
            <button className="btn btn-info w-100">Update profile</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
