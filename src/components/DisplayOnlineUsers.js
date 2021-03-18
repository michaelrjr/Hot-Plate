import React from "react";

export default function DisplayOnlineUsers(props) {
  return (
    <div className='card online-user-body'>
      <div className='card-header online-user-nav'>
        <h3>Online Users</h3>
      </div>
      {props.onlineUsers.map((user) => (
        <div key={user.uuid} className="card">
          {user.email !== props.currentUser.email && (
            <div key={user.uuid} className='row align-items-center p-2'>
              <div className='col'>
                <div className='m-2 online-icon'></div>
                <img
                  className='p-1 rounded-circle'
                  src={user.avatar}
                  height='80'
                  width='80'
                />
              </div>
              <div className='col-6'>
                {user.firstName + " " + user.lastName}
                <br/>
                {"email: " + user.email}
              </div>
              <div className='col'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  onClick={() => props.handleStartChatClick(user.email)}>
                  Start Chat
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
