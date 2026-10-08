export default function Requests({ pending, setPending, users, setUsers }) {
  const approve = (r) => {
    setUsers([...users, { name: r.name, membershipId: r.membershipId, password: r.password, role: "member" }]);
    setPending(pending.filter((p) => p.membershipId !== r.membershipId));
  };
  const reject = (r) => {
    if (confirm("Reject this membership request?")) setPending(pending.filter((p) => p.membershipId !== r.membershipId));
  };

  return (
    <section className="page active">
      <h2>Membership Requests</h2>
      <p className="deck">Approve a request to turn it into a member account, or reject it to remove it.</p>
      <table>
        <thead><tr>{["Name", "Requested ID", "Submitted", "Actions"].map((h) => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>
          {pending.length === 0 ? (
            <tr className="empty-row"><td colSpan={4}>No pending membership requests.</td></tr>
          ) : pending.map((r) => (
            <tr key={r.membershipId}>
              <td>{r.name}</td><td>{r.membershipId}</td><td>{r.dateRequested}</td>
              <td>
                <button className="approve" onClick={() => approve(r)}>Approve</button>
                <button className="danger" onClick={() => reject(r)}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
