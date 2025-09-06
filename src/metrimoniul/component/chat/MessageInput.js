import React, { useState } from "react";
import "../../assets/css/MessageList.css";

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (message.trim() !== "") {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleUpload = () => {
  };

  return (
    <div className="message-input-container">
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <div className="upload-button" onClick={handleUpload}>
        <i class="fa-solid fa-upload"></i>
      </div>
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default MessageInput;
