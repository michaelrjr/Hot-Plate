import React, { useState } from "react";
import DisplayEachPost from "./DisplayEachPost";

export default function DisplayPost(props) {
  return (
    <div>
      {props.postArray.map((post) => (
        <DisplayEachPost
          key={post.postID}
          post={post.post}
          email={post.email}
          timestamp={post.timestamp}
          image={post.image}
          recipeTitle={post.recipeTitle}
          recipeID={post.recipeID}
          postID={post.postID}
          childCommentSectionID={post.childCommentSectionID}
          authorFName={post.authorFName}
          authorSName={post.authorSName}
        />
      ))}
    </div>
  );
}
