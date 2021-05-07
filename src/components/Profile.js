import React, { useState, useEffect } from "react";
import SignOut from "./SignOut";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import app from "../firebase";
import { Modal } from "react-bootstrap";
import { BsTrash } from "react-icons/bs";

export default function Profile() {
  const [error, setError] = useState("");
  const { currentUser } = useAuth();
  const [userDetails, setUserDetails] = useState([]);
  const [fileURL, setFileURL] = useState(null);
  const [fileName, setFileName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  // db ref
  const ref = app.firestore().collection("Users");

  useEffect(() => {
    getUserDetails();
  }, []);

  // get the current users details from firestore
  const getUserDetails = () => {
    setIsLoading(true);
    ref
      .doc(currentUser.email)
      .get()
      .then((doc) => {
        let tempArr = [];
        tempArr.push(doc.data());
        console.log(tempArr);
        setUserDetails(tempArr);
        setIsLoading(false);
      })
      .catch((error) => {
        setError("Error retrieving user details");
      });
  };

  // when the user clicks "upload" update that users avatar image
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(fileURL);
    await ref.doc(currentUser.email).update({ avatar: fileURL });
    getUserDetails();
  };

  const removeProfilePicture = async () => {
    await ref.doc(currentUser.email).update({ avatar: null });
    getUserDetails();
    setShowDeleteModal(false);
  };

  // handles the users uploaded image
  const handleFileChange = async (e) => {
    setFileName("");
    const file = e.target.files[0];
    setFileName(e.target.files[0].name);
    let i = file.name.indexOf(".");
    console.log(i);
    let s = file.name.substring(i + 1, file.name.length);
    console.log(s);
    if (s != "jpg" && s !== "png") {
      return setErrorMsg("Only png and jpg files are supported.");
    }
    setErrorMsg("");
    const storageRef = app.storage().ref(); //firebase storage ref
    const fileRef = storageRef.child(file.name);
    await fileRef.put(file); // put file in storage
    setFileURL(await fileRef.getDownloadURL());
  };

  if (isLoading) {
    return (
      <div className="container-fluid">
        <div className="d-flex">
          <strong className="mr-3">
            <h3>Loading..</h3>
          </strong>
          <div className="spinner-border" role="status" aria-hidden="true"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container d-flex justify-content-center" style={{ minHeight: "100%" }}>
      <div className="w-100" style={{ maxWidth: "450px" }}>
        <div>
          {userDetails.map((user) => (
            <div className="card mb-3" key={user.email}>
              <div className="card-body">
                <h3 className="card-title text-center mb-3">Profile</h3>
                <div className="d-flex justify-content-center mb-3">
                  {user.avatar === null ? (
                    <img className="rounded-circle" src="defaultuser.png" width="150" height="150" />
                  ) : (
                    <div style={{ position: "relative" }}>
                      <img className="rounded-circle" src={user.avatar} width="150" height="150" />
                      <div
                        style={{ position: "absolute", top: "0", right: "0", cursor: "pointer" }}
                        onClick={() => setShowDeleteModal(true)}>
                        <BsTrash />
                      </div>
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <form onSubmit={handleSubmit}>
                    <div className="custom-file mb-3">
                      <input
                        type="file"
                        className="custom-file-input"
                        id="image"
                        name="image"
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
                    {errorMsg && (
                      <div className="alert alert-danger" role="alert">
                        {errorMsg}
                      </div>
                    )}
                    <div>
                      <button type="submit" className="btn btn-warning w-100">
                        Upload
                      </button>
                    </div>
                  </form>
                </div>

                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                  <Modal.Header>
                    <Modal.Title>Are you sure you want to delete your profile picture?</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <button className="btn btn-secondary btn-md" onClick={() => setShowDeleteModal(false)}>
                      Cancel
                    </button>
                    <button className="btn btn-danger btn-md float-right" onClick={removeProfilePicture}>
                      Yes
                    </button>
                  </Modal.Body>
                </Modal>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <div key={user.email}>
                  <div className="mb-1">
                    <strong>First name:</strong> {user.firstName}
                  </div>
                  <div className="mb-1">
                    <strong>Last name:</strong> {user.lastName}
                  </div>
                  <div className="mb-1">
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
                  <Link to="/update-profile">
                    <button className="btn btn-info w-100">Update profile</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
