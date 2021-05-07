import React, { useEffect, useRef } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { RiDeleteBin7Line } from "react-icons/ri";

const AlwaysScrollToBottom = () => {
  const elementRef = useRef();
  useEffect(() => elementRef.current.scrollIntoView());
  return <div ref={elementRef} />;
};



export default function DisplayChat(props) {
  return (
    <div className="card">
      {props.otherUserDetails.map((user) => (
        <div className="chat-nav card-header" key={user.uuid}>
          <button className="back" onClick={props.handleCloseChatClick}>
            <IoIosArrowBack />
          </button>
          <img
            className="rounded-circle ml-3"
            src={user.avatar != null ? user.avatar : "defaultuser.png"}
            height="60"
            width="60"
          />
          <div className="d-inline ml-4">
            <b>{user.firstName + " " + user.lastName}</b>
          </div>
        </div>
      ))}
      <div className="card-body chat-body p-1">
        <div className="mt-3">
          {props.chatMessages.map((message) => (
            <div key={message.timestamp}>
              {message.from !== props.currentUser.email && (
                <div className="d-flex flex-column mt-1">
                  <div className="other-user-msg">{message.message}</div>
                  <small className="align-self-start message-timestamp">
                    {new Date(message.timestamp?.toDate()).toLocaleString()}
                  </small>
                </div>
              )}
              {message.from === props.currentUser.email && (
                <div className="d-flex flex-column">
                  <div className="current-user-msg">
                    {message.message}
                    <RiDeleteBin7Line
                      className="delete"
                      onClick={() =>
                        props.handleDeleteMessageClick(message.message)
                      }
                    />
                  </div>
                  <small className="align-self-end message-timestamp">
                    {new Date(message.timestamp?.toDate()).toLocaleString()}
                  </small>
                </div>
              )}
            </div>
          ))}
          <AlwaysScrollToBottom />
        </div>
      </div>
      <form
        className="input-group input-message"
        onSubmit={props.handleSendMessage}>
        <input
          type="text"
          className="form-control shadow-none"
          placeholder="Type a message"
          aria-describedby="basic-addon2"
          value={props.message}
          onChange={props.handleInputBoxChange}
        />
        <div className="input-group-append">
          <button
            className="btn btn-outline-secondary shadow-none"
            type="submit">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}