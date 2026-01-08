import { useEffect, useState, useRef } from "react";
import { socket } from "../socket";

export default function Chat({ roomId, username }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);

  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    socket.on("chat", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("user-typing", (user) => {
      if (user === username) return; // don't show self
      setTypingUsers((prev) => (prev.includes(user) ? prev : [...prev, user]));
    });

    socket.on("user-stop-typing", (user) => {
      setTypingUsers((prev) => prev.filter((u) => u !== user));
    });

    return () => {
      socket.off("chat");
      socket.off("user-typing");
      socket.off("user-stop-typing");
    };
  }, [username]);

  const send = () => {
    if (!text) return;
    socket.emit("chat", { roomId, message: text, username });

    // stop typing when message is sent
    socket.emit("stop-typing", { roomId, username });
    isTypingRef.current = false;
    clearTimeout(typingTimeoutRef.current);

    setText("");
  };

  const handleChange = (e) => {
    setText(e.target.value);

    // Emit typing start if not already typing
    if (!isTypingRef.current) {
      socket.emit("typing", { roomId, username });
      isTypingRef.current = true;
    }

    // Clear previous timeout and set a new one to send stop-typing
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", { roomId, username });
      isTypingRef.current = false;
    }, 1500);
  };

  const typingText = () => {
    if (typingUsers.length === 0) return null;
    if (typingUsers.length === 1) return `${typingUsers[0]} is typing...`;
    if (typingUsers.length === 2) return `${typingUsers[0]} and ${typingUsers[1]} are typing...`;
    return `${typingUsers[0]} and ${typingUsers.length - 1} others are typing...`;
  };

  return (
  <div className="bg-zinc-900 rounded-2xl p-4 shadow-xl border border-zinc-800">
    <h2 className="font-semibold mb-2">Live Chat</h2>

    <div className="h-40 overflow-y-auto space-y-1 text-sm text-zinc-300 mb-1">
      {messages.map((m, i) => (
        <p key={i}>
          <span className="text-blue-400 font-medium">{m.username}</span>: {m.message}
        </p>
      ))}
    </div>

    <div className="h-5 mb-2 text-xs text-zinc-400">{typingText()}</div>

    <div className="flex gap-2">
      <input
        value={text}
        onChange={handleChange}
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
