const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")

const app = express()
app.use(cors())

const server = http.createServer(app)
const io = new Server(server, { cors: { origin: "*" } })

const rooms = {}

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("create-room", ({ username }) => {
    const roomId = generateRoomCode()

    rooms[roomId] = {
      host: socket.id,
      users: { [socket.id]: username },
      videoState: { videoId: "", time: 0, playing: false },
    }

    socket.join(roomId)

    socket.emit("room-created", {
      roomId,
      isHost: true,
      users: rooms[roomId].users,
    })

       console.log("Room created:", roomId)
  })

  socket.on("join-room", ({ roomId, username }) => {
    if (!rooms[roomId]) {
      socket.emit("error-message", "Room not found")
      return
    }

    rooms[roomId].users[socket.id] = username
    socket.join(roomId)

    socket.emit("room-joined", { isHost: false })
    io.to(roomId).emit("user-list", rooms[roomId].users)

    console.log(username, "joined", roomId)
  })

  // 🎥 VIDEO SET
  socket.on("set-video", ({ roomId, videoId }) => {
    if (!rooms[roomId]) return

    rooms[roomId].videoState = {
      videoId,
      time: 0,
      playing: false,
    }

    io.to(roomId).emit("video-changed", rooms[roomId].videoState)

    console.log("Video set:", videoId, "in", roomId)
  })

  socket.on("video-play", ({ roomId }) => {
  if (!rooms[roomId]) return;
  io.to(roomId).emit("video-play");
});

socket.on("video-pause", ({ roomId }) => {
  if (!rooms[roomId]) return;
  io.to(roomId).emit("video-pause");
});

socket.on("video-seek", ({ roomId, time }) => {
  if (!rooms[roomId]) return;
  io.to(roomId).emit("video-seek", { time });
});


  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      if (rooms[roomId].users[socket.id]) {
        delete rooms[roomId].users[socket.id]
        io.to(roomId).emit("user-list", rooms[roomId].users)
      }
    }
  })
})

server.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000")
})
