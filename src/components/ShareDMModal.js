import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import DisplayOnlineUsers from "./Chat/DisplayOnlineUsers";
import { v4 as uuidv4 } from "uuid";
import { firebase } from "@firebase/app";
import app from "../firebase";

export default function ShareRecipeModal(props) {
  const {currentUser} = useAuth();
  const [showIngredients, setShowIngredients] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showPostButton, setShowPostButton] = useState(true);
  const [postMessage, setPostMessage] = useState("");
  const feedCollection = app.firestore().collection("feed");
  const [userData, setUserData] = useState(null);
  var isMounted=false;
  const conversationsColl = app.firestore().collection("conversations");
  const usersColl = app.firestore().collection("Users");
  const [members, setMembers] = useState([]);
  const [searchMember, setSearchMember] = useState("");
  const [message, setMessage] = useState();
  
  useEffect(() => {
    isMounted=true;
    const theMessage = "linkTo:moreInfo,withRecipeID:"+props.recipeID;
    setMessage(theMessage);
    getUserData();
    const unsub1 = getMembers();
    return () => {
        isMounted=false;
        unsub1();
    }
  }, []);
  
  function getUserData(){
    usersColl.doc(currentUser.email).get().then((doc) => {
      if(isMounted) setUserData(doc.data());
    });
  }
  
  const getMembers = () => {
    return usersColl.where("email", "!=", null).onSnapshot((querySnapshot) => {
      if(isMounted) setMembers(querySnapshot.docs.map((doc) => doc.data()));
    });
  };

  
  const handleSearch = (event) => {
    if(isMounted) setSearchMember(event.target.value);
  };

  const handleSendDMClick = (otherUserEmail) => {
    console.log("handleSendDMClick: recipeID: "+props.recipeID);
    console.log("handleSendDMClick: otheremail: "+otherUserEmail);
    conversationsColl.doc(otherUserEmail).collection("messages").add({
      message: message,
      from: currentUser.email,
      to: otherUserEmail,
      read: false,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    }).then((docRef) =>{
        console.log("Document written with ID: ",docRef.id);
    });
    console.log("handleSendDMClick: currentemail: "+currentUser.email);
    conversationsColl.doc(currentUser.email).collection("messages").add({
      message: message,
      from: currentUser.email,
      to: otherUserEmail,
      read: false,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    }).then((docRef) =>{
        console.log("Document written with ID: ",docRef.id);
    });
}

  return (
    <div> {
        console.log("currentUser:",currentUser)}
        <Modal show={props.showDMModal} onHide={props.handleDMShowShare} dialogClassName="modal-90w">
        <Modal.Header closeButton>
            <Modal.Title>Select a User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="user-list">
                <DisplayOnlineUsers
                    members={members}
                    searchMember={searchMember}
                    currentUser={currentUser}
                    handleSendDMClick={handleSendDMClick}
                    handleSearch={handleSearch}
                    shareDMModalOrigin={true}
                />
            </div>
        </Modal.Body>
        <Modal.Footer>
            <button className="btn btn-secondary btn-md" onClick={props.handleDMShowShare}>
            Cancel
            </button>
        </Modal.Footer>
        </Modal>
        
    </div>
  );
}
