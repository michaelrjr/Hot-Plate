import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function RecipeCard(props) {
  const size = "636x393.jpg";
  const basePath = "https://spoonacular.com/recipeImages/";
  const { setRecipeID } = useAuth();
 

  // NOTE!
  // if (apiData.length < 1 ) {
  //   return <div><h3>Sorry No Recipes Please Try Again</h3></div>
  // } else {
  //   // return the recipes
  // }

  if (props.apiData.length !== 0 && props.recipeNum < props.apiData.length) {
    return (
      <div>
        <div className="card">
          {props.apiData[props.recipeNum].image === null ? (
            <img src="noimage.jpg" />
          ) : (
            <img
              src={`${basePath}${props.apiData[props.recipeNum].id}-${size}`}
              alt="recipe"
            />
          )}
          <div className="card-body">
            <div className="card-title">
              <h3>{props.apiData[props.recipeNum].title}</h3>
            </div>
            <div>
            <button type="button" className="btn btn-danger w-100 mb-3" onClick={props.nextRecipe}>
              Next
            </button>
            </div>
            <div>
            <Link to="/moreinfo">
            
              <button
                type="button"
                className="btn btn-success w-100 mb-3"
                onClick={() => setRecipeID(props.apiData[props.recipeNum].id)}
              >
                MoreInfo
              </button>
              
            </Link>
            </div>
            <div>
              <button
                  type="button"
                  className="btn btn-light w-100"
                  onClick = {props.allFiltersSet}
                >
                  . . .
              </button>
              </div>
              
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <span className="center">
        <h3>No more recipes. Please change filters </h3>
      </span>
    );
  }
}