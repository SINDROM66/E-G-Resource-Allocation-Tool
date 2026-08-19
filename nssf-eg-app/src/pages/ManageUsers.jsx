import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { Avatar } from "../components/Avatar";
import { REGIONS, LANGUAGE_OPTIONS, DEMO_PASSWORD } from "../data/seed";

export default function ManageUsers() {
  const { users, addUser } = useAuth();
  const { addStaff } = useData();
  const [showAdd, setShowAdd] = useState(false);

  const handleCreate = (draft) => {
    if (draft.accountType === "senior") {
      addUser({ username: draft.username, password: draft.password, role: "senior", name: draft.name, title: draft.title, staffId: null });
    } else {
      const staffId = addStaff({
        name: draft.name, role: draft.subRole, strength: draft.strength, languages: draft.languages,
        homeRegion: draft.homeRegion, note: "Newly added — no track record yet", formalRate: 60, informalRate: 60,
        trips: 0, status: "Available",
      });
      addUser({ username: draft.username, password: draft.password, role: "field", name: draft.name, title: draft.subRole, staffId });
    }
    setShowAdd(false);
  };

  return (
    <div>
      <div className="callout">
        This is where accounts get provisioned — each row here is a real login. Field Staff accounts are linked to a
        staff profile automatically, so a new hire shows up in outreach fit-matching right away.
      </div>

      <div className="section-head" style={{ marginTop: 0 }}>
        <h2>User accounts</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>+ Add user</button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <table>
          <thead><tr><th style={{ width: 28 }}>#</th><th>Name</th><th>Account Type</th><th>Title / Role</th><th>Username</th></tr></thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id}>
                <td className="ledger-idx">{String(i + 1).padStart(2, "0")}</td>
                <td><div className="row-flex"><Avatar name={u.name} /> <strong>{u.name}</strong></div></td>
                <td><span className="tag">{u.role === "senior" ? "Senior Manager" : "Field Staff"}</span></td>
                <td className="muted" style={{ fontSize: 12.5 }}>{u.title}</td>
                <td className="mono">{u.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && <AddUserModal onClose={() => setShowAdd(false)} onCreate={handleCreate} />}
    </div>
  );
}

function slugUsername(name) {
  const parts = name.trim().toLowerCase().split(/\s+/);
  if (parts.length < 2) return parts[0] || "";
  return parts[0][0] + "." + parts[parts.length - 1];
}

function AddUserModal({ onClose, onCreate }) {
  const [accountType, setAccountType] = useState("field");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [subRole, setSubRole] = useState("Trainer");
  const [strength, setStrength] = useState("Informal");
  const [homeRegion, setHomeRegion] = useState(REGIONS[0]);
  const [languages, setLanguages] = useState(["Luganda"]);
  const [password, setPassword] = useState(DEMO_PASSWORD);

  const toggleLang = (l) => setLanguages((prev) => (prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]));
  const username = slugUsername(name);
  const canSubmit = name.trim() && username && password && (accountType === "senior" ? title.trim() : languages.length > 0);

  return (
    <div className="modal-back" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-head">
          <div>
            <h3 style={{ margin: "0 0 4px" }}>Add a new user</h3>
            <div className="muted" style={{ fontSize: 12.5 }}>Creates a login and, for Field Staff, a matching staff profile used in outreach planning.</div>
          </div>
          <button className="x-close" onClick={onClose}>×</button>
        </div>

        <div className="field">
          <label>Account type</label>
          <div className="chip-select">
            <span className={"chip " + (accountType === "senior" ? "on" : "")} onClick={() => setAccountType("senior")}>Senior Manager</span>
            <span className={"chip " + (accountType === "field" ? "on" : "")} onClick={() => setAccountType("field")}>Field Staff</span>
          </div>
        </div>

        <div className="field">
          <label>Full name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Esther Nakimuli" />
        </div>

        {accountType === "senior" ? (
          <div className="field">
            <label>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Manager — Partnerships (Formal Sector)" />
          </div>
        ) : (
          <>
            <div className="grid cols-2">
              <div className="field">
                <label>Role</label>
                <div className="chip-select">
                  <span className={"chip " + (subRole === "Trainer" ? "on" : "")} onClick={() => setSubRole("Trainer")}>Trainer</span>
                  <span className={"chip " + (subRole === "Account Manager" ? "on" : "")} onClick={() => setSubRole("Account Manager")}>Account Manager</span>
                  <span className={"chip " + (subRole === "Personalisation" ? "on" : "")} onClick={() => setSubRole("Personalisation")}>Personalisation</span>
                </div>
              </div>
              <div className="field">
                <label>Sector strength</label>
                <div className="chip-select">
                  {["Informal", "Formal", "Both"].map((s) => (
                    <span key={s} className={"chip " + (strength === s ? "on" : "")} onClick={() => setStrength(s)}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="field">
              <label>Home region</label>
              <select value={homeRegion} onChange={(e) => setHomeRegion(e.target.value)}>
                {REGIONS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Languages</label>
              <div className="chip-select">
                {LANGUAGE_OPTIONS.map((l) => (
                  <span key={l} className={"chip " + (languages.includes(l) ? "on" : "")} onClick={() => toggleLang(l)}>{l}</span>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="grid cols-2">
          <div className="field">
            <label>Username (auto-generated)</label>
            <input value={username} disabled style={{ opacity: 0.7 }} />
          </div>
          <div className="field">
            <label>Temporary password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>

        <div className="divider"></div>
        <div className="row-flex" style={{ justifyContent: "flex-end", gap: 10 }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            disabled={!canSubmit}
            onClick={() => onCreate({ accountType, name: name.trim(), title, subRole, strength, homeRegion, languages, username, password })}
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}
