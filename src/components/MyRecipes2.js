import React, { useState, useEffect } from "react";
import app from "../firebase";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { AiOutlineShareAlt } from "react-icons/ai";
import { BsInfoSquare } from "react-icons/bs";
import DisplayUserCreatedRecipe from "./DisplayUserCreatedRecipe";
import ShareRecipeModal from "./ShareRecipeModal";

export default function MyRecipes2() {
  const [recipes, setRecipes] = useState([]);
  const { currentUser, setRecipeID } = useAuth();
  const userCreatedRecipesRef = app.firestore().collection("userCreatedRecipes");
  //   const userAPIRecipeRef = app
  //     .firestore()
  //     .collection("userAPIRecipes")
  //     .doc(currentUser.uid)
  //     .collection("recipes");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showIngredients, setShowIngredients] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserCreatedRecipes = () => {
      userCreatedRecipesRef
        .where("authorUID", "==", currentUser.uid)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let tempArr = [];
            tempArr.push(doc.data());
            setRecipes(tempArr);
            console.log(tempArr);
            setIsLoading(false);
          });
        });
    };
    getUserCreatedRecipes();
    // getSavedAPIRecipes();
  }, []);

<<<<<<< HEAD
  const getUserCreatedRecipes = () => {
    userCreatedRecipesRef
      .where("authorUID", "==", currentUser.uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          tempArr.push(doc.data());
        });
        setRecipes(tempArr);
        console.log(tempArr);
      });
  };
=======
  //   const getSavedAPIRecipes = () => {
  //     userAPIRecipeRef
  //     .get()
  //     .then((queryAPISnapshot) =>{
  //       queryAPISnapshot.forEach((doc) =>{
  //         tempArr.push(doc.data());
  //       }) ;
  //       setRecipes(tempArr);
  //       console.log(tempArr);
  //     })
  //   }

  if (isLoading) {
    return (
      <div className="container-fluid">
        <div className="d-flex">
          <strong className="mr-3">
            <h3>Loading..</h3>
          </strong>
          <div className="spinner-border" role="status" aria-hidden="true"></div>
        </div>
      </div>
    );
  }
>>>>>>> 6ab8437a461670831afe361ee851de2d2bd731f7

  if (recipes.length === 0) {
    return (
      <div className="container">
        <div className="alert alert-warning" role="alert">
          <h3>Your custom recipes created will appear here.</h3>
        </div>
      </div>
    );
  } else {
    return (
      <div className="container">
        <div className="card-columns">
          {recipes.map((recipe, index) => (
            <div className="card mb-3" key={index}>
              <img className="card-img-top" src={recipe.image} />
              <div className="card-body">
                <div className="mb-3">
                  <h3>{recipe.title}</h3>
                </div>
                <div className="row">
                  {/* <div className="col mb-2">
                  <button className="btn btn-primary w-100">
                    <div className="d-inline mr-1">
                      <AiOutlineShareAlt size={20} />
                    </div>
                    <div className="d-inline">Share</div>
                  </button>
                </div> */}
                  <div className="col">
                    <Link to="/moreinfo">
                      <button className="btn btn-success w-100" onClick={() => setRecipeID(recipe.id)}>
                        <div className="d-inline mr-1">
                          <BsInfoSquare size={20} />
                        </div>
                        <div className="d-inline">Info</div>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
