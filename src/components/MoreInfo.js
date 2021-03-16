import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

export default function MoreInfo() {
  const [recipeInfoArray, setRecipeInfoArray] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [nutritionChart, setNutritionChart] = useState({});
  const { recipeID, handlePostClick } = useAuth();
  const [showIngredients, setShowIngredients] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
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
          <div className="col">
            {recipeInfoArray.map((recipe) => (
              <div className="card" key={recipe.id}>
                <img
                  src={recipe.image}
                  alt="recipe"
                  style={{ width: "100%" }}
                />
                <div>
                  <button
                    onClick={() =>
                      handlePostClick("post from more info", recipeID)
                    }
                  >
                    Share
                  </button>
                </div>
                <br />
                <div className="container">
                  <h4>
                    <b>{recipe.title}</b>
                  </h4>
                  <p>Ready in: {" " + recipe.readyInMinutes + " "} minutes</p>
                  <p>Servings: {" " + recipe.servings}</p>
                  <hr />
                  <button
                    className="buttons"
                    onClick={() => setShowIngredients(!showIngredients)}
                  >
                    Ingredients
                  </button>
                  {showIngredients && (
                    <div>
                      {recipe.extendedIngredients.map((ingredients) => (
                        <li>{ingredients.original}</li>
                      ))}
                    </div>
                  )}

                  <hr />

                  <button
                    className="buttons"
                    onClick={() => setShowInstructions(!showInstructions)}
                  >
                    Instructions
                  </button>
                  {showInstructions && (
                    <div>
                      {recipe.analyzedInstructions.map((instruction, index) => (
                        <div key={index}>
                          {instruction.steps.map((step) => (
                            <div key={step.number}>
                              {step.equipment.map((equip) => (
                                <div
                                  key={equip.id}
                                  style={{
                                    display: "inline-block",
                                    marginRight: "10px",
                                  }}
                                >
                                  {equip.name}
                                </div>
                              ))}
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
          <div
            className="col"
            dangerouslySetInnerHTML={{ __html: nutritionChart }}
          ></div>
        </div>
      </div>
    );
  }
}
