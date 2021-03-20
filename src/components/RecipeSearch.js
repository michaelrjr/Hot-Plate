import React, { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard";
import FoodFilter from "./FoodFilter";
import { Modal } from "react-bootstrap";
import axios from "axios";

export default function RecipeSearch() {
  // const [allFilters, setAllFilters] = useState(false);
  // const [filters, setFilters] = useState({
  //   cuisine: "",
  //   diet: "",
  //   intolerance: "",
  //   mealType: "",
  //   time: 0,
  // });
  const [apiData, setApiData] = useState([]);
  const [recipeNum, setRecipeNum] = useState(0);
  const [isFetched, setIsFetched] = useState(false);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [cuisine, setCuisine] = useState("");
  const [mealType, setMealType] = useState("");
  const [intolerance, setIntolerance] = useState("");
  const [diet, setDiet] = useState("");
  const [maxTime, setMaxTime] = useState(1000);

  // call getRandomRecipes() when the page loads
  useEffect(() => {
    getRandomRecipes();
  }, []);

  // this functions requests random recipes from spoonacular
  const getRandomRecipes = async () => {
    let API_URL = `https://api.spoonacular.com/recipes/random?number=100&information&apiKey=1b6d876044c14f4aa40ac59f38fb45fc`;
    try {
      const resp = await axios.get(API_URL);
      setApiData(resp.data.recipes);
      console.log("random recipes ", resp.data.recipes);
      setIsFetched(true);
    } catch (error) {
      setIsFetched(false);
      setError(error);
    }
  };

  // this function requests filtered recipes from spoonacular
  const getFilteredRecipes = async () => {
    let API_URL = `https://api.spoonacular.com/recipes/complexSearch?diet=${diet}&intolerances=${intolerance}&type=${mealType}&cuisine=${cuisine}&maxReadyTime=${maxTime}&number=100&sort=random&information&apiKey=1b6d876044c14f4aa40ac59f38fb45fc`;
    try {
      const resp = await axios.get(API_URL);
      setApiData(resp.data.results);
      console.log("filtered recipes ", resp.data.results);
      setIsFetched(true);
    } catch (error) {
      setIsFetched(false);
      setError(error);
    }
  };

  // if we are at the end of the array set recipeNum to 0
  // otherwise increment recipeNum by 1
  function nextRecipe() {
    if (recipeNum === apiData.length - 1) {
      setRecipeNum(0);
      // will need to handle what happens when we reach the end of the array with both random recipes and filtered recipes...
    } else {
      setRecipeNum(recipeNum + 1);
    }
  }

  function updateCuisine(event) {
    setCuisine(event.target.value);
  }

  function updateDiet(event) {
    setDiet(event.target.value);
  }

  function updateIntolerance(event) {
    setIntolerance(event.target.value);
  }

  function updateMealType(event) {
    setMealType(event.target.value);
  }

  function updateMaxTime(event) {
    setMaxTime(event.target.value);
  }

  function applyFilters() {
    setRecipeNum(0);
    getFilteredRecipes();
    handleCloseFilters();
  }

  // handle closing and opening modal
  const handleCloseFilters = () => setShow(false);
  const handleShowFilters = () => setShow(true);

  // function updateCuisine(event) {
  //   setFilters((prevFilters) => {
  //     return { ...prevFilters, cuisine: event.target.value };
  //   });
  // }

  // function updateDiet(event) {
  //   setFilters((prevFilters) => {
  //     return { ...prevFilters, diet: event.target.value };
  //   });
  // }

  // function updateIntolerance(event) {
  //   setFilters((prevFilters) => {
  //     return { ...prevFilters, intolerance: event.target.value };
  //   });
  // }

  // function uupdateMealTyp(event) {
  //   setFilters((prevFilters) => {
  //     return { ...prevFilters, mealType: event.target.value };
  //   });
  // }

  // function updateMaxTime(event) {
  //   if (event.target.value !== "") {
  //     setFilters((prevFilters) => {
  //       return { ...prevFilters, time: event.target.value };
  //     });
  //   } else {
  //     setFilters((prevFilters) => {
  //       return { ...prevFilters, time: "1000" };
  //     });
  //   }
  //   console.log(event.target.value);
  // }

  // if the data is not yet fetched
  if (isFetched === false) {
    return (
      <div>
        <div className='card'>
          <div className='card-body'>
            <div className='d-flex justify-content-center'>
              <div
                className='spinner-border'
                style={{ width: "11rem", height: "11rem" }}
                role='status'>
                <span className='sr-only'>Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    // or if there is an error with the API request
  } else if (error) {
    <div>
      <h3>API Request Error...</h3>
    </div>;
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
              updateCuisine={updateCuisine}
              updateDiet={updateDiet}
              updateIntolerance={updateIntolerance}
              updateMealType={updateMealType}
              updateMaxTime={updateMaxTime}
              applyFilters={applyFilters}
            />
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      </div>
    );
  }
}
