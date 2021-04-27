import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { Collapse } from "react-bootstrap";
import ShareRecipeModal from "./ShareRecipeModal";
import app from "../firebase";

export default function MoreInfo() {
  const userCreatedRecipesRef = app.firestore().collection("userCreatedRecipes");
  const [firestoreRecipe, setFirestoreRecipe] = useState();
  const [recipeInfoArray, setRecipeInfoArray] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [nutritionChart, setNutritionChart] = useState({});
  const { recipeID, currentUser } = useAuth();
  const [showIngredients, setShowIngredients] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showNutrition, setShowNutrition] = useState(false);
  const recipeInfoURL = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeID}/information?includeNutrition=false&rapidapi-key=8c2ba2eb1cmsh1e86967079ea9fap1ceb6ejsne0ac3740b914`;
  const nutritionVisualisationURL = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeID}/nutritionWidget?&defaultCss=true&rapidapi-key=8c2ba2eb1cmsh1e86967079ea9fap1ceb6ejsne0ac3740b914`;
  const [show, setShow] = useState(false);
  const ref = app.firestore().collection("userAPIRecipes");
  const [delOrSave, setDelOrSave] = useState(false);
  const [spoonacularRecipe, setSpoonacularRecipe] = useState(null);
  const [currentUserIsAuthor, setCurrentUserIsAuthor] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const userRef = app.firestore().collection("Users");

  let mounted = true;
  

  useEffect(() => {
    getUserDetails();
    if(recipeID.toString().substring(0,3) == "CR-"){
      setSpoonacularRecipe(false);
      // act here for custom recipe data
      getLocalRecipeInfo();
    } else{
      setSpoonacularRecipe(true);
      getRecipeInfo();
      getRecipeNutritionVisualised();
    }
    checkRecipeAdded(); // This should be possible for both custom recipes and spoonacular ones
    return () => {
      mounted = false;
    };

  }, []);

  function checkIfCurrentUserIsAuthor(tempArr){
    console.log(tempArr);
    if(!spoonacularRecipe && currentUser.uid == tempArr[0].authorUID){
      setCurrentUserIsAuthor(true);
    }
  }
  const getUserDetails = () => {
    userRef
      .doc(currentUser.email)
      .get()
      .then((doc) => {
        setUserDetails(doc.data());
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function getLocalRecipeInfo(){
    // copy pasta from MyRecipes I think
    userCreatedRecipesRef
      .doc(recipeID)
      .get()
      .then((response) => {
        let tempArr = [];
        tempArr.push(response.data());
        setIsFetched(true);
        setRecipeInfoArray(tempArr);
        checkIfCurrentUserIsAuthor(tempArr);
      }).catch((error) => {
        setIsFetched(false);
        setErrorMsg(error);
        console.log("Error getting API recipe:",error);
      });
      ;
  };

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

  //check if user has already added recipe to their saved recipes
  const checkRecipeAdded = () => {
    let apiref = ref.doc(currentUser.uid).collection("recipes");
    apiref
      .doc(recipeID.toString())
      .get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) setDelOrSave(true);
      });
  };
  //allow Signed-In users to save recipes to the database.
  //Duplicate handling already implemented in this method.
  const saveAPIRecipe = (id, title, image, ingred, instruct) => {
    ref.doc(currentUser.uid)
      .set({
        uid: currentUser.uid,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
      });
    if (currentUser != null) {
      let apiref = ref.doc(currentUser.uid).collection("recipes");
      apiref
        .doc(id.toString())
        .get()
        .then((docSnapshot) => {
          if (docSnapshot.exists) alert("Recipe already saved!");
          else {
            apiref.doc(id.toString()).set({
              id: id,
              title: title,
              image: image,
              ingredients: ingred,
              instructions: instruct,
              fromAPI: true,
            });
            setDelOrSave(true);
            alert("Saved to My Recipes");
          }
        });
    } else {
      alert("Please Sign-in to start saving recipes.");
    }
  };

  const removeAPIRecipe = (id) => {
    if (!currentUserIsAuthor) {
      let apiref = ref.doc(currentUser.uid).collection("recipes");
      apiref.doc(id.toString()).delete();
      setDelOrSave(false);
      alert("Recipe removed");
    } else {
      let apiref = userCreatedRecipesRef.doc(recipeID);
      apiref.delete();
      setDelOrSave(false);
      alert("Recipe removed");
    }
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
  // } else if(recipeInfoArray.length<2){
  //   return (
  //     <div>
  //       <h3>No recipe data was found</h3>
  //     </div>
  //   );
  } else {
    // we have no errors and we have data

    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-sm-12">
            {recipeInfoArray.map((recipe) => (
              <div className="card mb-3" key={recipe?.id}>
                <div>
                  {recipe &&
                  <ShareRecipeModal
                    show={show}
                    userCreatedRecipe={recipeInfoArray}
                    handleClose={handleClose}
                    spoonacularRecipe={spoonacularRecipe}
                  />
                  }
                </div>
                <img className="card-img-top" src={ recipe?.image ? recipe?.image : "noimage.jpg" } alt="recipe" />
                <div className="card-body">
                  <h4>
                    <b>{ recipe?.title ? recipe.title : 'No Recipe Data Found! The recipe might have been deleted' } </b>
                  </h4>
                  {spoonacularRecipe &&
                    <p>
                      {" "}
                      Ready in: {" " + recipe.readyInMinutes + " "} minutes
                      <br />
                      Servings: {" " + recipe.servings}
                    </p>
                  }
                  <button className="btn btn-primary" onClick={handleShow}>Share</button>
                  {/*
                      NB: We can check to see if the currentUser is the author of this recipe, and if so, we should not show the save/delete button since this recipe is already present in saved recipes.
                      It would be a good idea though to actually separate saved recipes and custom created recipes. They are not the same thing and we will run into problems storing them in the same collection.
                  */}
                  {(delOrSave && !currentUserIsAuthor) && <button className="btn btn-danger float-right" onClick={() => removeAPIRecipe(recipe.id)}>
                    { console.log(currentUserIsAuthor) }
                    { console.log("current user:",currentUser.uid) }
                    { console.log("author:", recipe.authorUID) }
                    Remove Recipe
                  </button>}
                  {(!delOrSave && !currentUserIsAuthor) && <button className="btn btn-secondary float-right" onClick={() => saveAPIRecipe(recipe.id, recipe.title, recipe.image, recipe.extendedIngredients, recipe.analyzedInstructions)}>
                    Save
                  </button>}
                  {/* {((!delOrSave && !currentUserIsAuthor) && ( /^CR.*$/.test(recipe.id))) && <button className="btn btn-secondary float-right" onClick={() => saveAPIRecipe(recipe.id, recipe.title, recipe.image, recipe.extendedIngredients, recipe.analyzedInstructions)}>
                    Save
                  </button>} */}

                  <hr />
                  <button className="btn btn-warning w-100" onClick={() => setShowIngredients(!showIngredients)}>
                    Ingredients
                  </button>
                  {/*
                    Alt to "extendedIngredients" could use recipeInfo[0].ingredients
                    That is the equivalent array to use.
                    Each item is a string. Would just need to map through and add each one as a list item.
                   */}
                  {spoonacularRecipe ?
                    <Collapse in={showIngredients}>
                      <div className="mt-3">
                        {recipe.extendedIngredients.map((ingredients, index) => (
                          <li key={index}>{ingredients.original}</li>
                        ))}
                      </div>
                    </Collapse>
                    : recipe?.ingredients &&
                    <Collapse in={showIngredients}>
                        <div className="mt-3">
                          {recipe.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                          ))}
                        </div>
                    </Collapse>
                  }
                  <hr />
                  <button className="btn btn-success w-100" onClick={() => setShowInstructions(!showInstructions)}>
                    Instructions
                  </button>
                  {/*
                    Alt to "analysedInstructions" could use recipeInfo[0].instructions
                    That is the equivalent array to use.
                    Each item is a string. Would just need to map through and add each one as a list item.
                   */}
                  {spoonacularRecipe ?
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
                    : recipe?.instructions &&
                    <Collapse in={showInstructions}>
                        <div className="mt-3">
                          {recipe.instructions.map((instruction, index) => (
                                  <li key={index}>{instruction}</li>
                          ))}
                        </div>
                    </Collapse>
                  }
                </div>
              </div>
            ))}
          </div>
          {spoonacularRecipe &&
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
          }
        </div>
      </div>
    );
  }
}
