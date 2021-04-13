import React, {useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function FeedInputBox(props) {
  const [showPostDetails, setShowPostDetails] = useState(false);
  const [postDetails, setPostDetails] = useState(0);
  const {handlePostClick} = useAuth();

  useEffect(() => {
    setPostDetails("");
  }, []);

  function handlePostContentChange(e){
    setPostDetails(e.target.value)
  }

  function expandCustomPostSection(){
    setShowPostDetails(true);
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="mb-3">
          <input
            className="form-control"
            type="text"
            placeholder="Start a post"
            value={postDetails}
            onChange={handlePostContentChange}
            onFocus={expandCustomPostSection}
            name="customPost"
          />
        </div>
        <div>
          <button className="btn btn-primary w-100" onClick={() => {
            handlePostClick(postDetails);
            setPostDetails("");
          }}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
