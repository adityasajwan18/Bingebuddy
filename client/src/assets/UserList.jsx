import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("user-list", (u) => setUsers(Object.values(u)));
  }, []);

  return (
  <div className="bg-zinc-900 rounded-2xl p-4 shadow-xl border border-zinc-800">
    <h2 className="font-semibold mb-3">Users</h2>
    <div className="space-y-1 text-sm text-zinc-300">
      {users.map((u, i) => (
        <p key={i} className="flex items-center gap-2">
          <span className="h-2 w-2 bg-green-500 rounded-full"></span>
          {u}
        </p>
      ))}
    </div>
  </div>
);

}
