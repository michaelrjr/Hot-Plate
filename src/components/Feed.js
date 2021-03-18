import React, { useState, useEffect } from "react";
import FeedInputBox from "./FeedInputBox";
import { useAuth } from "../contexts/AuthContext";
import app from "../firebase";
import { firebase } from "@firebase/app";
import DisplayPost from "./DisplayPost";

export default function Feed() {
<<<<<<< Updated upstream
  const { currentUser, signOut, handlePostClick } = useAuth();
=======
  const { currentUser, handlePostClick, signOut } = useAuth();
>>>>>>> Stashed changes
  const [postArray, setPostArray] = useState([]);
  const [post, setPost] = useState("");
  //const [userDetails, setUserDetails] = useState([]);

  let mounted = true;

  //database ref
<<<<<<< Updated upstream
  const ref = app.firestore().collection("feed");
=======
  const ref = app.firestore().collection("sharedPosts");
>>>>>>> Stashed changes
  const userRef = app.firestore().collection("Users");

  useEffect(() => {
    getData();
    //getUserDetails();
  }, []);

<<<<<<< Updated upstream
  // const getUserDetails = () => {
  //   userRef
  //     .doc(currentUser.email)
  //     .get()
  //     .then((doc) => {
  //       let tempArr = [];
  //       //if (mounted) {
  //       if (doc.exists) {
  //         tempArr.push(doc.data());
  //         setUserDetails(tempArr);
  //         console.log(tempArr);
  //         //}
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
=======
  const getUserDetails = () => {
    userRef
      .doc(currentUser.email)
      .get()
      .then((doc) => {
        let tempArr = [];
        if (doc.exists) {
          tempArr.push(doc.data());
          setUserDetails(tempArr);
          console.log(tempArr);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
>>>>>>> Stashed changes

  const getData = () => {
    ref.orderBy("timestamp", "desc").onSnapshot((snapshot) => {
      setPostArray(snapshot.docs.map((doc) => doc.data()));
    });
    setPost("");
  };

  // const handlePostClick = (e) => {
  //   e.preventDefault();
  //   ref
  //     .add({
  //       email: currentUser.email,
  //       post: post,
  //       timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  //     })
  //     .then((docRef) => {
  //       console.log("Document written with ID: ", docRef.id);
  //     })
  //     .catch((error) => {
  //       console.error("Error adding document: ", error);
  //     });
  // };

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
