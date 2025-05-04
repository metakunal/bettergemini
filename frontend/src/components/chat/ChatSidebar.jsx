import { useEffect, useState } from "react";
import io from "socket.io-client";
import "./ChatSidebar.css";

const socket = io(`${import.meta.env.VITE_BACKEND_URL}`);

const ChatSidebar = ({ sessionId, name }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    if (sessionId && name) {
      socket.emit("joinSession", { name, sessionId });
    }

    socket.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chatMessage");
    };
  }, [sessionId, name]);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("sendMessage", {
        sessionId,
        sender: name,
        message: input,
      });
      setInput("");
    }
  };

  const copyLink = () => {
    const url = `${window.location.origin}?sessionId=${sessionId}`;
    navigator.clipboard.writeText(url);
    alert("Invite link copied!");
  };

  if (collapsed) {
    return (
      <div className="chat-toggle-right" onClick={() => setCollapsed(false)}>
        💬
      </div>
    );
  }

  return (
    <div className="chat-sidebar-right">
      <div className="chat-header">
        <h3>Chat</h3>
        <button onClick={() => setCollapsed(true)}>⏩</button>
      </div>
      <button className="copy-link-btn" onClick={copyLink}>
        Copy Invite Link
      </button>
      <div className="chat-messages">
  {messages.map((msg, idx) => {
    const isOwn = msg.sender === name;
    return (
      <div key={idx} className={`chat-bubble ${isOwn ? "own" : "other"}`}>
        <span className="sender">{isOwn ? "You" : msg.sender}</span>
        <div className="text">{msg.text}</div>
      </div>
    );
  })}
</div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatSidebar;
