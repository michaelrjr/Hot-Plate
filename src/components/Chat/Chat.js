import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import app from "../../firebase";
import { firebase } from "@firebase/app";
import DisplayOnlineUsers from "./DisplayOnlineUsers";
import DisplayChat from "./DisplayChat";
import { v4 as uuidv4 } from "uuid";
import { propTypes } from "react-bootstrap/esm/Image";

export default function Chat() {
  const { currentUser } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [otherUserEmail, setOtherUserEmail] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [otherUserDetails, setOtherUserDetails] = useState([]);
  const [members, setMembers] = useState([]);
  const [searchMember, setSearchMember] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const bottomElement = useRef();

  //database ref
  const db = app.firestore().collection("conversations");
  const ref = app.firestore().collection("Users");

  useEffect(() => {
    getOnlineUsers();
    getMembers();
    if (showChat == true) {
      getChatMessages();
    }
    // return () => setShowChat(false);
  }, []);

  // query users collection for documents where online == true, these are currently "online" users
  const getOnlineUsers = () => {
    ref.where("online", "==", true).onSnapshot((querySnapshot) => {
      setOnlineUsers(querySnapshot.docs.map((doc) => doc.data()));
      setIsLoading(false);
    });
  };

  //get all signed up users
  const getMembers = () => {
    ref.where("email", "!=", null).onSnapshot((querySnapshot) => {
      setMembers(querySnapshot.docs.map((doc) => doc.data()));
    });
  };

  //search members
  const handleSearch = (event) => {
    setSearchMember(event.target.value);
  };

  // gets the other users document from the users collection
  // and stores that object in an array called otherUsersDetails
  const getOtherUserDetails = (email) => {
    ref
      .doc(email)
      .get()
      .then((doc) => {
        let tempArr = [];
        tempArr.push(doc.data());
        setOtherUserDetails(tempArr);
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  };

  // show chat and also get chat messages from firestore, second param allows for
  //update of message.read field from false to true for the current users received messages
  const handleStartChatClick = (otherEmail, currentEmail) => {
    setOtherUserEmail(otherEmail);
    // scrollToBottomElement();
    setShowChat(true);
    getChatMessages(otherEmail);
    setMessageToRead(currentEmail);
    getOtherUserDetails(otherEmail);
  };

  // close chat
  const handleCloseChatClick = () => {
    setShowChat(false);
  };

  const handleInputBoxChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = (event) => {

    const commentID = uuidv4();
    event.preventDefault();
    db.doc(`${otherUserEmail}`).collection("messages").add({
      message: message,
      from: currentUser.email,
      to: otherUserEmail,
      read: false,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      commentID: commentID,
    });
    db.doc(`${currentUser.email}`).collection("messages").add({
      message: message,
      from: currentUser.email,
      to: otherUserEmail,
      read: false,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      commentID: commentID,
    });

    setMessage("");
  };

  // get the chat messages (docs) from current users sub-collection
  const getChatMessages = (email) => {
    db.doc(`${email}`)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => {
        setChatMessages(snapshot.docs.map((doc) => doc.data()));
      });
  };

//   function scrollToBottomElement(){
//     if(bottomElement.current){
//         bottomElement.current.scrollTop = bottomElement.current.scrollHeight;
//     }
// }

  //update read status to true when start chat button is clicked
  const setMessageToRead = (email) => {
    db.doc(`${email}`)
      .collection("messages")
      .where("to", "==", email)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.update({ read: true });
        });
      });
  };

  //handle delete
  const handleDeleteMessageClick = (id) => {
    db.doc(`${currentUser.email}`)
      .collection("messages")
      .where("commentID", "==", id)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });
      });
    db.doc(`${otherUserEmail}`)
      .collection("messages")
      .where("commentID", "==", id)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });
      });
  };

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

  return (
    <div className="container d-flex justify-content-center pb-3" style={{ minHeight: "100%" }}>
    <div className="w-100" style={{ maxWidth: "450px" }}>
      {showChat == false ? (
        <DisplayOnlineUsers
          members={members}
          chatMessages={chatMessages}
          searchMember={searchMember}
          currentUser={currentUser}
          onlineUsers={onlineUsers}
          handleStartChatClick={handleStartChatClick}
          handleSearch={handleSearch}
        />
      ) : null}
      {showChat == true ? (
        <DisplayChat
          // ref={bottomElement}
          otherUserDetails={otherUserDetails}
          currentUser={currentUser}
          chatMessages={chatMessages}
          handleCloseChatClick={handleCloseChatClick}
          handleDeleteMessageClick={handleDeleteMessageClick}
          handleSendMessage={handleSendMessage}
          otherUserEmail={otherUserEmail}
          message={message}
          handleInputBoxChange={handleInputBoxChange}
          handleDeleteMessageClick={handleDeleteMessageClick}
        />
      ): null}
    </div>
    </div>
  );
}
