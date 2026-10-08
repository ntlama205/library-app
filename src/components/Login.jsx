import { useState } from "react";

const digits = (v) => v.replace(/\D/g, "");

export default function Login({ users, pending, setPending, onLogin }) {
  const [mode, setMode] = useState("login");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loginMsg, setLoginMsg] = useState("");
  const [signupMsg, setSignupMsg] = useState({ text: "", ok: false });

  const switchMode = (m) => {
    setMode(m); setLoginMsg(""); setSignupMsg({ text: "", ok: false });
    setId(""); setPassword(""); setName("");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const found = users.find((u) => u.membershipId === id.trim());
    if (!found) {
      setLoginMsg(pending.some((r) => r.membershipId === id.trim())
        ? "Your request is still awaiting admin approval."
        : 'Membership ID not found. Try "SIGN IN" above.');
      return;
    }
    if (found.password !== password.trim()) return setLoginMsg("Incorrect password.");
    onLogin(found);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const fail = (text) => setSignupMsg({ text, ok: false });
    const n = name.trim(), i = id.trim(), p = password.trim();
    if (!n || !i || !p) return fail("Please enter your name, a membership ID, and a password.");
    if (users.some((u) => u.membershipId === i)) return fail("That membership ID is already taken.");
    if (pending.some((r) => r.membershipId === i)) return fail("That membership ID already has a pending request.");
    setPending([...pending, { name: n, membershipId: i, password: p, dateRequested: new Date().toLocaleString() }]);
    setSignupMsg({ text: `Request submitted. An admin needs to approve "${i}" before you can check in.`, ok: true });
    setId(""); setPassword(""); setName("");
  };

  return (
    <section id="loginPage">
      <div className="login-card card-surface">
        <span className="stamp">OFFICIAL CATALOG</span>
        <h1>COMMUNITY LIBRARY</h1>
        <p className="sub">THE READING ROOM</p>

        <div className="toggle-row">
          <button className={mode === "login" ? "active" : ""} onClick={() => switchMode("login")}>Check In</button>
          <button className={mode === "signup" ? "active" : ""} onClick={() => switchMode("signup")}>SIGN IN</button>
        </div>

        {mode === "login" ? (
          <>
            <form onSubmit={handleLogin}>
              <input type="text" placeholder="MEMBERSHIP ID" autoComplete="off" value={id} onChange={(e) => setId(digits(e.target.value))} />
              <input type="password" placeholder="PASSWORD" autoComplete="off" value={password} onChange={(e) => setPassword(e.target.value.toUpperCase())} />
              <button type="submit">Enter</button>
            </form>
            <p className="error">{loginMsg}</p>
          </>
        ) : (
          <form onSubmit={handleSignup}>
            <input type="text" placeholder="YOUR NAME" autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="text" placeholder="CHOOSE A MEMBERSHIP ID" autoComplete="off" value={id} onChange={(e) => setId(digits(e.target.value))} />
            <input type="password" placeholder="CHOOSE A PASSWORD" autoComplete="off" value={password} onChange={(e) => setPassword(e.target.value.toUpperCase())} />
            <p className="hint-small">An admin must approve this before.</p>
            <button type="submit">Submit Request</button>
          </form>
        )}

        {mode === "signup" && (
          <p className="notice" style={{ color: signupMsg.ok ? "var(--forest-dark)" : "var(--stamp-red)" }}>{signupMsg.text}</p>
        )}
        <p className="hint">First time here? Sign in with <strong>admin</strong> to review and approve membership requests.</p>
      </div>
    </section>
  );
}
