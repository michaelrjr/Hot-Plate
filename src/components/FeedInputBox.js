import React, {useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { firebase } from "@firebase/app";
import app from "../firebase";

export default function FeedInputBox(props) {
  const [showPostDetails, setShowPostDetails] = useState(false);
  const [postDetails, setPostDetails] = useState(0);
  const feedCollection = app.firestore().collection("feed");
  const {currentUser} = useAuth();

  useEffect(() => {
    setPostDetails("");
  }, []);

  function handlePostContentChange(e){
    setPostDetails(e.target.value)
  }

  function expandCustomPostSection(){
    setShowPostDetails(true);
  }

  function handlePostClick(postDescription){
    const thisPostID = uuidv4();
    feedCollection
      .doc(thisPostID)
      .set({
        email: currentUser.email,
        post: postDescription,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        postID: thisPostID,
        childCommentSectionID: uuidv4(),
      })
      .then((docRef) => {
        if(docRef) console.log("Document written with ID: ", docRef.id);
        else{
          const tempArr = [];
          feedCollection.doc(thisPostID).get().then((doc) => {
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
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="mb-3">
          <input
            className="form-control"
            type="text"
            placeholder="Start a post"
            value={postDetails}
            onChange={handlePostContentChange}
            onFocus={expandCustomPostSection}
            name="customPost"
          />
        </div>
        <div>
          <button className="btn btn-primary w-100" onClick={() => {
            handlePostClick(postDetails);
            setPostDetails("");
          }}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
