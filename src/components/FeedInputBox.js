import React from "react";

export default function FeedInputBox(props) {
  return (
    <div className="card">
      <div className="card-body">
        <form onSubmit={props.handlePostClick}>
          <div className="mb-3">
            <input
              className="form-control"
              type="text"
              placeholder="Start a post"
              value={props.post}
              onChange={props.handleInputBoxChange}
            />
          </div>
          <div>
            <button type="submit" className="btn btn-primary w-100">
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
