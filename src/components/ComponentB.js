import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ComponentB(props) {
  const [isFetched, setIsFetched] = useState(false);
  const size = "636x393.jpg";
  const basePath = "https://spoonacular.com/recipeImages/";
  const { setRecipeID } = useAuth();
  let apiKey = "2604e0a31deb4e02aa952bb582e5002e";
  // apiKey = "6e056eaaa0b64faab0ef479298c17f9b";
  const API_URL = `https://api.spoonacular.com/recipes/${props.recipeID}/information?&apiKey=${apiKey}`;
  const [resp, setResp] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  let mounted=true;

  useEffect(() => {
      getRecipeInfo();
      return() => {
        mounted = false;
      };
  }, []);

  const getRecipeInfo = () => {
      axios.get(API_URL).then((response) => {
          if(mounted){
              let tempArr = response.data;
              setIsFetched(true);
              setResp(tempArr);
          }
      }).catch((error) => {
          setIsFetched(false);
          setErrorMsg(error);
          console.log(error);
      });
  }

  if(errorMsg){
      console.log("API_URL: "+API_URL);
      return(
        <div>An error occurred.</div>
      );
  } else if(!isFetched){
      return(
        <div>Loading please wait...</div>
      );
  } else{
    if (resp) {
        return (
            <div className="card">
                {resp.image === null ? (
                    <img src="noimage.jpg" />
                ) : (
                    <img
                    src={`${basePath}${props.recipeID}-${size}`}
                    alt="recipe"
                    />
                )}
                <div className="card-body">
                    <div className="card-title">
                    <h3>{resp.title}</h3>
                    </div>
                    <Link to="/moreinfo">
                    <button
                        className="buttons"
                        onClick={() => setRecipeID(props.recipeID)}
                    >
                        More Info
                    </button>
                    </Link>
                </div>
            </div>
        );
    }
    else{
        return(
            <div>Empty JSON</div>
        )
    }
  }
}
