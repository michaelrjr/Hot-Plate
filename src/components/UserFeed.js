import React, { useState } from "react";
import { FaRegCommentDots } from "react-icons/fa";
import CommentBox from "./CommentBox";
export default function UserFeed(props) {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState("");

  const showCommentInputBox = () => {
    setShowCommentBox(true);
  };

  return (
    <div className="container">
      {props.userFeed.map((post) => (
        <div
          className="card"
          key={post.timestamp}
          style={{ marginBottom: "10px" }}
        >
          <div>
            <strong>User:</strong>
            {" " + post.email}
          </div>
          <p>{post.post}</p>
          <div>
            <button onClick={showCommentInputBox} style={{ border: "none" }}>
              <FaRegCommentDots />
              Comment
            </button>
          </div>
          <br />
          {showCommentBox && <CommentBox />}
        </div>
      ))}
    </div>
  );
}
