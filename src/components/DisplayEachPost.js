import React, { useState, useEffect } from "react";
import { FaRegCommentDots } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import CommentBox from "./CommentBox";
import { firebase } from "@firebase/app";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ComponentC from "./ComponentC";
import DisplayComments from "./DisplayComments";
import { PinDropSharp } from "@material-ui/icons";
import app from "../firebase";

export default function DisplayEachPost(props) {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const { CheckCommentsExist, currentUser } = useAuth();
  const userDBRef = app.firestore().collection("Users");
  const likeRef = app.firestore().collection("feed").doc(props.postID).collection("Likes");;
  
  const [ currentUserData, setCurrentUserData ] = useState();

  const [likeOrUnlike, setLikeOrUnlike] = useState(false);

  useEffect(() => {
    checkLiked();
  }, []);

  const checkLiked = () => {
    likeRef.doc(currentUser.email).get().then((docSnapshot) => {
      if (!docSnapshot.exists) setLikeOrUnlike(true);
    })
  }

  const showCommentInputBox = () => {
    setShowCommentBox(!showCommentBox);
  };
  
  const likedPost = () => {
    likeRef.doc(currentUser.email).get().then((docSnapshot) => {
      if (!docSnapshot.exists) {
        likeRef.doc(currentUser.email)
          .set({
            email: currentUser.email,
            uid: currentUser.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          });
          setLikeOrUnlike(true);
      }else{
        likeRef.doc(currentUser.email)
          .delete();
        setLikeOrUnlike(false);
      }
    })
  }

  const getUserData = () => {
    userDBRef.doc(props.email).get().then( (doc) => {
      setCurrentUserData( doc.data() );
      console.log("tempArr: "+JSON.stringify(currentUserData));
  })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
  };

  useEffect(() => {
    getUserData();
    // console.log(avatar);
  }, []);

  // NB: Need to put a useEffect here to CheckCommentsExist(props.postID) on re-load (so if a comment is entered, it shows up without refresh)

  return (
    <div>
        <div className="card mb-3" key={props.postID}>
          <div className="card-body">
            <div className="row">
              <div className="d-inline-block">
                <img src ={currentUserData?.avatar} className="rounded-circle ml-3 mr-3 mb-1" height="60" width="60"/>
              </div>
              <div className="d-inline-block">
                  <b >{currentUserData?.firstName+" "+currentUserData?.lastName}</b><br />
                  <small >{new Date(props.timestamp?.toDate()).toLocaleString()}</small>
              </div>
            </div>
            <p>{props.post}</p>
            {
              props.image &&
              <ComponentC
                recipeImage={props.image}
                recipeTitle={props.recipeTitle}
                recipeID={props.recipeID}
              />
            }
            <div className="d-inline">
              <button className="btn btn-like btn-sm w-50 d-inline" onClick={()=> likedPost()}>
                <div className="d-inline mr-1">
                  <AiOutlineLike />
                </div>
                {!likeOrUnlike && <div className="d-inline">Like</div>}
                {likeOrUnlike && <div className="d-inline">Unlike</div>}
              </button>
            </div>
            <div className="d-inline">
              <button
                className="btn btn-comment btn-sm w-50 d-inline"
                onClick={showCommentInputBox}
              >
                <div className="d-inline mr-1">
                  <FaRegCommentDots />
                </div>
                <div className="d-inline">Comment</div>
              </button>
            </div>
            {showCommentBox && (
              <CommentBox
                postID = {props.postID}
                commentSectionID = {props.childCommentSectionID}
              />
            )}
            {
              CheckCommentsExist(props.postID, props.childCommentSectionID) &&
                <DisplayComments
                  postID = {props.postID}
                  commentSectionID = {props.childCommentSectionID}
                />
            }
          </div>
        </div>
    </div>
  );
}
