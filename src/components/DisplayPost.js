import React, { useState } from "react";
import { FaRegCommentDots } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import CommentBox from "./CommentBox";
<<<<<<< Updated upstream
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
=======
import ComponentB from "./ComponentB";
>>>>>>> Stashed changes
import ComponentC from "./ComponentC";

export default function DisplayPost(props) {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState("");
  const { setRecipeID } = useAuth();

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
            <b>{post.email}</b>
            <p>{post.post}</p>
<<<<<<< Updated upstream
=======
            
            {console.log("user details: "+props.userDetails)} 
>>>>>>> Stashed changes
            {
              post.image &&
              <ComponentC
                recipeImage={post.image}
                recipeTitle={post.recipeTitle}
                recipeID={post.recipeID}
              />
            }
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
