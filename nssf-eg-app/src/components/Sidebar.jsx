import { NavLink } from "react-router-dom";

const ALL_TABS = [
  { path: "/dashboard", label: "Dashboard", seniorOnly: false },
  { path: "/partners", label: "Partner Registry & Pipeline", seniorOnly: false },
  { path: "/plan", label: "Plan an Outreach", seniorOnly: true },
  { path: "/schedule", label: "Deployment Schedule", seniorOnly: false },
  { path: "/perdiem", label: "Per Diem", seniorOnly: true },
  { path: "/results", label: "Results & Insights", seniorOnly: false },
  { path: "/personalisation", label: "Personalisation Insights", seniorOnly: false },
  { path: "/users", label: "Manage Users", seniorOnly: true },
];

export default function Sidebar({ role }) {
  const tabs = ALL_TABS.filter((t) => !t.seniorOnly || role === "senior");

  return (
    <div className="rail">
      <div className="rail-brand">
        <div className="mark">E&amp;G Deployment Ledger</div>
        <div className="sub">NSSF Uganda · Enterprise &amp; Growth</div>
      </div>
      <div>
        {tabs.map((t, i) => (
          <NavLink
            key={t.path}
            to={t.path}
            className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
          >
            <span className="idx">{String(i + 1).padStart(2, "0")}</span>
            {t.label}
          </NavLink>
        ))}
      </div>
      <div className="rail-foot">
        <div className="label">Signed in as</div>
        <div style={{ color: "var(--gold)", fontWeight: 600, fontSize: 13.5 }}>
          {role === "senior" ? "Senior Manager" : "Field Staff"}
        </div>
      </div>
    </div>
  );
}
