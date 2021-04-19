import React, { useState } from "react";
import { Modal } from "react-bootstrap";

export default function FoodFilter(props) {
  const [show, setShow] = useState(false);
  const [showIntolerances, setShowIntolerances] = useState(false);
  // handle closing and opening modal
  const handleCloseFilters = () => {
    setShow(false);
    setShowIntolerances(false);
    props.resetIntolerance();
  }
  const handleShowFilters = () => setShow(true);

    //to Hide the intolerance checkboxes and reset the intolerance array
  const closedIntolerance = () =>{
    setShowIntolerances(!showIntolerances);
    props.resetIntolerance();
  }

  const handleIntoleranceBox = (event) =>{
    const target = event.target;
    const val = target.type === 'checkbox' ? target.checked : target.value;
    
    if (val === true){
      props.updateIntolerance(true, target.value);
    }else{
      props.updateIntolerance(false, target.value);
    }
  }
  return (
    <div>
      <button type="button" className="btn btn-info w-100" onClick={handleShowFilters}>
        Filters
      </button>
      <div>
        <Modal show={show} onHide={handleCloseFilters}>
          <Modal.Header closeButton>
            <Modal.Title>Recipe Filters</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <div className="mb-2">
                <label htmlFor="cuisine">
                  <b>Cuisine</b>
                </label>
                <select
                  className="btn btn-light dropdown-toggle w-100"
                  name="cuisine"
                  id="cuisine"
                  onChange={props.updateCuisine}>
                  <option value="">None</option>
                  <option value="african">African</option>
                  <option value="american">American</option>
                  <option value="british">British</option>
                  <option value="cajun">Cajun</option>
                  <option value="caribbean">Caribbean</option>
                  <option value="chinese">Chinese</option>
                  <option value="eastern-european">Eastern European</option>
                  <option value="european">European</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                  <option value="greek">Greek</option>
                  <option value="indian">Indian</option>
                  <option value="irish">Irish</option>
                  <option value="italian">Italian</option>
                  <option value="japanese">Japanese</option>
                  <option value="jewish">Jewish</option>
                  <option value="korean">Korean</option>
                  <option value="latin-american">Latin American</option>
                  <option value="mediterranean">Mediterranean</option>
                  <option value="mexican">Mexican</option>
                  <option value="middle-eastern">Middle Eastern</option>
                  <option value="nordic">Nordic</option>
                  <option value="southern">Southern</option>
                  <option value="spanish">Spanish</option>
                  <option value="thai">Thai</option>
                  <option value="vietnamese">Vietnamese</option>
                </select>
              </div>
              <div className="mb-2">
                <label htmlFor="diet">
                  <b>Diet</b>
                </label>
                <select
                  className="btn btn-light dropdown-toggle w-100"
                  name="diet"
                  id="diet"
                  onChange={props.updateDiet}>
                  <option value="">None</option>
                  <option value="gluten-free">Gluten Free</option>
                  <option value="ketogenic">Ketogenic</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="lacto-vegetarian">Lacto-Vegetarian</option>
                  <option value="ovo-vegetarian">Ovo-Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="pescetarian">Pescetarian</option>
                  <option value="paleo">Paleo</option>
                  <option value="primal">Primal</option>
                  <option value="whole30">Whole30</option>
                </select>
              </div>
              
              <div className="mb-3">
                <label htmlFor="mealType">
                  <b>Meal Type</b>
                </label>
                <select
                  className="btn btn-light dropdown-toggle w-100"
                  name="mealType"
                  id="mealType"
                  onChange={props.updateMealType}>
                  <option value="">None</option>
                  <option value="main-course">Main Course</option>
                  <option value="side-dish">Side Dish</option>
                  <option value="dessert">Dessert</option>
                  <option value="appetizer">Appetizer</option>
                  <option value="salad">Salad</option>
                  <option value="bread">Bread</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="soup">Soup</option>
                  <option value="beverage">Beverage</option>
                  <option value="sauce">Sauce</option>
                  <option value="marinade">Marinade</option>
                  <option value="fingerfood">Fingerfood</option>
                  <option value="snack">Snack</option>
                  <option value="drink">Drink</option>
                </select>
              </div>
              <div className="mb-2">
                <label htmlFor="intolerance">
                  <b>Intolerances</b>
                </label>
                {!showIntolerances && <button className="btn btn-success btn-sm float-right" onClick={() =>setShowIntolerances(!showIntolerances)}>Show</button>}
                {showIntolerances && <button className="btn btn-warning btn-sm float-right" onClick={closedIntolerance}>Hide</button>}
                {showIntolerances && <form>
                  <input type="checkbox" value="dairy" onChange={handleIntoleranceBox}/><label>Dairy</label><br/>
                  <input type="checkbox" value="egg" onChange={handleIntoleranceBox}/><label>Egg</label><br/>
                  <input type="checkbox" value="gluten" onChange={handleIntoleranceBox}/><label>Gluten</label><br/>
                  <input type="checkbox" value="grain" onChange={handleIntoleranceBox}/><label>Grain</label><br/>
                  <input type="checkbox" value="peanut" onChange={handleIntoleranceBox}/><label>Peanut</label><br/>
                  <input type="checkbox" value="seafood" onChange={handleIntoleranceBox}/><label>Seafood</label><br/>
                  <input type="checkbox" value="sesame" onChange={handleIntoleranceBox}/><label>Sesame</label><br/>
                  <input type="checkbox" value="shellfish" onChange={handleIntoleranceBox}/><label>Shellfish</label><br/>
                  <input type="checkbox" value="soy" onChange={handleIntoleranceBox}/><label>Soy</label><br/>
                  <input type="checkbox" value="sulfite" onChange={handleIntoleranceBox}/><label>Sulfite</label><br/>
                  <input type="checkbox" value="tree-nut" onChange={handleIntoleranceBox}/><label>Tree Nut</label><br/>
                  <input type="checkbox" value="wheat" onChange={handleIntoleranceBox}/><label>Wheat</label><br/>
                </form>}
                {/* <select
                  className="btn btn-light dropdown-toggle w-100"
                  id="intolerance"
                  name="intolerance"
                  onChange={props.updateIntolerance}>
                  <option value="">None</option>
                  <option value="dairy">Dairy</option>
                  <option value="egg">Egg</option>
                  <option value="gluten">Gluten</option>
                  <option value="grain">Grain</option>
                  <option value="peanut">Peanut</option>
                  <option value="seafood">Seafood</option>
                  <option value="sesame">Sesame</option>
                  <option value="shellfish">Shellfish</option>
                  <option value="soy">Soy</option>
                  <option value="sulfite">Sulfite</option>
                  <option value="tree-nut">Tree Nut</option>
                  <option value="wheat">Wheat</option>
                </select> */}
              </div>
              <div className="mb-2">
                <button
                  className="btn btn-success w-100"
                  disabled={!props.cuisine && !props.diet && !props.mealType && props.intolerance.length==0}
                  onClick={() => {
                    props.getFilteredRecipes();
                    setShow(false);
                  }}>
                  Apply Filters
                </button>
              </div>
              <div>
                <button
                  className="btn btn-warning w-100"
                  disabled={!props.cuisine && !props.diet && !props.mealType && props.intolerance.length==0}
                  onClick={props.removeFilters}>
                  Remove Filters
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
