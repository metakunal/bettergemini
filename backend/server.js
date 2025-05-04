// server.js
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" }
});

const sessions = {};

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("joinSession", ({ name, sessionId }) => {
    if (!sessions[sessionId]) {
      sessions[sessionId] = [];
    }
    socket.join(sessionId);
    sessions[sessionId].push({ id: socket.id, name });
    io.to(sessionId).emit("chatMessage", {
      sender: "System",
      text: `${name} joined the chat.`,
    });
  });

  socket.on("sendMessage", ({ sessionId, message, sender }) => {
    io.to(sessionId).emit("chatMessage", { sender, text: message });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    // Optional: Handle disconnection from sessions
  });
});

app.get("/generateSession", (req, res) => {
  const sessionId = uuidv4();
  res.json({ sessionId });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
