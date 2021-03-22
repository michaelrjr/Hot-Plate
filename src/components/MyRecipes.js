import React, { useState, useEffect } from "react";
import app from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { AiOutlineShareAlt } from "react-icons/ai";
import { BsInfoSquare } from "react-icons/bs";
import DisplayUserCreatedRecipe from "./DisplayUserCreatedRecipe";
import ShareRecipeModal from "./ShareRecipeModal";

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const userCreatedRecipesRef = app
    .firestore()
    .collection("userCreatedRecipes");
  const { currentUser } = useAuth();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showIngredients, setShowIngredients] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    getUserCreatedRecipes();
  }, []);

  const getUserCreatedRecipes = () => {
    userCreatedRecipesRef
      .doc(currentUser.uid)
      .collection("recipes")
      .get()
      .then((querySnapshot) => {
        let tempArr = [];
        querySnapshot.forEach((doc) => {
          tempArr.push(doc.data());
        });
        setRecipes(tempArr);
        console.log(tempArr);
      });
  };

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
                <div className="col mb-2">
                  <button className="btn btn-primary w-100">
                    <div className="d-inline mr-1">
                      <AiOutlineShareAlt size={20} />
                    </div>
                    <div className="d-inline">Share</div>
                  </button>
                </div>
                <div className="col">
                  <button className="btn btn-success w-100">
                    <div className="d-inline mr-1">
                      <BsInfoSquare size={20} />
                    </div>
                    <div className="d-inline">Info</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
