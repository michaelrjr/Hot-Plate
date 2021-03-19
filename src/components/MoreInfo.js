import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { AiOutlineShareAlt } from "react-icons/ai";
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
<<<<<<< HEAD
  const recipeInfoURL = `https://api.spoonacular.com/recipes/${recipeID}/information?includeNutrition=false&apiKey=28f4c1acf9cc4a96863ed9298ac43eb3`;
  const nutritionVisualisationURL = `https://api.spoonacular.com/recipes/${recipeID}/nutritionWidget?&defaultCss=true&apiKey=28f4c1acf9cc4a96863ed9298ac43eb3`;
=======
  const recipeInfoURL = `https://api.spoonacular.com/recipes/${recipeID}/information?includeNutrition=false&apiKey=1b6d876044c14f4aa40ac59f38fb45fc`;
  const nutritionVisualisationURL = `https://api.spoonacular.com/recipes/${recipeID}/nutritionWidget?&defaultCss=true&apiKey=1b6d876044c14f4aa40ac59f38fb45fc`;
  const [post, setPost] = useState([]);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
>>>>>>> dcf1bcc3a86c48cc17c080dd254a9902af76ed88

  const [showSave, setShowSave] = useState(false);
  const handleCloseSave = () => setShowSave(false);
  const handleShowSave = () => setShowSave(true);

  let mounted = true;

  useEffect(() => {
    getRecipeInfo();
    getRecipeNutritionVisualised();
    return () => {
      mounted = false;
    };
  }, []);

<<<<<<< HEAD
=======
  const handlePostInputChange = (event) => {
    setPost(event.target.value);
  }

>>>>>>> dcf1bcc3a86c48cc17c080dd254a9902af76ed88
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
              <div className="card mb-3 clearfix" key={recipe.id}>
                <img className="card-img-top" src={recipe.image} alt="recipe" />
                <div className="card-body">
<<<<<<< HEAD
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
=======

                  <h4>
                    <b>{recipe.title}</b>
                  </h4>
                  <p> Ready in: {" " + recipe.readyInMinutes + " "} minutes<br />Servings: {" " + recipe.servings}</p>
                  <button className="btn btn-primary"
                    onClick={() =>
                      handleShow()
                    }
                  >
                    Share
                    </button>
                  <button className="btn btn-secondary float-right"
                    onClick={() =>
                      handleShowSave()
                    }>
                    Save
                    </button>
                  <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Share Recipe</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <strong>Post Preview:</strong>
                      <div className="card">
                        {recipe.image === null ? (
                          <img src="noimage.jpg" />
                        ) : (
                          <img
                            src={recipe.image}
                            alt="recipe"
                          />
                        )}
                        <div className="card-body">
                          <div className="card-title">
                            <h3>{recipe.title}</h3>
                          </div>
                          <div>
                            <label>
                              Post Description:<br />
                              <input type="text" onChange={handlePostInputChange} />
                            </label>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => {
                        handlePostClick(post, recipeID, recipe.image, recipe.title)
                        handleClose()
                      }}>
                        Publish
                        </button>
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                  </Modal>
                  <Modal show={showSave} onHide={handleCloseSave}>
                    <Modal.Header closeButton>
                      <Modal.Title>Save Recipe</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Recipe has been saved.</Modal.Body>
                    <Modal.Footer></Modal.Footer>
                  </Modal>

>>>>>>> dcf1bcc3a86c48cc17c080dd254a9902af76ed88
                  <hr />
                  <button
                    className="btn btn-warning w-100"
                    onClick={() => setShowIngredients(!showIngredients)}
                  >
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
                    onClick={() => setShowInstructions(!showInstructions)}
                  >
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
              onClick={() => setShowNutrition(!showNutrition)}
            >
              Nutritional Information
            </button>
            <Collapse in={showNutrition}>
              <div className="card mb-3">
                <div
                  className="card-body"
                  id="nutritionalInfo"
                  dangerouslySetInnerHTML={{ __html: nutritionChart }}
                ></div>
              </div>
            </Collapse>
          </div>
        </div>
      </div>
    );
  }
}
