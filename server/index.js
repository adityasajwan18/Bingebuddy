const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

const rooms = {};

io.on("connection", (socket) => {

  socket.on("join-room", ({ roomId, username }) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = {
        host: socket.id,
        users: {},
        videoId: "",
        time: 0,
        playing: false
      };
    }

    rooms[roomId].users[socket.id] = username;

    socket.emit("room-data", rooms[roomId]);
    io.to(roomId).emit("user-list", rooms[roomId].users);
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
});

server.listen(3000, () => console.log("Server running on 3000"));
