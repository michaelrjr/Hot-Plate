import React from "react";

export default function FeedInputBox(props) {
  return (
    <div className="container">
      <div className="card">
        <div className="card-body">
          <form onSubmit={props.handlePostClick}>
            <input
              type="text"
              placeholder="Start a post"
              value={props.post}
              onChange={props.handleInputBoxChange}
            />
            <button type="submit" className="buttons">
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
