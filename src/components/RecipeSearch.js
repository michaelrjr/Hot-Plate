import React, { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard";
import FoodFilter from "./FoodFilter";
import axios from "axios";

export default function RecipeSearch() {
  const [apiData, setApiData] = useState([]);
  const [recipeNum, setRecipeNum] = useState(0);
  const [allFilters, setAllFilters] = useState(false);

  const [isFetched, setIsFetched] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    cuisine: "",
    diet: "",
    intolerance: "",
    meal: "",
    ingredients: "",
    equipment: "",
    time: "1000",
  });

  var offset = 0;

  useEffect(() => {
    getRandomRecipes();
  }, []);

  const getRandomRecipes = async () => {
    try {
      if (
        filters.cuisine === "" &&
        filters.diet === "" &&
        filters.meal === "" &&
        filters.intolerance === "" &&
        filters.ingredients === "" &&
        filters.equipment === "" &&
        filters.time === "1000"
      ) {
        let API_URL = `https://api.spoonacular.com/recipes/random?number=100&information&apiKey=28f4c1acf9cc4a96863ed9298ac43eb3`;
        const resp = await axios.get(API_URL);
        setIsFetched(true);
        //console.log(API_URL);

        if (resp.data.totalResults === 0) {
          offset = 0;
          console.log("No more recipes. Change your search or try again");
        }
        //apiShuffle(resp.data.recipes);
        setApiData(resp.data.recipes);
        console.log(resp.data.recipes);
        console.log(resp.data.recipes.length);
      } else {
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
      }
    } catch (error) {
      // Handle Error Here
      console.error(error);
      setIsFetched(false);
      setError(error);
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

  function apiShuffle(array) {
    let i = array.length - 1;
    for (; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
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

  function updateEquipment(event) {
    setFilters((prevFilters) => {
      return { ...prevFilters, equipment: event.target.value };
    });
  }

  function updateIngredients(event) {
    setFilters((prevFilters) => {
      return { ...prevFilters, ingredients: event.target.value };
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
  }

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
}
