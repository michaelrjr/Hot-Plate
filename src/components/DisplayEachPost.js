import React, { useState, useEffect } from "react";
import { FaRegCommentDots } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import CommentBox from "./CommentBox";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ComponentC from "./ComponentC";
import DisplayComments from "./DisplayComments";
import { PinDropSharp } from "@material-ui/icons";

export default function DisplayEachPost(props) {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const { CheckCommentsExist } = useAuth();

  const showCommentInputBox = () => {
    setShowCommentBox(!showCommentBox);
  };

  // NB: Need to put a useEffect here to CheckCommentsExist(props.postID) on re-load (so if a comment is entered, it shows up without refresh)

  return (
    <div>
        <div className="card mb-3" key={props.postID}>
          <div className="card-body">
            <b>{props.email}</b>
            <p>{props.post}</p>
            {
              props.image &&
              <ComponentC
                recipeImage={props.image}
                recipeTitle={props.recipeTitle}
                recipeID={props.recipeID}
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
              <CommentBox
                postID = {props.postID}
                commentSectionID = {props.childCommentSectionID}
              />
            )}
          </div>
          <div>
            {
              CheckCommentsExist(props.postID, props.childCommentSectionID) &&
                <DisplayComments
                  postID = {props.postID}
                  commentSectionID = {props.childCommentSectionID}
                />
            }
          </div>
        </div>
    </div>
  );
}
