import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function Chat({ roomId, username }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    socket.on("chat", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("chat");
  }, []);

  const send = () => {
    if (!text) return;
    socket.emit("chat", { roomId, message: text, username });
    setText("");
  };

  return (
  <div className="bg-zinc-900 rounded-2xl p-4 shadow-xl border border-zinc-800">
    <h2 className="font-semibold mb-2">Live Chat</h2>

    <div className="h-40 overflow-y-auto space-y-1 text-sm text-zinc-300 mb-3">
      {messages.map((m, i) => (
        <p key={i}>
          <span className="text-blue-400 font-medium">{m.username}</span>: {m.message}
        </p>
      ))}
    </div>

    <div className="flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something..."
        className="flex-1 p-2 rounded-lg bg-zinc-800 text-white outline-none"
      />
      <button
        onClick={send}
        className="px-4 rounded-lg bg-blue-500 hover:bg-blue-600 transition"
      >
        Send
      </button>
    </div>
  </div>
);

}
