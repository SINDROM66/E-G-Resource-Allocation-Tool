import { useState } from "react";
import { useData } from "../context/DataContext";
import { Avatar } from "../components/Avatar";
import { StatusPill } from "../components/Badges";
import { fmtDate, partnerName } from "../lib/engine";
import { REGIONS } from "../data/seed";

export default function Schedule() {
  const { outreaches, staff, partners } = useData();
  const [filterRegion, setFilterRegion] = useState("All");
  const sorted = [...outreaches].sort((a, b) => new Date(a.date) - new Date(b.date));
  const filtered = filterRegion === "All" ? sorted : sorted.filter((o) => o.region === filterRegion);

  return (
    <div>
      <div className="section-head">
        <h2>Deployment schedule</h2>
        <select style={{ width: 180 }} value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)}>
          <option>All</option>
          {REGIONS.map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>
      {filtered.map((o) => {
        const assignedStaff = o.assigned.map((id) => staff.find((s) => s.id === id)).filter(Boolean);
        return (
          <div className="card" key={o.id} style={{ marginBottom: 14 }}>
            <div className="row-flex" style={{ justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <strong>{o.title}</strong>
                <div className="muted" style={{ fontSize: 12 }}>{partnerName(o, partners)} · {o.town}, {o.region}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="mono" style={{ fontSize: 13 }}>{fmtDate(o.date)} · {o.days}d</div>
                <StatusPill status={o.status} />
              </div>
            </div>
            <div className="row-flex" style={{ flexWrap: "wrap", gap: 8 }}>
              {assignedStaff.length === 0 && <span className="muted" style={{ fontSize: 12.5 }}>No one assigned yet</span>}
              {assignedStaff.map((s) => (
                <span className="tag" key={s.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px" }}>
                  <Avatar name={s.name} /> {s.name} <span className="muted">· {s.role}</span>
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
