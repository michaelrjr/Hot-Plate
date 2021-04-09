import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import app from "../firebase";
import { firebase } from "@firebase/app";
import DisplayOnlineUsers from "./DisplayOnlineUsers";
import DisplayChat from "./DisplayChat";

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

  //database ref
  const ref = app.firestore().collection("Users");
  const convoRef = app.firestore().collection("conversations");

  useEffect(() => {
    getOnlineUsers();
    getMembers();
    if (showChat === true) {
      getChatMessages();
    }
  }, []);

  // query users collection for documents where online == true, these are currently "online" users
  const getOnlineUsers = () => {
    ref.where("online", "==", true).onSnapshot((querySnapshot) => {
      setOnlineUsers(querySnapshot.docs.map((doc) => doc.data()));
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
        console.log(tempArr);
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  };

  // show chat and also get chat messages from firestore
  const handleStartChatClick = (email) => {
    setOtherUserEmail(email);
    setShowChat(true);
    getChatMessages(email);
    getOtherUserDetails(email);
  };

  // close chat
  const handleCloseChatClick = () => {
    setShowChat(false);
  };

  const handleInputBoxChange = (event) => {
    setMessage(event.target.value);
  };

  // send message to the current user and the other user (user you are messaging)
  const handleSendMessage = (event) => {
    event.preventDefault();

    // reference to users collection -> then other users document -> then the sub-collection with the current user
    // -> then add the message to the sub-colletion as a document
    // ref.doc(otherUserEmail).collection(currentUser.email).add({
    //   message: message,
    //   from: currentUser.email,
    //   timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    // });

    // reference to users collection -> then the current users document -> then the sub-collection with the other users email
    // -> then add the message to the sub-colletion as a document
    // ref.doc(currentUser.email).collection(otherUserEmail).add({
    //   message: message,
    //   from: currentUser.email,
    //   timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    // });

    convoRef
      .doc(`${otherUserEmail}_${currentUser.email}`)
      .collection("messages")
      .add({
        message: message,
        from: currentUser.email,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

    convoRef
      .doc(`${currentUser.email}_${otherUserEmail}`)
      .collection("messages")
      .add({
        message: message,
        from: currentUser.email,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

    // reset message to empty string
    setMessage("");
  };

  // get the chat messages (docs) from current users sub-collection
  const getChatMessages = (email) => {
    // ref
    //   .doc(currentUser.email)
    //   .collection(email)
    //   .orderBy("timestamp", "asc")
    //   .onSnapshot((snapshot) => {
    //     setChatMessages(snapshot.docs.map((doc) => doc.data()));
    //   });
    convoRef
      .doc(`${currentUser.email}_${email}`)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => {
        console.log(snapshot.docs.map((doc) => doc.data()));
        setChatMessages(snapshot.docs.map((doc) => doc.data()));
      });
  };

  //handle delete
  const handleDeleteMessageClick = (msg) => {
    ref
      .doc(currentUser.email)
      .collection(otherUserEmail)
      .where("message", "==", msg)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });
      });
    ref
      .doc(otherUserEmail)
      .collection(currentUser.email)
      .where("message", "==", msg)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });
      });
  };

  return (
    <div className="container chat-container p-2">
      {showChat == false ? (
        <DisplayOnlineUsers
          members={members}
          searchMember={searchMember}
          currentUser={currentUser}
          onlineUsers={onlineUsers}
          handleStartChatClick={handleStartChatClick}
          handleSearch={handleSearch}
        />
      ) : null}
      {showChat == true ? (
        <DisplayChat
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
      ) : null}
    </div>
  );
}
