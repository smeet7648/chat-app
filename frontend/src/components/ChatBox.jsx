import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("https://chat-app-1eqw.onrender.com");

function ChatBox({ selectedUser }) {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const bottomRef = useRef();

  // Connect socket
  useEffect(() => {
    socket.emit("join", currentUser.id);

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  // Load old messages
  useEffect(() => {
    if (selectedUser) {
      loadMessages();
    }
  }, [selectedUser]);

  const loadMessages = async () => {
    const res = await axios.get(
      `https://chat-app-1eqw.onrender.com/api/messages/${selectedUser._id}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    setMessages(res.data);
  };

  // Send message
  const sendMessage = async () => {
    if (!text.trim()) return;

    const message = {
      receiver: selectedUser._id,
      text,
    };

    // Save in MongoDB
    await axios.post(
      "https://chat-app-1eqw.onrender.com/api/messages",
      message,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    // Show immediately
    const myMessage = {
      sender: currentUser.id,
      receiver: selectedUser._id,
      text,
    };

    setMessages((prev) => [...prev, myMessage]);

    // Send to other user
    socket.emit("sendMessage", myMessage);

    setText("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="chatbox">
        <h2>Select a User</h2>
      </div>
    );
  }

  return (
    <div className="chatbox">
      <h2>{selectedUser.name}</h2>

      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.sender === currentUser.id
                ? "my-message"
                : "other-message"
            }
          >
            <b>
              {msg.sender === currentUser.id
                ? currentUser.name
                : selectedUser.name}
            </b>

            <p>{msg.text}</p>
          </div>
        ))}

        <div ref={bottomRef}></div>
      </div>

      <div className="send-box">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type Message..."
        />

        <button onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBox;