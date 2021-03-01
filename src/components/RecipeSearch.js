import React, { useEffect, useState } from "react";
import ComponentA from "./ComponentA";
import FoodFilter from "./FoodFilter"
import axios from "axios";

export default function RecipeSearch(){
    const [apiData, setApiData] = useState([]);
    const [recipeNum, setRecipeNum] = useState(0);
    const [filters, setFilters] = useState({cuisine: "", diet: "", intolerance: "", meal: ""});
    // const [cuisine, setCuisine] = useState("");
    // const [diet, setDiet] = useState("");
    // const [intolerance, setIntolerance] = useState("");
    // const [meal, setMeal] = useState("");
    var offset = 0;
  
    useEffect(() => {
      
      getRandomRecipes();
    },[filters]);

    const getRandomRecipes = async () => {
    try {
      if (filters.cuisine === "" && filters.diet === "" && filters.meal === "" && filters.intolerance === ""){
        let API_URL = `https://api.spoonacular.com/recipes/random?number=100&information&apiKey=6e056eaaa0b64faab0ef479298c17f9b`;
        const resp = await axios.get(API_URL);
        console.log(API_URL);
        if(resp.data.totalResults === 0){
          offset = 0;
          console.log("No more recipes. Change your search or try again");
        }
        apiShuffle(resp.data.recipes); 
        setApiData(resp.data.recipes);        
        console.log(resp.data.recipes);
        console.log(resp.data.recipes.length);
      }else{
        let API_URL = `https://api.spoonacular.com/recipes/complexSearch?diet=${filters.diet}&intolerances=${filters.intolerance}&type=${filters.meal}&cuisine=${filters.cuisine}&number=100&offset=${offset}&information&apiKey=6e056eaaa0b64faab0ef479298c17f9b`;
        const resp = await axios.get(API_URL);
        console.log(API_URL);
        if(resp.data.totalResults === 0){
          offset = 0;
          console.log("No more recipes. Change your search or try again");
        }
        apiShuffle(resp.data.results); 
        setApiData(resp.data.results);        
        console.log(resp.data.results);
        console.log(resp.data.results.length);
      }
    } catch (error) {
        // Handle Error Here
        console.error(error);
    }
};

   function nextRecipe(){
    if (apiData.length !== 0){
        setRecipeNum(recipeNum + 1);
        
    }
    console.log(recipeNum);
    if (recipeNum === apiData.length-1){
        setRecipeNum(0);
        if(apiData.length !== 0){
          offset = offset + 100;
        }
        
        console.log(offset);
        getRandomRecipes();      
    }
  }

  function apiShuffle(array){
    let i = array.length - 1;
    for (; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
  }
  
  function updateCuisine(event){
    setFilters(prevFilters => {
      return { ...prevFilters, cuisine: event.target.value}
    });   
    console.log(event.target.value);
    setRecipeNum(0);
    offset = 0;
  }

  function updateDiet(event){
    setFilters(prevFilters => {
      return { ...prevFilters, diet: event.target.value}
    });   
    console.log(event.target.value);
    setRecipeNum(0);
    offset = 0;
  }

  function updateIntolerance(event){
    setFilters(prevFilters => {
      return { ...prevFilters, intolerance: event.target.value}
    });   
    console.log(event.target.value);
    setRecipeNum(0);
    offset = 0;
  }

  function updateMeal(event){
    setFilters(prevFilters => {
      return { ...prevFilters, meal: event.target.value}
    });   
    console.log(event.target.value);
    setRecipeNum(0);
    offset = 0;
  }
  
  return (
    <div className="boxing">
    <ComponentA
      apiData={apiData}
      recipeNum={recipeNum}
      component={ComponentA}/>
      <span className="center">
        <button onClick={nextRecipe}>Nope</button>
        <button>Yep!</button>
      </span>
    
    <FoodFilter 
      filters={filters.cuisine}
      updateCuisine={updateCuisine}
      updateDiet={updateDiet}
      updateIntolerance={updateIntolerance}
      updateMeal={updateMeal}/>
    </div>
  );
} 