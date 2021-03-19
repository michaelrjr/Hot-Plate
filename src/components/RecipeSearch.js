import React, { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard";
import FoodFilter from "./FoodFilter";
import { Modal } from 'react-bootstrap';

import axios from "axios";

export default function RecipeSearch() {
  const [apiData, setApiData] = useState([]);
  const [recipeNum, setRecipeNum] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);
  const [filters, setFilters] = useState({
    cuisine: "",
    diet: "",
    intolerance: "",
    meal: "",
    time: "1000",
  });
  const [loading, setLoading] = useState(true);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  var offset = 0;

  useEffect(() => {
    getRandomRecipes();
  }, []);

  const getRandomRecipes = async () => {
    try {
      setLoading(true);
      if (
        filters.cuisine === "" &&
        filters.diet === "" &&
        filters.meal === "" &&
        filters.intolerance === "" &&
        filters.time === "1000"
      ) {
        let API_URL = `https://api.spoonacular.com/recipes/random?number=100&information&apiKey=6e056eaaa0b64faab0ef479298c17f9b`;
        const resp = await axios.get(API_URL);
        //console.log(API_URL);

        if (resp.data.totalResults === 0) {
          offset = 0;
          setLoading(false);
          setShow(true);
          console.log("No more recipes. Change your search or try again");
        }
        setApiData(resp.data.recipes);
        console.log(resp.data.recipes);
        console.log(resp.data.recipes.length);
      } else {
        getFilteredRecipes();
      }
    } catch (error) {
      setErrorMsg(error);
    }
  }
  const getFilteredRecipes = async () => {
    try {
      setLoading(true);
      let API_URL = `https://api.spoonacular.com/recipes/complexSearch?diet=${filters.diet}&intolerances=${filters.intolerance}&type=${filters.meal}&cuisine=${filters.cuisine}&maxReadyTime=${filters.time}&number=100&offset=${offset}&sort=random&information&apiKey=6e056eaaa0b64faab0ef479298c17f9b`;
      const resp = await axios.get(API_URL);
      console.log(API_URL);
      if (resp.data.totalResults === 0) {
        offset = 0;
        setLoading(false);
        setShow(true);;
        console.log("No more recipes. Change your search or try again");
      }
      setApiData(resp.data.results);
      console.log(resp.data.results);
      console.log(resp.data.results.length);
  } catch (error) {
      setErrorMsg(error);
    }
  };

  function nextRecipe() {
    if (apiData.length !== 0) {
      setRecipeNum(recipeNum + 1);
    }
    console.log(recipeNum);

    if (recipeNum === apiData.length - 1) {
      setRecipeNum(0);
      if (apiData.length !== 0) {
        offset = offset + 100;
      }

      console.log(offset);
      getRandomRecipes();
    }
  }

  function updateCuisine(event) {
    setFilters((prevFilters) => {
      return { ...prevFilters, cuisine: event.target.value };
    });
  }

  function updateDiet(event) {
    //setDiet(event.target.value);
    setFilters((prevFilters) => {
      return { ...prevFilters, diet: event.target.value };
    });
  }

  function updateIntolerance(event) {
    // setIntolerance(event.target.value);
    setFilters((prevFilters) => {
      return { ...prevFilters, intolerance: event.target.value };
    });
  }

  function updateMeal(event) {
    // setMeal(event.target.value);
    setFilters((prevFilters) => {
      return { ...prevFilters, meal: event.target.value };
    });
  }

  function updateMaxTime(event) {
    if (event.target.value !== "") {
      setFilters((prevFilters) => {
        return { ...prevFilters, time: event.target.value };
      });
    } else {
      setFilters((prevFilters) => {
        return { ...prevFilters, time: "1000" };
      });
    }
    console.log(event.target.value);
  }

  function applyFilters() {
    setRecipeNum(0);
    offset = 0;
    getRandomRecipes();
    handleClose();
  }

  if (errorMsg) {
    return (
      <div>
        <div className="card">
          <div className="card-body col text-center">
            <span><b>API Call Error</b></span>
            <img
            src="https://pixy.org/src/69/thumbs350/692078.jpg"
            className="img-fluid img-thumbnail"
            alt="error"
          ></img>
          </div>
        </div>
      </div>
    );
  }
  else{
    return (
      <div>
        <RecipeCard
          apiData={apiData}
          recipeNum={recipeNum}
          component={RecipeCard}
          nextRecipe={nextRecipe}
          allFiltersSet={handleShow}
          loading={loading}
        />
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Recipe Filters</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FoodFilter
              filters={filters.cuisine}
              updateCuisine={updateCuisine}
              updateDiet={updateDiet}
              updateIntolerance={updateIntolerance}
              updateMeal={updateMeal}
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
