const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const rooms = {};

// 🔹 helper to generate room codes
function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ✅ CREATE ROOM
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
    });

    console.log(`Room created: ${roomId}`);
  });

  // ✅ JOIN ROOM
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
      users: rooms[roomId].users,
    });

    io.to(roomId).emit("user-list", rooms[roomId].users);

    console.log(`${username} joined room ${roomId}`);
  });

  // ✅ CHAT
  socket.on("chat", ({ roomId, message, username }) => {
    if (!rooms[roomId]) return;
    io.to(roomId).emit("chat", { username, message });
  });

  // ✅ TYPING INDICATORS
  // Emits when a user starts typing and stops typing. Clients use these to show typing UX.
  socket.on("typing", ({ roomId, username }) => {
    if (!rooms[roomId]) return;
    socket.to(roomId).emit("user-typing", username);
  });

  socket.on("stop-typing", ({ roomId, username }) => {
    if (!rooms[roomId]) return;
    socket.to(roomId).emit("user-stop-typing", username);
  });

  // ✅ DISCONNECT
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    for (const roomId in rooms) {
      if (rooms[roomId].users[socket.id]) {
        // notify others that this user stopped typing (cleanup)
        const username = rooms[roomId].users[socket.id];
        socket.to(roomId).emit("user-stop-typing", username);

        delete rooms[roomId].users[socket.id];
        io.to(roomId).emit("user-list", rooms[roomId].users);
      }
    }
  });
});

server.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
