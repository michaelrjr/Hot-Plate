import React, { useState } from "react";
import './chatMessages.css';
import Sidebar from './Sidebar';
import Chat from './Chat';


function chatMessages() {
    return (
        <div className="chatMessages">
          {/*Sidebar*/}
          <Sidebar/>
            {/*Chat*/}
            <Chat />
        </div>
      );
}

export default chatMessages;