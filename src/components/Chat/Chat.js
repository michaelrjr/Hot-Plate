import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import app from "../../firebase";
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
    event.preventDefault();
    db.doc(`${otherUserEmail}`).collection("messages").add({
      message: message,
      from: currentUser.email,
      to: otherUserEmail,
      read: false,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    db.doc(`${currentUser.email}`).collection("messages").add({
      message: message,
      from: currentUser.email,
      to: otherUserEmail,
      read: false,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setMessage("");
  };

  // get the chat messages (docs) from current users sub-collection
  const getChatMessages = (email) => {
    db.doc(`${email}`)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => {
        console.log(snapshot.docs.map((doc) => doc.data()));
        setChatMessages(snapshot.docs.map((doc) => doc.data()));
      });
  };

  //update read status to true when start chat button is clicked
  const setMessageToRead = (email) => {
    db.doc(`${email}`)
      .collection("messages")
      .where("to", "==", email)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.update({ read: true });
          console.log(doc.data());
        });
      });
  };

  //handle delete
  const handleDeleteMessageClick = (msg) => {
    db.doc(`${currentUser.email}`)
      .collection("messages")
      .where("message", "==", msg)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });
      });
    db.doc(`${otherUserEmail}`)
      .collection("messages")
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
      {/* {console.log(showChat)} */}
      {/* {showChat == false ? ( */}
        <DisplayOnlineUsers
          members={members}
          chatMessages={chatMessages}
          searchMember={searchMember}
          currentUser={currentUser}
          onlineUsers={onlineUsers}
          handleStartChatClick={handleStartChatClick}
          handleSearch={handleSearch}
        />
      {/* ) : null} */}
      {/* {showChat == true ? ( */}
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
      {/* ) : null} */}
    </div>
  );
}
