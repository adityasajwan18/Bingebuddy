import { useState } from "react";
import { socket } from "./socket";
import Player from "./components/Player";
import Chat from "./components/Chat";
import UserList from "./components/UserList";


export default function App() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);

  const joinRoom = () => {
  if (!roomId || !username) return;

  socket.connect();
  socket.emit("join-room", { roomId, username });
  setJoined(true);
};

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {!joined ? (
        <div className="max-w-md mx-auto mt-20 space-y-4">
          <h1 className="text-3xl font-bold text-center">🎬 BingeBuddy</h1>

          <input
            placeholder="Username"
            className="w-full p-2 text-black rounded"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            placeholder="Room Code"
            className="w-full p-2 text-black rounded"
            onChange={(e) => setRoomId(e.target.value)}
          />

          <button
            onClick={joinRoom}
            className="w-full bg-blue-500 p-2 rounded font-bold"
          >
            Join Room
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3 space-y-4">
            <Player roomId={roomId} />
            <Chat roomId={roomId} username={username} />
          </div>
          <UserList />
        </div>
      )}
    </div>
  );
}
