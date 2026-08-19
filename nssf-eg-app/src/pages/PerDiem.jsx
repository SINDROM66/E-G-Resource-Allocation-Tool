import { useData } from "../context/DataContext";
import { Avatar } from "../components/Avatar";
import { PerDiemStamp, FieldTimeStamp } from "../components/Badges";
import { fmtDate, daysUntil, partnerName, isPerDiemUrgent, getFieldEntries } from "../lib/engine";

export default function PerDiem() {
  const { outreaches, staff, partners, approvePerDiem } = useData();
  const queue = outreaches.filter((o) => o.perDiemStatus !== "Not submitted");
  const fieldEntries = getFieldEntries(outreaches, staff);

  return (
    <div>
      <div className="callout">
        Per diem is triggered the moment a team is assigned to an outreach, so Accounting can review and approve it
        before departure instead of after — no figures shown here, just whether it's been signed off.
      </div>

      <div className="section-head"><h2>Approval queue</h2></div>
      <div className="card" style={{ padding: 0 }}>
        <table>
          <thead><tr><th>Outreach</th><th>Departs</th><th>Assigned</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {queue.map((o) => {
              const urgent = isPerDiemUrgent(o);
              return (
                <tr key={o.id}>
                  <td><strong>{o.title}</strong><div className="muted" style={{ fontSize: 11.5 }}>{partnerName(o, partners)}</div></td>
                  <td className="mono">{fmtDate(o.date)}{urgent && <div style={{ color: "var(--red)", fontSize: 11 }}>in {daysUntil(o.date)}d</div>}</td>
                  <td>{o.assigned.length} staff</td>
                  <td><PerDiemStamp status={o.perDiemStatus} urgent={urgent} /></td>
                  <td>{o.perDiemStatus === "Pending Accounting" && (
                    <button className="btn btn-primary btn-sm" onClick={() => approvePerDiem(o.id)}>Approve</button>
                  )}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="section-head">
        <h2>Field time tracker</h2>
        <span className="hint">flags staff still in the field beyond the planned duration</span>
      </div>
      <div className="callout">
        This isn't about accusing anyone — it exists so a trip that quietly runs long, without matching registrations
        to show for it, gets caught before the next per diem cycle rather than after.
      </div>
      {fieldEntries.length === 0 ? (
        <div className="empty">No one is currently logged as in the field.</div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <table>
            <thead><tr><th>Staff</th><th>Role</th><th>Outreach</th><th>Planned</th><th>Day of trip</th><th>Status</th></tr></thead>
            <tbody>
              {fieldEntries.map((e, i) => (
                <tr key={i}>
                  <td><div className="row-flex"><Avatar name={e.person.name} /> <strong>{e.person.name}</strong></div></td>
                  <td>{e.person.role}</td>
                  <td>{e.outreach.title}</td>
                  <td className="mono">{e.outreach.days} day(s)</td>
                  <td className="mono">Day {e.daysElapsed}</td>
                  <td><FieldTimeStamp entry={e} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
