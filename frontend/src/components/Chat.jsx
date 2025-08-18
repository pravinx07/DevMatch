import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../../utils/socket";
import { useSelector } from 'react-redux';

const Chat = () => {
  const { toUserId } = useParams();
  const [message, setMessage] = useState({
    text: "helllo",
  });

  const user = useSelector(store=>store.user)
  const userID = user?._id
  

  useEffect(()=> {
    const socket = createSocketConnection()
    socket.emit("join",userID, toUserId)
  },[])
  return (

    <div className="flex w-full max-w-2xl mx-auto border border-gray-700 rounded-xl flex-col bg-base-200 h-[70vh] shadow-md overflow-hidden">
  {/* Header */}
  <div className="p-4 border-b border-gray-600 bg-gray-800 text-white">
    <h1 className="text-center text-2xl font-bold">Chat</h1>
  </div>

  {/* Chat Body */}
  <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-900 text-white">
    <div className="chat chat-start">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          <img
            alt="User avatar"
            src="https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
          />
        </div>
      </div>
      <div className="chat-header text-sm font-semibold">
        Obi-Wan Kenobi
        <time className="text-xs opacity-50 ml-2">12:45</time>
      </div>
      <div className="chat-bubble bg-gray-700 text-white">
        You were the Chosen One!
      </div>
      <div className="chat-footer text-xs opacity-50">Delivered</div>
    </div>

    {/* Add more messages here */}
  </div>

  {/* Input Section */}
  <div className="flex items-center gap-2 p-4 bg-gray-800 border-t border-gray-600">
    <input
      type="text"
      placeholder="Type a message..."
      className="input input-bordered flex-1 bg-gray-700 text-white placeholder-gray-400"
    />
    <button className="btn btn-primary">Send</button>
  </div>
</div>

  );
};

export default Chat;
