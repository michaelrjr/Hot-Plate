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
  const [fileName, setFileName] = useState("");
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
        tempArr.push(doc.data());
        setUserDetails(tempArr);
      })
      .catch((error) => {
        setError("Error retrieving user details");
      });
  };

  const handleUploadSubmit = async (e) => {
    console.log(fileURL);
    e.preventDefault();
    ref.doc(currentUser.email).update({ avatar: fileURL });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setFileName(e.target.files[0].name);
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
            <div className="d-flex justify-content-center mb-3">
              {user.avatar === null ? (
                <img
                  className="rounded-circle "
                  src="defaultuser.png"
                  width="150"
                  height="150"
                />
              ) : (
                <img
                  className="rounded-circle "
                  src={user.avatar}
                  width="150"
                  height="150"
                />
              )}
            </div>
            <div className="mb-3">
              <form onSubmit={handleUploadSubmit}>
                <div className="custom-file mb-3">
                  <input
                    type="file"
                    className="custom-file-input"
                    id="file-upload"
                    onChange={handleFileChange}
                  />
                  {fileName ? (
                    <label className="custom-file-label" htmlFor="file-upload">
                      {fileName}
                    </label>
                  ) : (
                    <label className="custom-file-label" htmlFor="file-upload">
                      Choose profile image...
                    </label>
                  )}
                </div>
                <div>
                  <button type="submit" className="btn btn-warning w-100">
                    Upload
                  </button>
                </div>
              </form>
            </div>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <div key={user.email}>
              <div className="mb-3">
                <strong>First name:</strong> {user.firstName}
              </div>
              <div className="mb-3">
                <strong>Last name:</strong> {user.lastName}
              </div>
              <div className="mb-3">
                <strong>Email:</strong> {user.email}
              </div>
              <div className="mb-3">
                <strong>Joined:</strong> {user.joined}
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
