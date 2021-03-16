import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { AiOutlineShareAlt } from "react-icons/ai";

export default function MoreInfo() {
  const [recipeInfoArray, setRecipeInfoArray] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [nutritionChart, setNutritionChart] = useState({});
  const { recipeID } = useAuth();
  const [showIngredients, setShowIngredients] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showNutrition, setShowNutrition] = useState(false);
  const recipeInfoURL = `https://api.spoonacular.com/recipes/${recipeID}/information?includeNutrition=false&apiKey=28f4c1acf9cc4a96863ed9298ac43eb3`;
  const nutritionVisualisationURL = `https://api.spoonacular.com/recipes/${recipeID}/nutritionWidget?&defaultCss=true&apiKey=28f4c1acf9cc4a96863ed9298ac43eb3`;

  let mounted = true;

  useEffect(() => {
    getRecipeInfo();
    getRecipeNutritionVisualised();
    return () => {
      mounted = false;
    };
  }, []);

  const getRecipeInfo = () => {
    axios
      .get(recipeInfoURL)
      .then((response) => {
        if (mounted) {
          let tempArr = [];
          tempArr.push(response.data);
          setIsFetched(true);
          setRecipeInfoArray(tempArr);
          console.log(tempArr);
        }
      })
      .catch((error) => {
        setIsFetched(false);
        setErrorMsg(error);
      });
  };

  const getRecipeNutritionVisualised = () => {
    axios
      .get(nutritionVisualisationURL)
      .then((response) => {
        if (mounted) {
          setIsFetched(true);
          console.log(response.data);
          setNutritionChart(response.data);
        }
      })
      .catch((error) => {
        setIsFetched(false);
        setErrorMsg(error);
        console.log(error);
      });
  };

  // if there is an error
  if (errorMsg) {
    return (
      <div>
        <h3>An error has occured</h3>
      </div>
    ); // end of return.
  } else if (!isFetched) {
    return (
      <div>
        <h3>Loading please wait...</h3>
      </div>
    ); // end of return
  } else {
    // we have no errors and we have data
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-sm-12">
            {recipeInfoArray.map((recipe) => (
              <div className="card mb-3" key={recipe.id}>
                <img className="card-img-top" src={recipe.image} alt="recipe" />
                <div className="card-body">
                  <br />

                  <h4>
                    <b>{recipe.title}</b>
                  </h4>
                  <p>Ready in: {" " + recipe.readyInMinutes + " "} minutes</p>
                  <p>Servings: {" " + recipe.servings}</p>
                  <hr />
                  <button
                    className="btn btn-warning w-100"
                    onClick={() => setShowIngredients(!showIngredients)}
                  >
                    Ingredients
                  </button>
                  {showIngredients && (
                    <div className="mt-3">
                      {recipe.extendedIngredients.map((ingredients) => (
                        <li>{ingredients.original}</li>
                      ))}
                    </div>
                  )}
                  <hr />
                  <button
                    className="btn btn-success w-100"
                    onClick={() => setShowInstructions(!showInstructions)}
                  >
                    Instructions
                  </button>
                  {showInstructions && (
                    <div className="mt-3">
                      {recipe.analyzedInstructions.map((instruction, index) => (
                        <div key={index}>
                          {instruction.steps.map((step) => (
                            <div key={step.number}>
                              <li>{step.step}</li>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="col-lg-6 col-sm-12">
            <button
              className="btn btn-primary w-100 mb-2"
              onClick={() => setShowNutrition(!showNutrition)}
            >
              Nutritional Information
            </button>
            {showNutrition && (
              <div className="card mb-3">
                <div
                  className="card-body"
                  dangerouslySetInnerHTML={{ __html: nutritionChart }}
                ></div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
