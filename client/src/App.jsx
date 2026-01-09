import { useEffect, useState } from "react";
import { socket } from "./socket";
import PaperBackground from "./components/ui/paper-background"
// get room from URL safely
function getRoomFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("room") || "";
}

export default function App() {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState(getRoomFromURL);
  const [joined, setJoined] = useState(false);
  const [isHost, setIsHost] = useState(false);

  // ✅ REGISTER SOCKET LISTENERS ONCE
  useEffect(() => {
    socket.on("room-created", ({ roomId, isHost }) => {
      setRoomId(roomId);
      setIsHost(isHost);
      setJoined(true);
      window.history.pushState({}, "", `?room=${roomId}`);
    });

    socket.on("room-joined", ({ isHost }) => {
      setIsHost(isHost);
      setJoined(true);
    });

    socket.on("error-message", (msg) => {
      alert(msg);
    });

    return () => {
      socket.off("room-created");
      socket.off("room-joined");
      socket.off("error-message");
    };
  }, []);

  // ✅ BUTTON HANDLERS (EMIT ONLY)
  const createRoom = () => {
    if (!username) return alert("Enter username");
    socket.emit("create-room", { username });
  };

  const joinRoom = () => {
    if (!username || !roomId) return alert("Missing fields");
    socket.emit("join-room", { roomId, username });
  };

// ================= UI =================

if (!joined) {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Background */}
      <PaperBackground effect="combined" speed={1} intensity={1.5} />

      {/* Foreground UI */}
      <div className="relative z-10 min-h-screen bg-gradient-to-br from-black/80 via-zinc-900/80 to-black/80 flex items-center justify-center">
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
  );
}

// ================= AFTER JOIN =================

return (
  <div className="relative min-h-screen overflow-hidden text-white">
    {/* Background */}
    <PaperBackground effect="combined" speed={1} intensity={1.5} />

    {/* Foreground UI */}
    <div className="relative z-10 min-h-screen bg-black/70 flex items-center justify-center">
      <div className="text-center space-y-2 bg-black/40 backdrop-blur-lg p-6 rounded-xl border border-white/10">
        <h2 className="text-2xl font-bold">Room: {roomId}</h2>
        {isHost && <p className="text-indigo-400">👑 You are the Host</p>}
        <p className="text-gray-400">Share this link:</p>
        <code className="bg-white/10 px-3 py-1 rounded block">
          {window.location.href}
        </code>
      </div>
    </div>
  </div>
);

}