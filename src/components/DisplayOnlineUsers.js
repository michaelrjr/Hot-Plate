import React from "react";
import { Link } from "react-router-dom";

export default function DisplayOnlineUsers(props) {
  return (
    <div className="card">
      <div className="card-body">
        <h3>Online Users</h3>
        <div>
          {props.onlineUsers.map((user) => (
            <div key={user.uuid}>
              {user.email !== props.currentUser.email && (
                <div>
                  <div className="online-icon"></div>
                  <img
                    className="rounded-circle"
                    src={user.avatar}
                    height="80"
                    width="80"
                  />
                  <div className="online-user">
                    <b>Email:</b>
                    {" " + user.email}
                  </div>
                  <div>
                    <button
                      onClick={() => props.handleStartChatClick(user.email)}
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
  );
}
