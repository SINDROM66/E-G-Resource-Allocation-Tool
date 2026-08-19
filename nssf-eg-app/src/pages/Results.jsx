import { useData } from "../context/DataContext";
import { KPI } from "../components/Avatar";
import { fmtDate } from "../lib/engine";

export default function Results() {
  const { outreaches } = useData();
  const completed = outreaches.filter((o) => o.status === "Completed" && o.results);
  const totalOnboarded = completed.reduce((s, o) => s + o.results.onboarded, 0);
  const totalAttendees = completed.reduce((s, o) => s + o.results.attendees, 0);

  return (
    <div>
      <div className="grid cols-2">
        <KPI num={totalOnboarded} lbl="Members onboarded (completed outreaches)" />
        <KPI num={totalAttendees ? Math.round((totalOnboarded / totalAttendees) * 100) + "%" : "—"} lbl="Attendee → onboarding conversion" />
      </div>

      <div className="section-head"><h2>Completed outreach results</h2></div>
      {completed.length === 0 ? (
        <div className="empty">No completed outreach logged yet.</div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <table>
            <thead><tr><th>Outreach</th><th>Date</th><th>Attendees</th><th>Onboarded</th><th>Conversion</th></tr></thead>
            <tbody>
              {completed.map((o) => (
                <tr key={o.id}>
                  <td><strong>{o.title}</strong></td>
                  <td className="mono">{fmtDate(o.date)}</td>
                  <td className="mono">{o.results.attendees}</td>
                  <td className="mono">{o.results.onboarded}</td>
                  <td>{Math.round((o.results.onboarded / o.results.attendees) * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
