import React, { useState, useEffect } from "react";
import FeedInputBox from "./FeedInputBox";
import { useAuth } from "../contexts/AuthContext";
import app from "../firebase";
import { firebase } from "@firebase/app";
import DisplayPost from "./DisplayPost";
import LoadingFullScreen from "./LoadingFullScreen";

export default function Feed() {
  const [postArray, setPostArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  //database ref
  const ref = app.firestore().collection("feed");

  useEffect(() => {
    const unsub = getData();
    return () => unsub();
  }, []);

  function getData() {
    return ref.orderBy("timestamp", "desc").onSnapshot((snapshot) => {
      if(!snapshot.metadata.hasPendingWrites)setPostArray(snapshot.docs.map((doc) => doc.data()));
      setIsLoading(false);
    });
  }

  if (isLoading) {
    return (
      <LoadingFullScreen />
    );
  }

  return (
    <div className="container d-flex justify-content-center" style={{ minHeight: "100%" }}>
      <div className="w-100" style={{ maxWidth: "450px" }}>
        <div>
          <FeedInputBox />
          <br />
          <DisplayPost postArray={postArray} />
        </div>
      </div>
    </div>
  );
}
