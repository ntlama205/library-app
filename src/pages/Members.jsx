import { useState } from "react";
import UserForm from "../components/UserForm";

export default function Members({ users, setUsers, current, setCurrent }) {
  const [editing, setEditing] = useState(null);

  const save = (u) => {
    if (!/^\d+$/.test(u.membershipId)) return "Membership ID must contain digits only.";
    if (editing) {
      const updated = { name: u.name, membershipId: u.membershipId, password: u.password || editing.password, role: u.role };
      setUsers(users.map((x) => (x.membershipId === editing.membershipId ? updated : x)));
      if (current.membershipId === editing.membershipId) setCurrent(updated);
      setEditing(null);
    } else {
      if (users.some((x) => x.membershipId === u.membershipId)) return "Membership ID already exists.";
      if (!u.password) return "Password is required for new accounts.";
      setUsers([...users, u]);
    }
    return "";
  };

  const remove = (id) => {
    if (current.membershipId === id) return alert("You cannot delete your own account while logged in!");
    if (confirm("Are you sure you want to remove this member?")) setUsers(users.filter((u) => u.membershipId !== id));
  };

  return (
    <section className="page active">
      <h2>Member Directory</h2>
      <p className="deck">Everyone here has already been approved. Add staff directly, or update details.</p>
      <UserForm editing={editing} onSave={save} />
      <table>
        <thead><tr>{["Name", "Membership ID", "Role", "Actions"].map((h) => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.membershipId}>
              <td>{u.name}</td><td>{u.membershipId}</td>
              <td><span className={"status-pill " + (u.role === "admin" ? "status-admin" : "status-member")}>{u.role === "admin" ? "ADMIN" : "MEMBER"}</span></td>
              <td>
                <button onClick={() => setEditing(u)}>Edit</button>
                <button className="danger" onClick={() => remove(u.membershipId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
