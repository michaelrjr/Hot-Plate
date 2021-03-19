import React, { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard";
import FoodFilter from "./FoodFilter";
import { Modal } from 'react-bootstrap';

import axios from "axios";

export default function RecipeSearch() {
  const [apiData, setApiData] = useState([]);
  const [recipeNum, setRecipeNum] = useState(0);
<<<<<<< HEAD
  const [allFilters, setAllFilters] = useState(false);

  const [isFetched, setIsFetched] = useState(false);
  const [error, setError] = useState(null);

=======
  // const [allFilters, setAllFilters] = useState(false);
>>>>>>> dcf1bcc3a86c48cc17c080dd254a9902af76ed88
  const [filters, setFilters] = useState({
    cuisine: "",
    diet: "",
    intolerance: "",
    meal: "",
    time: "1000",
  });
<<<<<<< HEAD
=======
  const [loading, setLoading] = useState(true);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
>>>>>>> dcf1bcc3a86c48cc17c080dd254a9902af76ed88

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
<<<<<<< HEAD
        let API_URL = `https://api.spoonacular.com/recipes/random?number=100&information&apiKey=28f4c1acf9cc4a96863ed9298ac43eb3`;
=======
        let API_URL = `https://api.spoonacular.com/recipes/random?number=100&information&apiKey=2604e0a31deb4e02aa952bb582e5002e`;
>>>>>>> dcf1bcc3a86c48cc17c080dd254a9902af76ed88
        const resp = await axios.get(API_URL);
        setIsFetched(true);
        //console.log(API_URL);

        if (resp.data.totalResults === 0) {
          offset = 0;
          setLoading(false);
          setShow(true);
          console.log("No more recipes. Change your search or try again");
        }
<<<<<<< HEAD
        //apiShuffle(resp.data.recipes);
=======
>>>>>>> dcf1bcc3a86c48cc17c080dd254a9902af76ed88
        setApiData(resp.data.recipes);
        console.log(resp.data.recipes);
        console.log(resp.data.recipes.length);
      } else {
<<<<<<< HEAD
        let API_URL = `https://api.spoonacular.com/recipes/complexSearch?diet=${filters.diet}&intolerances=${filters.intolerance}&type=${filters.meal}&cuisine=${filters.cuisine}&includeIngredients=${filters.ingredients}&equipment=${filters.equipment}&maxReadyTime=${filters.time}&number=100&offset=${offset}&information&apiKey=28f4c1acf9cc4a96863ed9298ac43eb3`;
        const resp = await axios.get(API_URL);
        console.log(API_URL);
        if (resp.data.totalResults === 0) {
          offset = 0;
          console.log("No more recipes. Change your search or try again");
        }
        //apiShuffle(resp.data.results);
        setApiData(resp.data.results);
        console.log(resp.data.results);
        console.log(resp.data.results.length);
=======
        getFilteredRecipes();
>>>>>>> dcf1bcc3a86c48cc17c080dd254a9902af76ed88
      }
    } catch (error) {
      // Handle Error Here
      console.error(error);
      setIsFetched(false);
      setError(error);
    }
  }
  const getFilteredRecipes = async () => {
    try {
      setLoading(true);
      let API_URL = `https://api.spoonacular.com/recipes/complexSearch?diet=${filters.diet}&intolerances=${filters.intolerance}&type=${filters.meal}&cuisine=${filters.cuisine}&maxReadyTime=${filters.time}&number=100&offset=${offset}&sort=random&information&apiKey=2604e0a31deb4e02aa952bb582e5002e`;
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
      // Handle Error Here
      console.error(error);
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
    setFilters((prevFilters) => {
      return { ...prevFilters, diet: event.target.value };
    });
  }

  function updateIntolerance(event) {
    setFilters((prevFilters) => {
      return { ...prevFilters, intolerance: event.target.value };
    });
  }

  function updateMeal(event) {
    setFilters((prevFilters) => {
      return { ...prevFilters, meal: event.target.value };
    });
  }

  // function updateEquipment(event) {
  //   setFilters((prevFilters) => {
  //     return { ...prevFilters, equipment: event.target.value };
  //   });
  // }

  // function updateIngredients(event) {
  //   setFilters((prevFilters) => {
  //     return { ...prevFilters, ingredients: event.target.value };
  //   });
  // }

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

<<<<<<< HEAD
  if (isFetched === false) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>Error with api request</div>;
  } else {
    return (
      <div>
        <RecipeCard
          apiData={apiData}
          recipeNum={recipeNum}
          component={RecipeCard}
          nextRecipe={nextRecipe}
          allFiltersSet={() => setAllFilters(!allFilters)}
        />
        {allFilters && (
          <FoodFilter
            filters={filters.cuisine}
            updateCuisine={updateCuisine}
            updateDiet={updateDiet}
            updateIntolerance={updateIntolerance}
            updateMeal={updateMeal}
            updateEquipment={updateEquipment}
            updateIngredients={updateIngredients}
            updateMaxTime={updateMaxTime}
            applyFilters={applyFilters}
            allFiltersSet2={() => setAllFilters(true)}
          />
        )}
      </div>
    );
  }
=======
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
>>>>>>> dcf1bcc3a86c48cc17c080dd254a9902af76ed88
}
