import React, { useState, useEffect } from "react";
import FeedInputBox from "./FeedInputBox";
import { useAuth } from "../contexts/AuthContext";
import app from "../firebase";
import { firebase } from "@firebase/app";
import DisplayPost from "./DisplayPost";

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
      setPostArray(snapshot.docs.map((doc) => doc.data()));
      setIsLoading(false);
    });
  }

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
          <FeedInputBox />
          <br />
          <DisplayPost postArray={postArray} />
        </div>
      </div>
    </div>
  );
}
