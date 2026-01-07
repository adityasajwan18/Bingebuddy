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
    <div className="bg-gray-900 p-4 rounded">
      <div className="h-40 overflow-y-auto mb-2">
        {messages.map((m, i) => (
          <p key={i}>
            <b>{m.username}:</b> {m.message}
          </p>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 p-2 text-black rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
        />
        <button onClick={send} className="bg-blue-500 px-4 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
