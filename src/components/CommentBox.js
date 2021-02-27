import React from "react";

export default function CommentBox() {
  return (
    <div>
      <input type="text" placeholder="Enter comment" />
      <button className="comment-btn">Post</button>
    </div>
  );
}
