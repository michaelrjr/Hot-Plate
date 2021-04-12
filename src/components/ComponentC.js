import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ComponentC(props) {
  const size = "636x393.jpg";
  const { setRecipeID } = useAuth();

  return (
    <div className="recipeShare">
      {props.image === null ? (
        <img src="noimage.jpg" />
      ) : (
        <img className="recipeImagePost card-img-top" src={props.recipeImage} alt="recipe" />
      )}
      <h3 className="recipeTitlePost d-inline-block">{props.recipeTitle}</h3>

      <Link to="/moreinfo">
        <button className="btn btn-more-info btn-sm w-100" onClick={() => setRecipeID(props.recipeID)}>
          More Info
        </button>
      </Link>
    </div>
  );
}
