import React, { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard";
import FoodFilter from "./FoodFilter";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { isInteger } from "formik";

export default function RecipeSearch() {
  const [apiData, setApiData] = useState([]);
  const [recipeNum, setRecipeNum] = useState(0);
  const [isFetched, setIsFetched] = useState(false);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [cuisine, setCuisine] = useState("");
  const [mealType, setMealType] = useState("");
  const [intolerance, setIntolerance] = useState("");
  const [diet, setDiet] = useState("");
  const [maxTime, setMaxTime] = useState("");
  const [enabled, setEnabled] = useState(false);

  // call getRandomRecipes() when the page loads
  useEffect(() => {
    getFilteredRecipes();
  }, []);

  // // this functions requests random recipes from spoonacular
  // const getRandomRecipes = async () => {
  //   let API_URL = `https://api.spoonacular.com/recipes/random?number=100&information&apiKey=6e056eaaa0b64faab0ef479298c17f9b`;
  //   try {
  //     const resp = await axios.get(API_URL);
  //     setApiData(resp.data.recipes);
  //     console.log("random recipes ", resp.data.recipes);
  //     setIsFetched(true);
  //   } catch (error) {
  //     setIsFetched(false);
  //     setError(error);
  //   }
  // };

  // this function requests filtered recipes from spoonacular
  const getFilteredRecipes = async () => {
    let API_URL;
    if (maxTime === "") {
      API_URL = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?diet=${diet}&intolerances=${intolerance}&type=${mealType}&cuisine=${cuisine}&maxReadyTime=1000&number=100&sort=random&information&rapidapi-key=${process.env.REACT_APP_API_KEY}`;
    } else {
      API_URL = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?diet=${diet}&intolerances=${intolerance}&type=${mealType}&cuisine=${cuisine}&maxReadyTime=${maxTime}&number=100&sort=random&information&rapidapi-key=${process.env.REACT_APP_API_KEY}`;
    }
    try {
      const resp = await axios.get(API_URL);
      setApiData(resp.data.results);
      console.log(API_URL);
      console.log("filtered recipes ", resp.data.results);
      setIsFetched(true);
    } catch (error) {
      setIsFetched(false);
      setError(error);
    }
  };

  // if we are at the end of the array set recipeNum to 0
  // otherwise increment recipeNum by 1
  const nextRecipe = () => {
    if (recipeNum === apiData.length - 1) {
      setRecipeNum(0);
      // will need to handle what happens when we reach the end of the array with both random recipes and filtered recipes...
    } else {
      setRecipeNum(recipeNum + 1);
    }
  }

  const updateCuisine = (event) => {
    setCuisine(event.target.value);
    setEnabled(true);
  }

  const updateDiet = (event) => {
    setDiet(event.target.value);
    setEnabled(true);
  }

  const updateIntolerance = (event) => {
    setIntolerance(event.target.value);
    setEnabled(true);
  }

  const updateMealType = (event) => {
    setMealType(event.target.value);
    setEnabled(true);
  }

  const updateMaxTime = (event) => {
    setMaxTime(event.target.value);
    setEnabled(true);
  }

  const applyFilters = () => {
    if ((maxTime !== "" && !/^\d+$/.test(maxTime)) || parseInt(maxTime) <= 0) {
      setMaxTime("");
      setEnabled(false);
      alert("Please insert a valid time.");
    } else {
      setRecipeNum(0);
      getFilteredRecipes();
      setEnabled(false);
      handleCloseFilters();
    }
  }

  //resets inputs to default values
  const removeFilters = () => {
    if ((cuisine, diet, intolerance, maxTime, mealType !== "")) {
      setCuisine("");
      setDiet("");
      setIntolerance("");
      setMealType("");
      setMaxTime("");
      setEnabled(true);
    }
  }

  // handle closing and opening modal
  const handleCloseFilters = () => setShow(false);
  const handleShowFilters = () => setShow(true);

  // if the data is not yet fetched
  if (isFetched === false) {
    return (
      <div>
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-center">
              <div
                className="spinner-border"
                style={{ width: "11rem", height: "11rem" }}
                role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    // or if there is an error with the API request
  } else if (error) {
    return (
      <div className="card">
        <div className="card-body col text-center">
          <span>
            <b>API Call Error</b>
          </span>
          <img
            src="https://pixy.org/src/69/thumbs350/692078.jpg"
            className="img-fluid img-thumbnail"
            alt="error"></img>
        </div>
      </div>
    );
  } else if (apiData.length === 0) {
    return (
      <div>
        <h1>No Recipes Found.</h1>
        <h3>Please change filters.</h3>
        <FoodFilter
          cuisine={cuisine}
          mealType={mealType}
          intolerance={intolerance}
          diet={diet}
          maxTime={maxTime}
          updateCuisine={updateCuisine}
          updateDiet={updateDiet}
          updateIntolerance={updateIntolerance}
          updateMealType={updateMealType}
          updateMaxTime={updateMaxTime}
          applyFilters={applyFilters}
          removeFilters={removeFilters}
          enabled={enabled}
        />
      </div>
    );
  } else {
    // otherwise, we have data
    return (
      <div>
        <RecipeCard
          apiData={apiData}
          recipeNum={recipeNum}
          nextRecipe={nextRecipe}
          handleShowFilters={handleShowFilters}
        />
        <Modal show={show} onHide={handleCloseFilters}>
          <Modal.Header closeButton>
            <Modal.Title>Recipe Filters</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FoodFilter
              cuisine={cuisine}
              mealType={mealType}
              intolerance={intolerance}
              diet={diet}
              maxTime={maxTime}
              updateCuisine={updateCuisine}
              updateDiet={updateDiet}
              updateIntolerance={updateIntolerance}
              updateMealType={updateMealType}
              updateMaxTime={updateMaxTime}
              applyFilters={applyFilters}
              removeFilters={removeFilters}
              enabled={enabled}
            />
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      </div>
    );
  }
}
