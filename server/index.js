function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

const rooms = {};

socket.on("join-room", ({ roomId, username }) => {
  if (!rooms[roomId]) {
    socket.emit("error-message", "Room does not exist");
    return;
  }

  rooms[roomId].users[socket.id] = username;
  socket.join(roomId);

  socket.emit("room-joined", {
    roomId,
    isHost: false,
    users: rooms[roomId].users
  });

  io.to(roomId).emit("user-list", rooms[roomId].users);
});

io.on("connection", (socket) => {

  socket.on("create-room", ({ username }) => {
  const roomId = generateRoomCode();

  rooms[roomId] = {
    host: socket.id,
    users: { [socket.id]: username },
    videoState: { videoId: "", time: 0, playing: false }
  };

  socket.join(roomId);

  socket.emit("room-created", {
    roomId,
    isHost: true,
    users: rooms[roomId].users
  });
});
});


  socket.on("video-state", ({ roomId, videoId, time, playing }) => {
    rooms[roomId].videoId = videoId;
    rooms[roomId].time = time;
    rooms[roomId].playing = playing;
    socket.to(roomId).emit("sync-video", { videoId, time, playing });
  });

  socket.on("chat-message", ({ roomId, message, username }) => {
    io.to(roomId).emit("chat-message", { message, username });
  });

  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      delete rooms[roomId].users[socket.id];
      io.to(roomId).emit("user-list", rooms[roomId].users);
    }
  });

server.listen(3000, () => console.log("Server running on 3000"));
