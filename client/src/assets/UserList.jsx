import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("user-list", (u) => setUsers(Object.values(u)));
  }, []);

  return (
    <div className="bg-gray-800 p-4 rounded">
      <h3 className="font-bold">Users</h3>
      {users.map((u, i) => <p key={i}>{u}</p>)}
    </div>
  );
}
