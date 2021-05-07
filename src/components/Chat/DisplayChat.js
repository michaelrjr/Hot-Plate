import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { RiDeleteBin7Line } from "react-icons/ri";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";



export default function DisplayChat(props) {
  const { setRecipeID } = useAuth();

  function MessageHasLink(message){
    if(message.substring(0,29) !== "linkTo:moreInfo,withRecipeID:"){
      return false;
    } else if(message.length>30){
      // console.log(message);
      // console.log("RecipeID: " + message.substring(29));
      return message.substring(29);
    }
  }

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
              {message.to === props.currentUser.email && message.from === props.otherUserEmail && (
                <div className="d-flex flex-column mt-1">
                  <div className="other-user-msg">
                    {message.message}
                    </div>
                  <small className="align-self-start message-timestamp">
                    {new Date(message.timestamp?.toDate()).toLocaleString()}
                  </small>
                </div>
              )}
              {message.from === props.currentUser.email && message.to === props.otherUserEmail && (
                <div className="d-flex flex-column">
                  <div className="current-user-msg">
                    {MessageHasLink(message.message)===false
                      ?
                        message.message
                      :
                        <div>
                          I thought you might like this recipe:<br />
                          <Link to="/moreinfo"><button className="" onClick={() => setRecipeID(message.message.substring(29))}>
                            View Recipe
                          </button></Link>
                        </div>
                    }
                    <RiDeleteBin7Line
                      className="chat-delete"
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
