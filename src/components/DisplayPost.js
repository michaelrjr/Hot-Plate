import React, { useState } from "react";
import { FaRegCommentDots } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
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
        <div className="card mb-3" key={post.timestamp}>
          <div className="card-body">
            {props.userDetails.map((user) => (
              <div className="mb-2" key={user.email}>
                <b>{user.firstName + " " + user.lastName}</b>
              </div>
            ))}
            <p>{post.post}</p>
            <div className="d-inline mr-1">
              <button className="btn btn-primary btn-sm">
                <div className="d-inline mr-1">
                  <AiOutlineLike />
                </div>
                <div className="d-inline">Like</div>
              </button>
            </div>
            <div className="d-inline">
              <button
                className="btn btn-success btn-sm"
                onClick={showCommentInputBox}
                style={{ border: "none" }}
              >
                <div className="d-inline mr-1">
                  <FaRegCommentDots />
                </div>
                <div className="d-inline">Comment</div>
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
