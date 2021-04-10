import React from "react";

export default function DisplayOnlineUsers(props) {
  // filter search results
  const membersFilterFunction = (searchMember) => {
    return function (members) {
      let firstName = members.firstName.toLowerCase();
      let lastName = members.lastName.toLowerCase();

      return (
        firstName.includes(searchMember.toLowerCase()) ||
        lastName.includes(searchMember.toLowerCase())
      );
    };
  };

  return (
    <div className="card online-user-body">
      <div className="card-header online-user-nav">
        <h3>Users</h3>
        <input
          type="text"
          className="form-control shadow-none"
          placeholder="Search Users"
          aria-label="Searh Users"
          value={props.searchMember}
          onChange={props.handleSearch}
          aria-describedby="basic-addon1"
        />
      </div>
      {props.members
        .filter(membersFilterFunction(props.searchMember))
        .map((user) => (
          <div key={user.uuid} className="card">
            {user.email !== props.currentUser.email && (
              <div key={user.uuid} className="row align-items-center p-2">
                <div className="col pr-2">
                  <img
                    className="p-1 rounded-circle"
                    src={user.avatar != null ? user.avatar : "defaultuser.png"}
                    height="80"
                    width="80"
                  />
                  <div
                    className={
                      user.online
                        ? "online-icon mb-4"
                        : "online-icon online-icon-offline mb-4"
                    }></div>
                </div>
                <div className="col-8">
                  {user.firstName + " " + user.lastName}
                  <br />
                  <a
                    className="online-user-email"
                    href={"mailto:" + user.email}>
                    {user.email}
                  </a>
                  <br />
                  <small className="user-status">
                    Status: {user.online ? "Cooking" : "Eating"}
                  </small>
                </div>

                <div className="col">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => props.handleStartChatClick(user.email, props.currentUser.email)}>
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
