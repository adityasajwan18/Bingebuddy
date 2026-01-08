function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const rooms = {};

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("create-room", ({ username }) => {
    const roomId = generateRoomCode();

    rooms[roomId] = {
      host: socket.id,
      users: { [socket.id]: username },
      videoState: { videoId: "", time: 0, playing: false },
    };

    socket.join(roomId);

    socket.emit("room-created", {
      roomId,
      isHost: true,
      users: rooms[roomId].users,
      videoState: rooms[roomId].videoState,
    });

    // send initial state to host
    socket.emit("init-state", {
      host: rooms[roomId].host,
      users: rooms[roomId].users,
      videoState: rooms[roomId].videoState,
    });

    io.to(roomId).emit("user-list", rooms[roomId].users);
  });

  socket.on("join-room", ({ roomId, username }) => {
    if (!rooms[roomId]) {
      socket.emit("error-message", "Room does not exist");
      return;
    }

    rooms[roomId].users[socket.id] = username;
    socket.join(roomId);

    socket.emit("room-joined", {
      roomId,
      isHost: socket.id === rooms[roomId].host,
      users: rooms[roomId].users,
      videoState: rooms[roomId].videoState,
    });

    socket.emit("init-state", {
      host: rooms[roomId].host,
      users: rooms[roomId].users,
      videoState: rooms[roomId].videoState,
    });

    io.to(roomId).emit("user-list", rooms[roomId].users);
  });

  // Host sets a new video by link (videoId)
  socket.on("set-video", ({ roomId, videoId }) => {
    if (!rooms[roomId]) return;
    rooms[roomId].videoState.videoId = videoId;
    rooms[roomId].videoState.time = 0;
    rooms[roomId].videoState.playing = false;

    io.to(roomId).emit("sync-video", {
      videoId,
      time: 0,
      playing: false,
    });
  });

  // Host updates playback state (time/playing)
  socket.on("video-update", ({ roomId, videoState }) => {
    if (!rooms[roomId]) return;
    rooms[roomId].videoState = { ...rooms[roomId].videoState, ...videoState };

    socket.to(roomId).emit("sync-video", videoState);
  });

  socket.on("chat-message", ({ roomId, message, username }) => {
    io.to(roomId).emit("chat-message", { message, username });
  });

  // client requests the current room init state (useful when Player mounts after create/join)
  socket.on("request-init", ({ roomId }) => {
    if (!rooms[roomId]) return;
    socket.emit("init-state", {
      host: rooms[roomId].host,
      users: rooms[roomId].users,
      videoState: rooms[roomId].videoState,
    });
  });

  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      if (rooms[roomId].users && rooms[roomId].users[socket.id]) {
        delete rooms[roomId].users[socket.id];
        io.to(roomId).emit("user-list", rooms[roomId].users);

        // if room empty, remove it
        if (Object.keys(rooms[roomId].users).length === 0) {
          delete rooms[roomId];
        } else if (rooms[roomId].host === socket.id) {
          // assign a new host
          rooms[roomId].host = Object.keys(rooms[roomId].users)[0];
          io.to(roomId).emit("host-changed", rooms[roomId].host);
        }
      }
    }
  });
});

server.listen(3000, () => console.log("Server running on 3000"));
