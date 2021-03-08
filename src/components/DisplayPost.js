import React, { useState } from "react";
import { FaRegCommentDots } from "react-icons/fa";
import CommentBox from "./CommentBox";

export default function DisplayPost(props) {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState("");

  const showCommentInputBox = () => {
    setShowCommentBox(true);
  };

  const handleCommentBoxChnage = (e) => {
    setComment(e.target.value);
  };
  return (
    <div>
      {props.postArray.map((post) => (
        <div
          className="card"
          key={post.timestamp}
          style={{ marginBottom: "10px" }}
        >
          <div className="card-body">
            <div>
              <strong>User:</strong>
              {" " + post.email}
            </div>
            <p>{post.post}</p>
            <div>
              <button
                onClick={showCommentInputBox}
                style={{ border: "none", marginBottom: "10px" }}
              >
                <FaRegCommentDots />
                Comment
              </button>
            </div>

            {showCommentBox && (
              <CommentBox handleCommentBoxChnage={handleCommentBoxChnage} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
