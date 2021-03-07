import React, { useEffect, useState } from "react";
import ComponentA from "./ComponentA";
import FoodFilter from "./FoodFilter"
import axios from "axios";

export default function RecipeSearch(){
  const [apiData, setApiData] = useState([]);
  const [recipeNum, setRecipeNum] = useState(0);
  const [filters, setFilters] = useState({cuisine: "", diet: "", intolerance: "", meal: "", ingredients: "", equipment: ""});
  
  var offset = 0;

  useEffect(() => {
    
    getRandomRecipes();
  },[]);

  const getRandomRecipes = async () => {
    try {
      if (filters.cuisine === "" && filters.diet === "" && filters.meal === "" && filters.intolerance === "" && filters.ingredients === "" && filters.equipment === ""){
        let API_URL = `https://api.spoonacular.com/recipes/random?number=100&information&apiKey=a877df555b0b40488df279ef75acd509`;
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
        let API_URL = `https://api.spoonacular.com/recipes/complexSearch?diet=${filters.diet}&intolerances=${filters.intolerance}&type=${filters.meal}&cuisine=${filters.cuisine}&includeIngredients=${filters.ingredients}&equipment=${filters.equipment}&number=100&offset=${offset}&information&apiKey=a877df555b0b40488df279ef75acd509`;
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
  }

  function updateDiet(event){
    setFilters(prevFilters => {
      return { ...prevFilters, diet: event.target.value}
    });   
    console.log(event.target.value);
  }

  function updateIntolerance(event){
    setFilters(prevFilters => {
      return { ...prevFilters, intolerance: event.target.value}
    });   
    console.log(event.target.value);
  }

  function updateMeal(event){
    setFilters(prevFilters => {
      return { ...prevFilters, meal: event.target.value}
    });   
    console.log(event.target.value);
  }

  function updateEquipment(event){
    setFilters(prevFilters => {
      return { ...prevFilters, equipment: event.target.value}
    });   
    console.log(event.target.value);
  }

  function updateIngredients(event){
    setFilters(prevFilters => {
      return { ...prevFilters, ingredients: event.target.value}
    });   
    console.log(event.target.value);
  }

  function applyFilters(){
    setRecipeNum(0);
    offset = 0;
    getRandomRecipes(); 
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
      updateMeal={updateMeal}
      updateEquipment={updateEquipment}
      updateIngredients={updateIngredients}
      applyFilters={applyFilters}
      />
    </div>
  );
} 