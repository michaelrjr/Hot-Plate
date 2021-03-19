import React, { useState, useEffect } from "react";
import FeedInputBox from "./FeedInputBox";
import { useAuth } from "../contexts/AuthContext";
import app from "../firebase";
import { firebase } from "@firebase/app";
import DisplayPost from "./DisplayPost";

export default function Feed() {
  const { currentUser, signOut, handlePostClick } = useAuth();
  const [postArray, setPostArray] = useState([]);
  const [post, setPost] = useState("");

  let mounted;

  //database ref
  const ref = app.firestore().collection("feed");
  const userRef = app.firestore().collection("Users");

  useEffect(() => {
    getData();
    mounted = true;
    //getUserDetails();
  }, []);

  const getData = () => {
    ref.orderBy("timestamp", "desc").onSnapshot((snapshot) => {
      setPostArray(snapshot.docs.map((doc) => doc.data()));
    });
    setPost("");
  };

  const handleInputBoxChange = (e) => {
    setPost(e.target.value);
  };

  return (
    <div>
      <FeedInputBox
        handlePostClick={handlePostClick}
        post={post}
        handleInputBoxChange={handleInputBoxChange}
      />
      <br />
      <DisplayPost postArray={postArray} />
    </div>
  );
}
