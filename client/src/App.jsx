import { useState, useEffect } from "react";
import { socket } from "./socket";
import Player from "./components/Player";
import UserList from "./components/UserList";

function parseYouTubeId(url) {
  if (!url) return "";
  // Try common patterns for YouTube IDs
  const patterns = [
    /(?:v=|\/)([0-9A-Za-z_-]{11})(?:&|$)/,
    /youtu\.be\/([0-9A-Za-z_-]{11})/,
    /embed\/([0-9A-Za-z_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return "";
}

export default function App() {
  const [username, setUsername] = useState("");
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const [inRoom, setInRoom] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [videoLink, setVideoLink] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("room-created", ({ roomId, isHost, users }) => {
      setRoomId(roomId);
      setIsHost(isHost);
      setUsers(Object.values(users));
      setInRoom(true);
    });

    socket.on("room-joined", ({ roomId, isHost, users }) => {
      setRoomId(roomId);
      setIsHost(isHost);
      setUsers(Object.values(users));
      setInRoom(true);
    });

    socket.on("init-state", (room) => {
      if (room && room.users) setUsers(Object.values(room.users));
    });

    socket.on("user-list", (u) => {
      setUsers(Object.values(u));
    });

    socket.on("error-message", (msg) => {
      alert(msg);
    });

    return () => {
      socket.off("room-created");
      socket.off("room-joined");
      socket.off("init-state");
      socket.off("user-list");
      socket.off("error-message");
    };
  }, []);

  const connectIfNeeded = () => {
    if (!socket.connected) socket.connect();
  };

  const handleCreateRoom = () => {
    if (!username.trim()) setUsername("Anon" + Math.floor(Math.random() * 1000));
    connectIfNeeded();
    socket.emit("create-room", { username: username || "Anonymous" });
  };

  const handleJoinRoom = () => {
    if (!roomCodeInput.trim()) return alert("Enter a room code");
    if (!username.trim()) setUsername("Anon" + Math.floor(Math.random() * 1000));
    connectIfNeeded();
    socket.emit("join-room", { roomId: roomCodeInput.toUpperCase().trim(), username: username || "Anonymous" });
  };

  const handleSetVideo = () => {
    const id = parseYouTubeId(videoLink.trim());
    if (!id) return alert("Invalid YouTube link or id");
    socket.emit("set-video", { roomId, videoId: id });
    setVideoLink("");
  };

  const handleLeave = () => {
    socket.disconnect();
    setInRoom(false);
    setRoomId("");
    setIsHost(false);
    setUsers([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center text-white p-6">
      {!inRoom ? (
        <div className="w-[90%] max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-center mb-2">🎬 BingeBuddy</h1>
          <p className="text-center text-gray-400 mb-6">Watch YouTube together. Perfectly synced.</p>

          <input type="text" placeholder="Your name" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4" />

          <input type="text" placeholder="Enter Room Code" value={roomCodeInput} onChange={(e) => setRoomCodeInput(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4" />

          <button onClick={handleJoinRoom} className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition font-semibold mb-3">Join Room</button>

          <button onClick={handleCreateRoom} className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 transition font-semibold">Create New Room</button>

          <p className="text-xs text-center text-gray-500 mt-6">Created by Aditya Sajwan & Mohit chamoli</p>
        </div>
      ) : (
        <div className="w-[95%] max-w-6xl grid grid-cols-2 gap-6">
          <div className="col-span-2 sm:col-span-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Room Code</h2>
                <p className="text-2xl font-bold">{roomId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm">You are <strong>{isHost ? 'Host' : 'Participant'}</strong></p>
                <button onClick={() => { navigator.clipboard?.writeText(roomId); }} className="mt-2 px-3 py-1 rounded bg-white/10">Copy</button>
              </div>
            </div>

            {isHost && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Load a YouTube link</h3>
                <div className="flex gap-2">
                  <input value={videoLink} onChange={(e) => setVideoLink(e.target.value)} placeholder="Paste YouTube link or id" className="flex-1 px-3 py-2 rounded bg-black/50 border border-white/10" />
                  <button onClick={handleSetVideo} className="px-4 py-2 rounded bg-indigo-600">Load</button>
                </div>
              </div>
            )}

            <div className="mt-6">
              <UserList />
            </div>

            <div className="mt-6">
              <button onClick={handleLeave} className="px-4 py-2 rounded bg-red-600">Leave Room</button>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <Player roomId={roomId} />
          </div>
        </div>
      )}
    </div>
  );
}
