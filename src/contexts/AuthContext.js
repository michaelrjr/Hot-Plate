import React, { useContext, useState, useEffect } from "react";
import { auth, googleAuth } from "../firebase";
import { firebase } from "@firebase/app";
import app from "../firebase";
import { v4 as uuidv4 } from "uuid";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}
//contexts allow for passing functions and variables around the app.
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recipeID, setID] = useState(0);
  //database ref
  const ref = app.firestore().collection("feed");

  function signUp(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function signIn(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function signOut() {
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password);
  }

  function sendEmailVerification() {
    return auth.currentUser.sendEmailVerification();
  }

  function signInWithGoogle() {
    return auth.signInWithPopup(googleAuth);
  }

  // so I can use recipeID anywhere in the app
  function setRecipeID(id) {
    setID(id);
  }

  // so we can use handlePostClick anywhere in the app for sharing recipes
  const handlePostClick = (post, recipeID, image, title) => {
    console.log("handlePostClick entered");
    recipeID = recipeID ? recipeID : null;
    image = image ? image : null;
    title = title ? title : null;
    const thisPostID = uuidv4();
    ref
      .doc(thisPostID)
      .set({
        email: currentUser.email,
        post: post,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        recipeID: recipeID,
        image: image,
        recipeTitle: title,
        postID: thisPostID,
        childCommentSectionID: uuidv4(),
      })
      .then((docRef) => {
        if(docRef) console.log("Document written with ID: ", docRef.id);
        else{
          const tempArr = [];
          ref.doc(thisPostID).get().then((doc) => {
            tempArr.push(doc.data());
            console.log("Document written, details:", tempArr);
          }).catch((error) => {
            console.error("Error retrieving added data from firestore:", error);
          })
        }
        alert("Post successful.")
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateEmail,
    updatePassword,
    sendEmailVerification,
    signInWithGoogle,
    recipeID,
    setRecipeID,
    handlePostClick,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export default AuthProvider;
