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
  cors: { origin: "*" },
  methods: ["GET", "POST"]
});

  

const sessions = {};

io.on("connection", (socket) => {
    console.log("A user connected");
  
    socket.on("joinSession", ({ name, sessionId }) => {
      socket.join(sessionId);
      console.log(`${name} joined session: ${sessionId}`);
    });
  
    // New: Prompt submission broadcast
    socket.on("promptSubmitted", ({ sessionId, prompt, result }) => {
      io.to(sessionId).emit("receivePrompt", { prompt, result });
    });
  
    socket.on("sendMessage", ({ sessionId, sender, message }) => {
      io.to(sessionId).emit("chatMessage", { sender, text: message });
    });
  
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
  
app.get("/generateSession", (req, res) => {
  const sessionId = uuidv4();
  res.json({ sessionId });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
