import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { Collapse } from "react-bootstrap";

export default function MoreInfo() {
  const [recipeInfoArray, setRecipeInfoArray] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [nutritionChart, setNutritionChart] = useState({});
  const { recipeID } = useAuth();
  const [showIngredients, setShowIngredients] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showNutrition, setShowNutrition] = useState(false);
  const recipeInfoURL = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeID}/information?includeNutrition=false&rapidapi-key=8c2ba2eb1cmsh1e86967079ea9fap1ceb6ejsne0ac3740b914`;
  const nutritionVisualisationURL = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeID}/nutritionWidget?&defaultCss=true&rapidapi-key=8c2ba2eb1cmsh1e86967079ea9fap1ceb6ejsne0ac3740b914`;
  const [show, setShow] = useState(false);

  let mounted = true;

  useEffect(() => {
    getRecipeInfo();
    getRecipeNutritionVisualised();
    return () => {
      mounted = false;
    };
  }, []);

  // get more information about a recipe from spoonacular
  const getRecipeInfo = () => {
    axios
      .get(recipeInfoURL)
      .then((response) => {
        let tempArr = [];
        if (mounted) {
          tempArr.push(response.data);
          setIsFetched(true);
          setRecipeInfoArray(tempArr);
        }
      })
      .catch((error) => {
        setIsFetched(false);
        setErrorMsg(error);
      });
  };

  // get the visualised nutritional data for a recipe from spoonacualr
  const getRecipeNutritionVisualised = () => {
    axios
      .get(nutritionVisualisationURL)
      .then((response) => {
        if (mounted) {
          setIsFetched(true);
          setNutritionChart(response.data);
        }
      })
      .catch((error) => {
        setIsFetched(false);
        setErrorMsg(error);
      });
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // if there is an error
  if (errorMsg) {
    return (
      <div>
        <h3>An error has occured</h3>
      </div>
    );
  } else if (!isFetched) {
    return (
      <div>
        <h3>Loading please wait...</h3>
      </div>
    );
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
                  <h4>
                    <b>{recipe.title}</b>
                  </h4>
                  <p>
                    {" "}
                    Ready in: {" " + recipe.readyInMinutes + " "} minutes
                    <br />
                    Servings: {" " + recipe.servings}
                  </p>
                  <button className="btn btn-primary">Share</button>
                  <button className="btn btn-secondary float-right">
                    Save
                  </button>

                  <hr />
                  <button
                    className="btn btn-warning w-100"
                    onClick={() => setShowIngredients(!showIngredients)}>
                    Ingredients
                  </button>
                  <Collapse in={showIngredients}>
                    <div className="mt-3">
                      {recipe.extendedIngredients.map((ingredients) => (
                        <li>{ingredients.original}</li>
                      ))}
                    </div>
                  </Collapse>
                  <hr />
                  <button
                    className="btn btn-success w-100"
                    onClick={() => setShowInstructions(!showInstructions)}>
                    Instructions
                  </button>
                  <Collapse in={showInstructions}>
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
                  </Collapse>
                </div>
              </div>
            ))}
          </div>
          <div className="col-lg-6 col-sm-12">
            <button
              className="btn btn-primary w-100 mb-2"
              data-toggle="collapse"
              data-target="#nutritionalInfo"
              aria-expanded="false"
              aria-controls="nutritionalInfo"
              onClick={() => setShowNutrition(!showNutrition)}>
              Nutritional Information
            </button>
            <Collapse in={showNutrition}>
              <div className="card mb-3">
                <div
                  className="card-body"
                  id="nutritionalInfo"
                  dangerouslySetInnerHTML={{ __html: nutritionChart }}></div>
              </div>
            </Collapse>
          </div>
        </div>
      </div>
    );
  }
}
