import { useState } from "react";

export default function App() {
  const [roomCode, setRoomCode] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center text-white">
      <div className="w-[90%] max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        
        <h1 className="text-4xl font-bold text-center mb-2">
          🎬 BingeBuddy
        </h1>

        <p className="text-center text-gray-400 mb-6">
          Watch YouTube together. Perfectly synced.
        </p>

        <input
          type="text"
          placeholder="Enter Room Code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
        />

        <button className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition font-semibold mb-3">
          Join Room
        </button>

        <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 transition font-semibold">
          Create New Room
        </button>

        <p className="text-xs text-center text-gray-500 mt-6">
          Created by Aditya Sajwan & Mohit chamoli
        </p>
      </div>
    </div>
  );
}
