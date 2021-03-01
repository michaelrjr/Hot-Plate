import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useHistory, Link } from "react-router-dom";
import UserFeedInputBox from "./UserFeedInputBox";
import UserFeed from "./UserFeed";
import app from "../firebase";
import { firebase } from "@firebase/app";
import RecipeSearch from "./RecipeSearch";

export default function Dashboard() {
  const [error, setError] = useState("");
  const { currentUser, signOut } = useAuth();
  const [userFeed, setUserFeed] = useState([]);
  const [post, setPost] = useState("");
  const history = useHistory();

  let mounted = true;

  //database ref
  const ref = app.firestore().collection("userFeed");

  useEffect(() => {
    getData();
    return () => {
      mounted = false;
    };
  }, []);

  const getData = () => {
    ref.orderBy("timestamp", "desc").onSnapshot((snapshot) => {
      setUserFeed(snapshot.docs.map((doc) => doc.data()));
    });
    setPost("");
  };

  const handleSignOut = async () => {
    setError("");
    try {
      await signOut();
      history.pushState("/signIn");
    } catch {
      setError("Failed to sign out");
    }
  };

  const handlePostClick = (e) => {
    e.preventDefault();
    ref
      .add({
        email: currentUser.email,
        post: post,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });

    //getData();
  };

  const handleInputBoxChange = (e) => {
    setPost(e.target.value);
  };

  if (error) {
    return (
      <div>
        <h3>Error</h3>
      </div>
    );
  } else {
    return (
      <div className="container">
        <h1 style={{ textAlign: "center" }}>Dashboard</h1>
        <div className="row">
          <div className="col">
            <UserFeedInputBox
              handlePostClick={handlePostClick}
              post={post}
              handleInputBoxChange={handleInputBoxChange}
            />
            <hr />
            <UserFeed userFeed={userFeed} />
          </div>
          <div className="col">
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
                <div>
                  <Link to="/chatComponents/chatMessages">
                    <button className="updateBtn">Chat</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <RecipeSearch/>
          </div>
        </div>
      </div>
    );
  }
}
