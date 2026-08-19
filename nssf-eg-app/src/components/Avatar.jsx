export function initials(name) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("");
}

export function Avatar({ name }) {
  return <span className="avatar">{initials(name)}</span>;
}

export function KPI({ num, lbl, delta, deltaDir }) {
  return (
    <div className="card kpi">
      <div className="num">{num}</div>
      <div className="lbl">{lbl}</div>
      {delta && <div className={"delta " + (deltaDir === "up" ? "up" : "down")}>{delta}</div>}
    </div>
  );
}
