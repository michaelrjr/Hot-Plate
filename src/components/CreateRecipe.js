import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import app from "../firebase";
import { useFormik } from "formik";
import * as Yup from "yup";
import { BsTrash } from "react-icons/bs";
import DisplayUserCreatedRecipe from "./DisplayUserCreatedRecipe";
import { v4 as uuidv4 } from "uuid";

export default function CreateRecipe() {
  const [fileURL, setFileURL] = useState(null);
  const { currentUser } = useAuth();
  const [fileName, setFileName] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [instruction, setInstruction] = useState("");
  const [instructionsArray, setInstructionsArray] = useState("");
  const [ingredientsArray, setIngredientsArray] = useState("");
  const [userCreatedRecipe, setUserCreatedRecipe] = useState(null);
  const [error, setError] = useState(null);
  // db ref
  const ref = app.firestore().collection("userCreatedRecipes");

  const formik = useFormik({
    initialValues: {
      title: "",
      image: "",
      description: "",
      ingredients: [],
      instructions: [],
      id: uuidv4(),
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Required"),
      image: Yup.mixed().required("Required"),
      description: Yup.string().required("Required"),
      ingredients: Yup.array().min(1).required("Required"),
      instructions: Yup.array().min(1).required("Required"),
    }),

    onSubmit: async (values) => {
      ref.doc(currentUser.email).set(values);
      getUserCreatedRecipe();
    },
  });

  // uploads a file and adds it to firebase storage
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setFileName(e.target.files[0].name);
    const storageRef = app.storage().ref();
    const fileRef = storageRef.child(file.name);
    await fileRef.put(file);
    setFileURL(await fileRef.getDownloadURL());
    formik.setFieldValue("image", await fileRef.getDownloadURL());
  };

  const handleIngredientsChange = (e) => {
    setIngredient(e.target.value);
    console.log(e.target.value);
  };

  const handleAddIngredientClick = () => {
    const newItems = [...ingredientsArray, ingredient];
    setIngredientsArray(newItems);
    formik.setFieldValue("ingredients", newItems);
    setIngredient("");
  };

  const handleInstructionsChange = (e) => {
    setInstruction(e.target.value);
    console.log(e.target.value);
  };

  const handleAddInstructionClick = () => {
    const newItems = [...instructionsArray, instruction];
    setInstructionsArray(newItems);
    formik.setFieldValue("instructions", newItems);
    setInstruction("");
  };

  const handleDeleteIngredientClick = (index) => {
    const newItems = ingredientsArray.filter(
      (item, itemIndex) => itemIndex !== index
    );
    setIngredientsArray(newItems);
  };

  const handleDeleteInstructionClick = (index) => {
    const newItems = instructionsArray.filter(
      (item, itemIndex) => itemIndex !== index
    );
    setInstructionsArray(newItems);
  };

  const getUserCreatedRecipe = () => {
    ref
      .doc(currentUser.email)
      .get()
      .then((doc) => {
        let tempArr = [];
        tempArr.push(doc.data());
        setUserCreatedRecipe(tempArr);
        console.log(tempArr);
      })
      .catch((error) => {
        setError("Error retrieving user created recipe.");
      });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">
                Create Your Own Recipe
              </h3>
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                  <div className="custom-file">
                    <input
                      type="file"
                      className={`${
                        formik.touched.image &&
                        formik.errors.image &&
                        "custom-file-input is-invalid"
                      } ${
                        formik.touched.image && !formik.errors.image
                          ? "custom-file-input is-valid"
                          : "custom-file-input"
                      }`}
                      id="image"
                      name="image"
                      onChange={handleFileChange}
                      onBlur={formik.handleBlur}
                    />
                    {fileName ? (
                      <label className="custom-file-label" htmlFor="image">
                        {fileName}
                      </label>
                    ) : (
                      <label className="custom-file-label" htmlFor="image">
                        Choose recipe image...
                      </label>
                    )}
                    {formik.touched.image && formik.errors.image ? (
                      <div className="invalid-feedback">
                        {formik.errors.image}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="title">Recipe Title</label>
                  <input
                    className={`${
                      formik.touched.title &&
                      formik.errors.title &&
                      "form-control is-invalid"
                    } ${
                      formik.touched.title && !formik.errors.title
                        ? "form-control is-valid"
                        : "form-control"
                    }`}
                    placeholder="Enter recipe title"
                    id="title"
                    name="title"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.title}
                  ></input>
                  {formik.touched.title && formik.errors.title ? (
                    <div className="invalid-feedback">
                      {formik.errors.title}
                    </div>
                  ) : null}
                </div>

                <div className="mb-3">
                  <label htmlFor="description">Description</label>
                  <input
                    className={`${
                      formik.touched.description &&
                      formik.errors.description &&
                      "form-control is-invalid"
                    } ${
                      formik.touched.description && !formik.errors.description
                        ? "form-control is-valid"
                        : "form-control"
                    }`}
                    placeholder="Enter recipe description"
                    id="description"
                    name="description"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                  ></input>
                  {formik.touched.description && formik.errors.description ? (
                    <div className="invalid-feedback">
                      {formik.errors.description}
                    </div>
                  ) : null}
                </div>

                <div className="row">
                  <div className="col">
                    <div className="mb-3">
                      <label htmlFor="ingredients">Add Ingredients</label>
                      <input
                        className={`${
                          formik.touched.ingredients &&
                          formik.errors.ingredients &&
                          "form-control is-invalid"
                        } ${
                          formik.touched.ingredients &&
                          !formik.errors.ingredients
                            ? "form-control is-valid"
                            : "form-control"
                        }`}
                        placeholder="Enter ingredients"
                        id="ingredients"
                        name="ingredients"
                        type="text"
                        onChange={handleIngredientsChange}
                        onBlur={formik.handleBlur}
                        value={ingredient}
                      ></input>
                      {formik.touched.ingredients &&
                      formik.errors.ingredients ? (
                        <div className="invalid-feedback">
                          {formik.errors.ingredients}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="col">
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={handleAddIngredientClick}
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div className="mb-3">
                  {ingredientsArray.length > 0 && (
                    <div>
                      {ingredientsArray.map((ingredient, index) => (
                        <div className="d-flex" key={index}>
                          <li>{ingredient}</li>
                          <div
                            className="ml-5"
                            onClick={() => handleDeleteIngredientClick(index)}
                          >
                            <BsTrash />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="row">
                  <div className="col">
                    <div className="mb-3">
                      <label htmlFor="instructions">Add Instructions</label>
                      <input
                        className={`${
                          formik.touched.instructions &&
                          formik.errors.instructions &&
                          "form-control is-invalid"
                        } ${
                          formik.touched.instructions &&
                          !formik.errors.instructions
                            ? "form-control is-valid"
                            : "form-control"
                        }`}
                        placeholder="Enter instructions"
                        id="instructions"
                        name="instructions"
                        type="text"
                        onChange={handleInstructionsChange}
                        onBlur={formik.handleBlur}
                        value={instruction}
                      ></input>
                      {formik.touched.instructions &&
                      formik.errors.instructions ? (
                        <div className="invalid-feedback">
                          {formik.errors.instructions}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="col">
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={handleAddInstructionClick}
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div className="mb-3">
                  {instructionsArray.length > 0 && (
                    <div>
                      {instructionsArray.map((instruction, index) => (
                        <div className="d-flex" key={index}>
                          <li>{instruction}</li>
                          <div
                            className="ml-5"
                            onClick={() => handleDeleteInstructionClick(index)}
                          >
                            <BsTrash />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <button type="submit" className="btn btn-warning w-100">
                    Build
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col">
          <DisplayUserCreatedRecipe userCreatedRecipe={userCreatedRecipe} />
        </div>
      </div>
    </div>
  );
}
