export function StatusPill({ status }) {
  const map = { Draft: "draft", "Pending Approval": "pending", Approved: "approved", Completed: "completed" };
  return (
    <span className={"pill " + map[status]}>
      <span className="pill-dot"></span>
      {status}
    </span>
  );
}

export function PerDiemStamp({ status, urgent }) {
  if (status === "Approved" || status === "Disbursed")
    return <span className="stamp ok">{status === "Disbursed" ? "Disbursed" : "Approved"}</span>;
  if (status === "Pending Accounting")
    return <span className={"stamp " + (urgent ? "no" : "wait")}>{urgent ? "Unapproved · Urgent" : "Pending"}</span>;
  return (
    <span className="stamp wait" style={{ opacity: 0.55 }}>
      Not submitted
    </span>
  );
}

export function FieldTimeStamp({ entry }) {
  if (entry.overstaying) return <span className="stamp no">Overstaying · {entry.daysOver}d over plan</span>;
  if (entry.daysElapsed >= entry.outreach.days) return <span className="stamp wait">On final planned day</span>;
  return <span className="stamp ok">On track</span>;
}
