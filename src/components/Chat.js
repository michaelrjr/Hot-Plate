import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import app from "../firebase";
import { firebase } from "@firebase/app";

export default function Chat() {
  const { currentUser, signOut } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  //database ref
  const ref = app.firestore().collection("Users");

  useEffect(() => {
    getOnlineUsers();
    if (showChat === true) {
      getChatMessages();
    }
  }, []);

  // query users collection for documents where online == true
  // these are currently "online" users
  const getOnlineUsers = () => {
    ref.where("online", "==", true).onSnapshot((querySnapshot) => {
      setOnlineUsers(querySnapshot.docs.map((doc) => doc.data()));
    });
  };

  const handleStartChatClick = (email) => {
    setUserEmail(email);
    setShowChat(true);
    getChatMessages(email);
  };

  const handleCloseChatClick = () => {
    setShowChat(false);
  };

  const handleInputBoxChange = (event) => {
    setMessage(event.target.value);
    console.log(event.target.value);
  };

  // send the message to the other users sub-collection
  // and send the message to the current users sub collection (person sending message)
  const handleSendMessage = (event) => {
    const email = userEmail;
    event.preventDefault();
    ref.doc(userEmail).collection(currentUser.email).add({
      message: message,
      from: currentUser.email,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    ref.doc(currentUser.email).collection(userEmail).add({
      message: message,
      from: currentUser.email,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setMessage("");
  };

  // get the chat messages (docs) from current users sub-collection
  const getChatMessages = (email) => {
    ref
      .doc(currentUser.email)
      .collection(email)
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => {
        setChatMessages(snapshot.docs.map((doc) => doc.data()));
      });
    setMessage("");
  };

  return (
    <div className="current-users">
      <div className="row">
      {showChat == false ?
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h3>Online Users</h3>
              <div>
                {onlineUsers.map((user) => (
                  <div key={user.uuid}>
                    {user.email !== currentUser.email && (
                      <div>
                        <div className="online-icon"></div>
                        <div className="online-user">
                          <b>Email:</b>
                          {" " + user.email}
                        </div>
                        <div>
                          <button
                            onClick={() => handleStartChatClick(user.email)}
                          >
                            Start Chat
                          </button>
                        </div>
                        <br />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div> : null }

      
        <div className="col">

          {showChat && (
            <div className="card">
              <div className="card-body">
                <div>
                  <button onClick={handleCloseChatClick}>Close Chat</button>
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <b>{currentUser.email + " "}</b> is chatting with{" "}
                  <b>{" " + userEmail}</b>
                </div>
                <div className="chat-messages">
                  {chatMessages.map((message) => (
                    <div
                      key={message.timestamp}
                      style={{ marginBottom: "10px" }}
                    >
                      <div>
                        {message.from !== currentUser.email && (
                          <div className="other-user-msg">
                            {message.message}
                          </div>
                        )}
                      </div>
                      <div>
                        {message.from === currentUser.email && (
                          <div className="current-user-msg">
                            {message.message}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <br />
                <div className="chat-input-box">
                  <form onSubmit={handleSendMessage}>
                    <input
                      type="text"
                      placeholder="Enter message"
                      value={message}
                      onChange={handleInputBoxChange}
                    />
                    <button type="submit" className="buttons">
                      Send
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
