import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { currentUser, users, login } = useAuth();
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState("field");
  const [username, setUsername] = useState(() => users.find((u) => u.role === "field")?.username || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const accounts = users.filter((u) => u.role === accountType);

  const handleAccountTypeChange = (type) => {
    setAccountType(type);
    setUsername(users.find((u) => u.role === type)?.username || "");
    setError("");
  };

  if (currentUser) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(username, password);
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
          <div className="mark">E<span className="brand-amp">&amp;</span>G Deployment Ledger</div>
          <div className="sub">NSSF Uganda · Enterprise &amp; Growth</div>
        </div>

        {error && <div className="login-error">{error}</div>}

        <div className="field">
          <label>Account type</label>
          <div className="chip-select">
            <button type="button" className={"chip " + (accountType === "field" ? "on" : "")} onClick={() => handleAccountTypeChange("field")}>Field Staff</button>
            <button type="button" className={"chip " + (accountType === "senior" ? "on" : "")} onClick={() => handleAccountTypeChange("senior")}>Senior Manager</button>
          </div>
        </div>
        <div className="field">
          <label>{accountType === "field" ? "Field staff account" : "Senior manager account"}</label>
          <select value={username} onChange={(e) => setUsername(e.target.value)} autoFocus>
            {accounts.length === 0 ? <option value="">No accounts available</option> : accounts.map((account) => (
              <option key={account.id} value={account.username}>{account.name} · {account.title}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter any password" required />
        </div>
        <button className="btn btn-primary" type="submit" style={{ width: "100%", justifyContent: "center" }}>
          Sign in
        </button>

        <div className="login-hint">
          Showcase mode — choose an account above and enter any password. Accounts added by Senior Management appear here automatically.
        </div>
      </form>
    </div>
  );
}
