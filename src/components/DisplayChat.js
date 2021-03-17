import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { RiDeleteBin7Line } from "react-icons/ri";

export default function DisplayChat(props) {
  // const a = props.otherUserDetails;
  return (
    <div className="card">
    
      <div className="card-body">
        <div className="d-inline">
          {props.otherUserDetails.map((we) => (
            <div>
          <button className="back" onClick={props.handleCloseChatClick}>
            <IoIosArrowBack />
          </button>
            <img 
              className="rounded-circle ml-2"
              src={we.avatar}
              height="60"
              width="60"
            />
            <div className="d-inline ml-4">
              <b>{we.firstName+" "+we.lastName}</b>
            </div>
            </div>
          ))}
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
