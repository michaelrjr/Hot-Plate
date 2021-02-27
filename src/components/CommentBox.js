import React from "react";

export default function CommentBox(props) {
  return (
    <div>
      <input
        type="text"
        placeholder="Enter comment"
        onChange={props.handleCommentBoxChange}
      />
      <button className="comment-btn">Post</button>
    </div>
  );
}
