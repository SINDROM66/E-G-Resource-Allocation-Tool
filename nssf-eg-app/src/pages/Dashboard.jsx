import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { useNavigate } from "react-router-dom";
import { KPI, Avatar } from "../components/Avatar";
import { StatusPill, PerDiemStamp, FieldTimeStamp } from "../components/Badges";
import { daysUntil, fmtDate, partnerName, isPerDiemUrgent, getFieldEntries } from "../lib/engine";

export default function Dashboard() {
  const { currentUser } = useAuth();
  return currentUser.role === "senior" ? <SeniorDashboard /> : <FieldDashboard />;
}

function SeniorDashboard() {
  const { outreaches, staff, partners } = useData();
  const navigate = useNavigate();

  const pending = outreaches.filter((o) => o.status === "Pending Approval");
  const urgentPerDiem = outreaches.filter(isPerDiemUrgent);
  const deployedCount = staff.filter((s) => s.status === "Deployed").length;
  const fieldEntries = getFieldEntries(outreaches, staff);
  const overstaying = fieldEntries.filter((e) => e.overstaying);
  const scoredPartners = partners.filter((p) => p.attendees > 0);
  const worstPartner = scoredPartners.length
    ? [...scoredPartners].sort((a, b) => a.onboarded / a.attendees - b.onboarded / b.attendees)[0]
    : null;

  return (
    <div>
      <div className="grid cols-4">
        <KPI num={pending.length} lbl="Outreach plans awaiting approval" />
        <KPI num={urgentPerDiem.length} lbl="Per diem unapproved, trip < 3 days out" deltaDir="down" delta={urgentPerDiem.length > 0 ? "needs Accounting sign-off now" : ""} />
        <KPI num={overstaying.length} lbl="Staff overstaying in the field vs. plan" deltaDir="down" delta={overstaying.length > 0 ? "review before next per diem run" : ""} />
        <KPI num={staff.length - deployedCount} lbl="Staff available to deploy today" />
      </div>

      {urgentPerDiem.length > 0 && (
        <div className="callout warn" style={{ marginTop: 22 }}>
          <strong>{urgentPerDiem.length} trip(s)</strong> depart within 3 days with per diem still <strong>unapproved</strong> —
          sign off now so staff aren't fronting their own money. See Per Diem tab.
        </div>
      )}
      {overstaying.length > 0 && (
        <div className="callout warn">
          <strong>{overstaying.length} staff member(s)</strong> are still logged in the field beyond the outreach's planned
          duration. See Per Diem tab → Field Time Tracker.
        </div>
      )}

      <div className="section-head">
        <h2>Awaiting your approval</h2>
        <span className="hint">{pending.length} outreach plan(s)</span>
      </div>
      {pending.length === 0 ? (
        <div className="empty">Nothing waiting on you right now.</div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <table>
            <thead>
              <tr><th>Outreach</th><th>Region</th><th>Date</th><th>Team</th><th>Per diem</th><th></th></tr>
            </thead>
            <tbody>
              {pending.map((o) => (
                <tr key={o.id}>
                  <td>
                    <strong>{o.title}</strong>
                    <br />
                    <span className="muted" style={{ fontSize: 12 }}>{partnerName(o, partners)}</span>
                  </td>
                  <td>{o.region}</td>
                  <td className="mono">{fmtDate(o.date)}</td>
                  <td>{o.assigned.length} assigned</td>
                  <td><PerDiemStamp status={o.perDiemStatus} urgent={isPerDiemUrgent(o)} /></td>
                  <td><button className="btn btn-ghost btn-sm" onClick={() => navigate("/plan?open=" + o.id)}>Review →</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="section-head">
        <h2>Partner performance flag</h2>
        <span className="hint">lowest conversion this quarter</span>
      </div>
      {worstPartner ? (
        <div className="card">
          <div className="row-flex" style={{ justifyContent: "space-between" }}>
            <div>
              <strong>{worstPartner.name}</strong>
              <div className="muted" style={{ fontSize: 12.5, marginTop: 3 }}>
                {worstPartner.onboarded} onboarded from {worstPartner.attendees} attendees across {worstPartner.outreaches} outreach(es) —{" "}
                {Math.round((worstPartner.onboarded / worstPartner.attendees) * 100)}% conversion.
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("/partners")}>View registry →</button>
          </div>
        </div>
      ) : (
        <div className="empty">No results logged yet.</div>
      )}
    </div>
  );
}

function FieldDashboard() {
  const { currentUser } = useAuth();
  const { outreaches, staff } = useData();
  const me = staff.find((s) => s.id === currentUser.staffId);

  if (!me) return <div className="empty">Your account isn't linked to a staff profile yet — ask a Senior Manager to check Manage Users.</div>;

  const mine = outreaches.filter((o) => o.assigned.includes(me.id)).sort((a, b) => new Date(a.date) - new Date(b.date));
  const upcoming = mine.filter((o) => o.status !== "Completed");
  const myFieldEntry = getFieldEntries(outreaches, staff).find((e) => e.person.id === me.id);

  const approved = upcoming.filter((o) => o.perDiemStatus === "Approved" || o.perDiemStatus === "Disbursed").length;
  const pending = upcoming.filter((o) => o.perDiemStatus === "Pending Accounting").length;
  const urgent = upcoming.filter(isPerDiemUrgent).length;

  return (
    <div>
      <div className="callout">
        Welcome, {me.name.split(" ")[0]} — {me.role} based in {me.homeRegion}. {me.note}
      </div>

      <div className="section-head" style={{ marginTop: 0 }}>
        <h2>Your per diem status</h2>
      </div>
      <div className="perdiem-banner">
        <div className={"seg " + (approved > 0 ? "ok" : "")}>
          <div className="n">{approved}</div>
          <div className="l">Approved trip(s)</div>
        </div>
        <div className={"seg " + (pending > 0 ? "wait" : "")}>
          <div className="n">{pending}</div>
          <div className="l">Awaiting Accounting</div>
        </div>
        <div className={"seg " + (urgent > 0 ? "warn" : "")}>
          <div className="n">{urgent}</div>
          <div className="l">Urgent — trip within 3 days, unapproved</div>
        </div>
      </div>

      {myFieldEntry && (
        <div className={"callout " + (myFieldEntry.overstaying ? "warn" : "")}>
          You're currently logged in the field on <strong>{myFieldEntry.outreach.title}</strong> — day {myFieldEntry.daysElapsed} of a
          planned {myFieldEntry.outreach.days}. <FieldTimeStamp entry={myFieldEntry} />
        </div>
      )}

      <div className="section-head"><h2>Your upcoming deployments</h2></div>
      {upcoming.length === 0 ? (
        <div className="empty">No outreach assigned to you right now.</div>
      ) : (
        <div className="grid cols-2">
          {upcoming.map((o) => {
            const u = isPerDiemUrgent(o);
            return (
              <div className="card" key={o.id}>
                <div className="row-flex" style={{ justifyContent: "space-between", marginBottom: 10 }}>
                  <StatusPill status={o.status} />
                  <PerDiemStamp status={o.perDiemStatus} urgent={u} />
                </div>
                <strong>{o.title}</strong>
                <div className="muted" style={{ fontSize: 12.5, margin: "6px 0 10px" }}>
                  {o.town}, {o.region} · {fmtDate(o.date)} · {o.days} day(s)
                </div>
                {u && (
                  <div style={{ fontSize: 12, color: "var(--red)", marginTop: 8 }}>
                    Departs in {daysUntil(o.date)} day(s) — per diem not yet approved by Accounting.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="section-head"><h2>Your activity</h2></div>
      <div className="grid cols-2">
        <KPI num={me.trips} lbl="Outreach trips completed" />
        <div className="card" style={{ padding: 14 }}>
          <div className="muted" style={{ fontSize: 11 }}>SECTOR STRENGTH</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>
            <span className="tag">{me.strength}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
