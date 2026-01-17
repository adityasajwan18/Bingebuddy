import { useEffect, useState } from "react"
import { socket } from "./socket"
import PaperBackground from "./components/ui/paper-background"

// Get room from URL
function getRoomFromURL() {
  const params = new URLSearchParams(window.location.search)
  return params.get("room") || ""
}

export default function App() {
  const [username, setUsername] = useState("")
  const [roomId, setRoomId] = useState(getRoomFromURL)
  const [joined, setJoined] = useState(false)
  const [isHost, setIsHost] = useState(false)

  // Socket listeners
  useEffect(() => {
    socket.on("room-created", ({ roomId, isHost }) => {
      setRoomId(roomId)
      setIsHost(isHost)
      setJoined(true)
      window.history.pushState({}, "", `?room=${roomId}`)
    })

    socket.on("room-joined", ({ isHost }) => {
      setIsHost(isHost)
      setJoined(true)
    })

    socket.on("video-changed", (videoState) => {
      console.log("Load this video for everyone:", videoState.videoId)
    })

    socket.on("error-message", (msg) => alert(msg))

    return () => {
      socket.off("room-created")
      socket.off("room-joined")
      socket.off("video-changed")
      socket.off("error-message")
    }
  }, [])

  const createRoom = () => {
    if (!username) return alert("Enter username")
    socket.emit("create-room", { username })
  }

  const joinRoom = () => {
    if (!username || !roomId) return alert("Missing fields")
    socket.emit("join-room", { roomId, username })
  }

  // ================= LOBBY =================
  if (!joined) {
    return (
      <div className="relative min-h-screen overflow-hidden text-white">
        <PaperBackground effect="combined" speed={1} intensity={1.5} />

        <div className="relative z-10 min-h-screen bg-black/80 flex items-center justify-center">
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl w-96 space-y-4 border border-white/10">
            <h1 className="text-3xl font-bold text-center">🎬 BingeBuddy</h1>

            <input
              placeholder="Username"
              className="w-full p-3 rounded bg-black/40 outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            
            <input
              placeholder="Room Code"
              className="w-full p-3 rounded bg-black/40 outline-none"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />

            <button
              onClick={joinRoom}
              className="w-full bg-indigo-600 p-3 rounded font-semibold"
            >
              Join Room
            </button>

            <button
              onClick={createRoom}
              className="w-full bg-white/10 p-3 rounded font-semibold"
            >
              Create New Room
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ================= ROOM =================
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <PaperBackground effect="combined" speed={1} intensity={1.5} />

      <div className="relative z-10 min-h-screen bg-black/70 flex items-center justify-center">
        <div className="space-y-4 bg-black/40 backdrop-blur-lg p-6 rounded-xl border border-white/10 w-96">

          <h2 className="text-xl font-bold text-center">Room: {roomId}</h2>
          {isHost && <p className="text-indigo-400 text-center">👑 You are the Host</p>}

          <code className="block text-center bg-white/10 p-2 rounded text-sm">
            {window.location.href}
          </code>

          {isHost && (
            <input
              placeholder="Paste YouTube link and press Enter"
              className="w-full p-3 rounded bg-black/40 outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const url = e.target.value
                  const id = url.split("v=")[1]?.split("&")[0]
                  if (id) {
                    socket.emit("set-video", { roomId, videoId: id })
                    e.target.value = ""
                  }
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
