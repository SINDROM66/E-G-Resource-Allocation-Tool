import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { DEMO_PASSWORD } from "../data/seed";

export default function Login() {
  const { currentUser, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (currentUser) return <Navigate to="/dashboard" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(username, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate("/dashboard");
  };

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-brand">
          <div className="mark">E&amp;G Deployment Ledger</div>
          <div className="sub">NSSF Uganda · Enterprise &amp; Growth</div>
        </div>

        {error && <div className="login-error">{error}</div>}

        <div className="field">
          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. a.nabatanzi" autoFocus />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <button className="btn btn-primary" type="submit" style={{ width: "100%", justifyContent: "center" }}>
          Sign in
        </button>

        <div className="login-hint">
          Demo accounts — Senior Manager: <code>d.kintu</code> or <code>p.namono</code>. Field Staff: any staff
          username, e.g. <code>a.nabatanzi</code> (Aisha Nabatanzi) or <code>s.lubega</code> (Sam Lubega). Password
          for every demo account: <code>{DEMO_PASSWORD}</code>
        </div>
      </form>
    </div>
  );
}
