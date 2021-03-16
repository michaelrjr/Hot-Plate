import React, { useState, useEffect } from "react";
import SignOut from "./SignOut";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import app from "../firebase";

export default function Profile() {
  const [error, setError] = useState("");
  const { currentUser } = useAuth();
  const [userDetails, setUserDetails] = useState([]);
  const [fileURL, setFileURL] = useState(null);
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
          console.log("Does get in here?");
        }
        console.log("Gets in here");
      })
      .catch((error) => {
        setError("Error retrieving user details");
      });
      console.log("userDetails: "+userDetails);
  };

  const handleUploadSubmit = async (e) => {
    console.log(fileURL);
    e.preventDefault();
    ref.doc(currentUser.email).update({ avatar: fileURL });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const storageRef = app.storage().ref();
    const fileRef = storageRef.child(file.name);
    await fileRef.put(file);
    setFileURL(await fileRef.getDownloadURL());
  };

  return (
    <div>
      {userDetails.map((user) => (
        <div className="card" key={user.email}>
          <div className="card-body">
            <h3 className="card-title text-center mb-3">Profile</h3>
            <div className="d-flex justify-content-center">
              {user.avatar === null ? (
                <img
                  className="rounded-circle mb-3"
                  src="defaultuser.png"
                  width="150"
                  height="150"
                />
              ) : (
                <img
                  className="rounded-circle mb-3"
                  src={user.avatar}
                  width="150"
                  height="150"
                />
              )}
            </div>
            <div>
              <form onSubmit={handleUploadSubmit}>
                <input type="file" onChange={handleFileChange} />

                <button type="submit" className="btn btn-warning">
                  Upload
                </button>
              </form>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

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

            <div className="mb-3">
              <SignOut setError={setError} />
            </div>
            <div>
              <Link to="/updateProfile">
                <button className="btn btn-info w-100">Update profile</button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
