import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("user-list", (u) => {
      setUsers(Object.values(u));
    });

    return () => socket.off("user-list");
  }, []);

  return (
    <div className="bg-gray-900 p-4 rounded">
      <h2 className="font-bold mb-2">Users</h2>
      {users.map((u, i) => (
        <p key={i}>• {u}</p>
      ))}
    </div>
  );
}
