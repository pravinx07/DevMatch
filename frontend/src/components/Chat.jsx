import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createSocketConnection } from "../../utils/socket";

export default function Chat({ toUserId }) {
  const user = useSelector((store) => store.user);
  const userID = user?._id;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingUser, setTypingUser] = useState(null);

  useEffect(() => {
    if (!userID || !toUserId) return;

    const socket = createSocketConnection();

    // Join private room
    socket.emit("join", userID, toUserId);

    // Listen for private messages
    socket.on("privateMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Listen for typing events
    socket.on("typing", ({ from, isTyping }) => {
      setTypingUser(isTyping ? from : null);
    });

    return () => {
      socket.off("privateMessage");
      socket.off("typing");
    };
  }, [userID, toUserId]);

  // Send message
  const sendMessage = () => {
    const socket = createSocketConnection();
    socket.emit("privateMessage", userID, toUserId, input);
    setInput("");
    socket.emit("typing", userID, toUserId, false); // stop typing after sending
  };

  // Handle typing
  const handleTyping = (e) => {
    setInput(e.target.value);

    const socket = createSocketConnection();
    socket.emit("typing", userID, toUserId, e.target.value.length > 0);
  };

  return (
    <div>
      <h2>Chat with {toUserId}</h2>

      <div style={{ minHeight: "200px", border: "1px solid #ccc", padding: "8px" }}>
        {messages.map((m, i) => (
          <p key={i}>
            <b>{m.from === userID ? "You" : m.from}:</b> {m.message}
          </p>
        ))}

        {/* Show typing indicator */}
        {typingUser && typingUser !== userID && (
          <p style={{ fontStyle: "italic", color: "gray" }}>
            {typingUser} is typing...
          </p>
        )}
      </div>

      <input
        value={input}
        onChange={handleTyping}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
