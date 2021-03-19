import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function RecipeCard(props) {
  const size = "636x393.jpg";
  const basePath = "https://spoonacular.com/recipeImages/";
  const { setRecipeID } = useAuth();

  return (
    <div>
      <div className='card'>
        {props.apiData[props.recipeNum].image === null ? (
          <img src='noimage.jpg' />
        ) : (
          <img
            src={`${basePath}${props.apiData[props.recipeNum].id}-${size}`}
            alt='recipe'
          />
        )}
        <div className='card-body'>
          <div className='card-title'>
            <h3>{props.apiData[props.recipeNum].title}</h3>
          </div>
          <div>
            <button
              type='button'
              className='btn btn-danger w-100 mb-3'
              onClick={props.nextRecipe}>
              Next
            </button>
          </div>
          <div>
            <Link to='/moreinfo'>
              <button
                type='button'
                className='btn btn-success w-100 mb-3'
                onClick={() => setRecipeID(props.apiData[props.recipeNum].id)}>
                More Info
              </button>
            </Link>
          </div>
          <div>
            <button
              type='button'
              className='btn btn-light w-100'
              onClick={props.handleShowFilters}>
              . . .
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
