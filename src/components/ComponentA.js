import React from "react";

export default function ComponentA(props){
   
  if (props.apiData.length !==0 && props.recipeNum < props.apiData.length){ 
    return(
       <div>
        <img src={props.apiData[props.recipeNum].image} alt="Unavailable"></img>   
        <span className="center"><h3>{props.apiData[props.recipeNum].title}</h3></span>   
      </div>
    )}
  else{
    return (
      <span className="center"><h3>No more recipes. Please change filters </h3></span>  
     )
    }
  }