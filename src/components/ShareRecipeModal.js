import React, { useState } from "react";
import { Collapse, Modal } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

export default function ShareRecipeModal(props) {
  const { recipeID, handlePostClick } = useAuth();
  const [showIngredients, setShowIngredients] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showPostButton, setShowPostButton] = useState(true);
  const [postMessage, setPostMessage] = useState("");

  const handlePostMessageChange = (event) => {
    setPostMessage(event.target.value);
  };

  return (
    <div>
      {props.userCreatedRecipe.map((recipe) => (
        <Modal show={props.show} onHide={props.handleClose} key={recipe.id}>
          <Modal.Header closeButton>
            <Modal.Title>{recipe.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img className="card-img-top mb-3" src={recipe.image} />
            <div className="mb-3">{recipe.description}</div>
            <div className="mb-3">
              <button className="btn btn-warning w-100" onClick={() => setShowIngredients(!showIngredients)}>
                Ingredients
              </button>
              {showIngredients && (
                <div className="mt-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </div>
              )}
            </div>
            <div className="mb-3">
              <button className="btn btn-danger w-100" onClick={() => setShowInstructions(!showInstructions)}>
                Instructions
              </button>
              {showInstructions && (
                <div className="mt-3">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </div>
              )}
            </div>
            {showPostButton && (
              <div className="mb-3">
                <button className="btn btn-success w-100" onClick={() => setShowPostButton(false)}>
                  Click me to add a message to your post
                </button>
              </div>
            )}
            {!showPostButton && (
              <div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    placeholder="Enter a post message"
                    onChange={handlePostMessageChange}
                  />
                </div>
              </div>
            )}
            <div>
              <button
                className="btn btn-primary w-100"
                onClick={() => {
                  handlePostClick(postMessage, recipe.id, recipe.image, recipe.title);
                  props.handleClose();
                }}>
                Post
              </button>
            </div>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      ))}
    </div>
  );
}
