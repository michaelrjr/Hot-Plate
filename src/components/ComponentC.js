import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ComponentB(props) {
  const size = "636x393.jpg";
  const { setRecipeID } = useAuth();

return (
    <div>
        {props.image === null ? (
            <img src="noimage.jpg" />
        ) : (
            <img
            className="card-img-top"
            src={props.recipeImage}
            alt="recipe"
            />
        )}
        <div>
            <h3>{props.recipeTitle}</h3>
        </div>
        <Link to="/moreinfo">
        <button
            className="buttons"
            onClick={() => setRecipeID(props.recipeID)}
        >
            More Info
        </button>
        </Link>
    </div>
);
}
