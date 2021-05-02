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
import { Modal } from "react-bootstrap";

export default function DisplayEachPost(props) {
  const { currentUser } = useAuth();
  const [showCommentSection, setShowCommentSection] = useState(false);
  const userDBRef = app.firestore().collection("Users");
  const likeRef = app.firestore().collection("feed").doc(props.postID).collection("Likes");
  const commentSectionRef = app.firestore().collection("feed").doc(props.postID).collection(props.childCommentSectionID);
  const [numLikes, setNumLikes] = useState(0);
  const [numComments, setNumComments] = useState(0);
  
  const [ currentUserData, setCurrentUserData ] = useState();

  const [likeOrUnlike, setLikeOrUnlike] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postByCurrentUser, setPostByCurrentUser] = useState(false);

  const checkLiked = () => {
    likeRef.doc(currentUser.email).get().then((docSnapshot) => {
      if (docSnapshot.exists) setLikeOrUnlike(true);
    })
  }

  const checkNumLikes = () => {
    likeRef.onSnapshot((snapShot) =>{
      setNumLikes(snapShot.size);
    })
  }

  const checkNumComments = () => {
    commentSectionRef.onSnapshot((snapshot) => {
      setNumComments(snapshot.size);
    });
  }

  const deletePost = (id) =>{
    let userPost = app.firestore().collection("feed").doc(id);
    userPost.delete();
  }

  const checkPostByCurrentUser = () => {
    if (currentUser.email == props.email){
      setPostByCurrentUser(true);
    }
  }

  const revealCommentSection = () => {
    setShowCommentSection(!showCommentSection);
  }
  
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
          checkNumLikes();
      }else{
        likeRef.doc(currentUser.email)
          .delete();
        setLikeOrUnlike(false);
        checkNumLikes();
      }
    })
  }

  const getUserData = () => {
    userDBRef.doc(props.email).get().then( (doc) => {
      setCurrentUserData( doc.data() );
  })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
  };

  const handleCloseFilters = () => {
    setShowDeleteModal(false);
  }

  useEffect(() => {
    getUserData();
    checkNumLikes();
    checkNumComments();
    checkLiked();
    checkPostByCurrentUser();
  }, []);

  return (
    <div>
      <div className="card mb-3" key={props.postID}>
        <div className="card-body">
          {postByCurrentUser && <button className="btn btn-light btn-sm float-right" onClick={() => setShowDeleteModal(true)}>X</button>}
          <div>
            <Modal show={showDeleteModal} onHide={handleCloseFilters}>
              <Modal.Header>
                <Modal.Title>Are you sure you want to delete this post?</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <button className="btn btn-secondary btn-md" onClick={handleCloseFilters} >Cancel</button>
                <button className="btn btn-danger btn-md float-right" onClick={() => deletePost(props.postID)}>Delete Post</button>
              </Modal.Body>
            </Modal>
          </div>
          <div className="row mb-2">
            <div className="d-inline-block">
                <img src ={currentUserData?.avatar} className="rounded-circle ml-3 mr-3 mb-1" height="60" width="60"/>
              </div>
              <div className="d-inline-block">
                
                  <b >{currentUserData?.firstName+" "+currentUserData?.lastName}</b><br />
                  <small >{new Date(props.timestamp?.toDate()).toLocaleString()}</small>
              </div>
            </div>
            
            {props.post?.length>0 && <p>{props.post}</p>}
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
                  {numLikes}
                  <AiOutlineLike />
                </div>
                {!likeOrUnlike && <div className="d-inline">Like</div>}
                {likeOrUnlike && <div className="d-inline">Unlike</div>}
              </button>
            </div>
            <div className="d-inline">

              { showCommentSection ?
                <button
                  className="btn btn-secondary btn-sm w-50 d-inline"
                  onClick={revealCommentSection}
                >
                  <div className="d-inline mr-1">
                    <FaRegCommentDots />
                  </div>
                  <div className="d-inline">Hide Comments</div>
                </button>
                :
                <button
                  className="btn btn-comment btn-sm w-50 d-inline"
                  onClick={revealCommentSection}
                >
                  <div className="d-inline mr-1">
                    
                    <FaRegCommentDots />
                  </div>
                  <div className="d-inline">Show Comments {numComments>0 && "("+numComments+")"}</div>
                </button>
              }
            </div>
            { showCommentSection &&
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
