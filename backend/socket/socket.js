import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// userId => socketId
 const userSocketMap = {};
 export const getReceiverSocketId=(receiver)=>{
    return userSocketMap[receiver];
 }

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // Send updated online users list
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // Remove user from map
    for (const id in userSocketMap) {
      if (userSocketMap[id] === socket.id) {
        delete userSocketMap[id];
        break;
      }
    }

    // Send updated online users list
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };
