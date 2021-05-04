import React, { useEffect, useState } from "react";
import { firebase } from "@firebase/app";
import app from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../contexts/AuthContext";


export default function CommentBox(props) {
  const postID = props.postID;
  const {handlePostComment } = useAuth();
  const [comment, setComment] = useState("");

  const handleCommentBoxChange = (e) => {
    setComment(e.target.value);
  };

  useEffect(() => {
    props.scrollToBottomElement();
  }, []);

  return (
    <div className="commentBox">
      <input
        type="text"
        placeholder="Enter comment"
        value={comment}
        onChange={
          handleCommentBoxChange
        }
      />
      <button className="comment-btn btn-primary btn-sm" onClick={() => {
        handlePostComment(comment, postID, props.commentSectionID);
        setComment("");
        props.setShowCommentBox(false);
      }}>
        Post
      </button>
      <button className="comment-btn btn-secondary btn-sm" onClick={() => {
        setComment("");
        props.setShowCommentBox(false);
      }}>
        Cancel
      </button>
    </div>
  );
}
