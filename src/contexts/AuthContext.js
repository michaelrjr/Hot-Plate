import React, { useContext, useState, useEffect } from "react";
import { auth, googleAuth } from "../firebase";
import { firebase } from "@firebase/app";
import app from "../firebase";
import { v4 as uuidv4 } from "uuid";
import LoadingFullScreen from "../components/LoadingFullScreen";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);

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
        if (docRef) console.log("Document written with ID: ", docRef.id);
        else {
          const tempArr = [];
          ref
            .doc(thisPostID)
            .get()
            .then((doc) => {
              tempArr.push(doc.data());
              console.log("Document written, details:", tempArr);
            })
            .catch((error) => {
              console.error("Error retrieving added data from firestore:", error);
            });
        }
        alert("Post successful.");
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  const handlePostComment = (comment, postID, childCommentSectionID) => {
    if (comment.length > 0 && postID) {
      ref
        .where("postID", "==", postID)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            if (doc.exists) {
              doc.ref
                .collection(childCommentSectionID)
                .add({
                  comment: comment,
                  commentSectionID: childCommentSectionID,
                  from: currentUser.email,
                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                })
                .then((docRef) => {
                  console.log("Document written with ID: ", docRef.id);
                })
                .catch((error) => {
                  console.error("Error adding document: ", error);
                });
            }
          });
        });
    }
  };

  const CheckCommentsExist = (postID, childCommentSectionID) => {
    const [returnBool, setReturnBool] = useState(0);
    useEffect(() => {
      const getData = async () => {
        if (postID) {
          ref
            .where("postID", "==", postID)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                if (doc.exists) {
                  doc.ref
                    .collection(childCommentSectionID)
                    .get()
                    .then((sub) => {
                      if (sub.docs.length > 0) {
                        setReturnBool(true);
                        return true;
                      } else setReturnBool(false);
                    });
                }
              });
            })
            .then(() => {
              return returnBool;
            });
        } else setReturnBool(false);
      };
      getData();
    }, []);
    return returnBool;
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
    handlePostComment,
    CheckCommentsExist,
    setIsLoading,
    setIsSignedUp,
  };

  console.log(isSignedUp);

  if (isLoading) return <LoadingFullScreen />;
  if (isSignedUp)
    return (
      <div className="container">
        <div className="alert alert-success text-center" role="alert">
          Account created successfully. Signing in...
        </div>
        <div className="mfPlate">
          <div>
            <div className="spinnerHolder">
              <div className="spinner-border" role="status" aria-hidden="true"></div>
            </div>
            <h3>Loading...</h3>
          </div>
        </div>
      </div>
    );

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export default AuthProvider;
