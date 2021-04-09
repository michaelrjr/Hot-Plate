import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { Collapse } from "react-bootstrap";
import ShareRecipeModal from "./ShareRecipeModal";
import app from "../firebase";

export default function MoreInfo() {
  const [recipeInfoArray, setRecipeInfoArray] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [nutritionChart, setNutritionChart] = useState({});
  const { recipeID, currentUser } = useAuth();
  const [showIngredients, setShowIngredients] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showNutrition, setShowNutrition] = useState(false);
  const recipeInfoURL = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeID}/information?includeNutrition=false&rapidapi-key=${process.env.REACT_APP_API_KEY}`;
  const nutritionVisualisationURL = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeID}/nutritionWidget?&defaultCss=true&rapidapi-key=${process.env.REACT_APP_API_KEY}`;
  const [show, setShow] = useState(false);
  const ref = app.firestore().collection("Users");
  const [delOrSave, setDelOrSave] = useState(false);

  let mounted = true;
  

  useEffect(() => {
    getRecipeInfo();
    getRecipeNutritionVisualised();
    checkRecipeAdded();
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

  const checkRecipeAdded = () => {
    let apiref = ref.doc(currentUser.email).collection("recipeAPI");
    apiref.doc(recipeID.toString()).get().then((docSnapshot) => {
      if (docSnapshot.exists) setDelOrSave(true);
    })
  }
//allow Signed-In users to save recipes to the database.
//Duplicate handling already implemented in this method.
  const saveAPIRecipe = (id, title, image, ingred, instruct) => {
    if (currentUser != null) {
      let apiref = ref.doc(currentUser.email).collection("recipeAPI");
      apiref.doc(id.toString()).get().then((docSnapshot) =>{
        if(docSnapshot.exists) alert("Recipe already saved!");
        else{
          apiref.doc(id.toString())
          .set({
            id: id,
            title: title,
            image: image,
            ingredients: ingred,
            instructions: instruct,
            fromAPI: false
          })
          setDelOrSave(true);
          alert("Saved to My Recipes");
        }
      });
    } else {
      alert("Please Sign-in to start saving recipes.");
    }
  }

  const removeAPIRecipe = (id) => {
    let apiref = ref.doc(currentUser.email).collection("recipeAPI");
    apiref.doc(id.toString()).delete();
    setDelOrSave(false);
    alert("Recipe removed");
  }

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
                <div>
                  <ShareRecipeModal
                    show={show}
                    userCreatedRecipe={recipeInfoArray}
                    handleClose={handleClose}
                  />
                </div>
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
                  <button className="btn btn-primary" onClick={handleShow}>Share</button>
                  {delOrSave && <button className="btn btn-danger float-right" onClick={() => removeAPIRecipe(recipe.id)}>
                    Remove Recipe
                  </button>}
                  {!delOrSave &&<button className="btn btn-secondary float-right" onClick={() => saveAPIRecipe(recipe.id, recipe.title, recipe.image, recipe.extendedIngredients, recipe.analyzedInstructions)}>
                    Save
                  </button>}

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