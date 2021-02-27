import React from 'react';
import { Avatar } from '@material-ui/core';
import "./SidebarChat.css";

function SidebarChat() {
    return (
        <div className="sidebarChat">
           <Avatar/> 
           <div className="sidebarChat__info">
               <h3>Contact Name</h3>
               <p>Last message sent...</p>
               <small>timestamp</small>
           </div>
        </div>
    )
}

export default SidebarChat;