import React from "react";

export default function UserFeedInputBox(props) {
  return (
    <div className="container">
      <form onSubmit={props.handlePostClick}>
        <div className="card">
          <input
            type="text"
            placeholder="Start a post"
            value={props.post}
            onChange={props.handleInputBoxChange}
          />
          <button type="submit" className="buttons">
            Post
          </button>
        </div>
      </form>
    </div>
  );
}
