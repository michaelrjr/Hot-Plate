import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { RiDeleteBin7Line } from "react-icons/ri";

export default function DisplayChat(props) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="d-inline">
          <button className="back" onClick={props.handleCloseChatClick}>
            <IoIosArrowBack />
          </button>
          {/* <img
              className="rounded-circle"
              src={props.onlineUsers.avatar}
              height="80"
              width="80"
          /> */}
        </div>
        <div className="d-inline ml-5">
          <b>{props.otherUserEmail}</b>
        </div>
        <div className="mt-3">
          {props.chatMessages.map((message) => (
            <div key={message.timestamp} style={{ marginBottom: "10px" }}>
              <div>
                {message.from !== props.currentUser.email && (
                  <div className="other-user-msg">{message.message}</div>
                )}
              </div>
              <div>
                {message.from === props.currentUser.email && (
                  <div className="current-user-msg">
                  {message.message}
                  <br/>
                  <RiDeleteBin7Line className="delete" onClick={() =>
                    props.handleDeleteMessageClick(message.message)
                  }/>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <br />
        <div>
          <form onSubmit={props.handleSendMessage}>
            <input
              className="form-control"
              type="text"
              placeholder="Enter message"
              value={props.message}
              onChange={props.handleInputBoxChange}
            />
            <button type="submit" className="btn btn-success w-100 mt-3">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
