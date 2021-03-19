import React, { useState } from "react";
import { firebase } from "@firebase/app";
import app from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../contexts/AuthContext";


export default function CommentBox(props) {
  const postID = props.postID;
  const { comment, setComment, handlePostComment } = useAuth();

  const handleCommentBoxChange = (e) => {
    setComment(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter comment"
        onChange={
          handleCommentBoxChange
        }
      />
      <button className="comment-btn" onClick={() => {
        handlePostComment(comment, postID, props.commentSectionID)
      }}>
        Post
      </button>
    </div>
  );
}
