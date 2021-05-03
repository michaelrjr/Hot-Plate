import React, { useState, useEffect } from "react";
import FeedInputBox from "./FeedInputBox";
import { useAuth } from "../contexts/AuthContext";
import app from "../firebase";
import { firebase } from "@firebase/app";
import DisplayPost from "./DisplayPost";

export default function Feed() {
  const [postArray, setPostArray] = useState([]);

  //database ref
  const ref = app.firestore().collection("feed");

  useEffect(() => {
    const unsub = getData();
    return () => unsub();
  }, []);

  function getData(){
    return ref.orderBy("timestamp", "desc").onSnapshot((snapshot) => {
      setPostArray(snapshot.docs.map((doc) => doc.data()));
    });
  };

  return (
    <div>
      <FeedInputBox />
      <br />
      <DisplayPost postArray={postArray} />
    </div>
  );
}
