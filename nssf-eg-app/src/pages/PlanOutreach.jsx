import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import { Avatar } from "../components/Avatar";
import { StatusPill, PerDiemStamp } from "../components/Badges";
import { fmtDate, daysUntil, partnerName, getTeamTarget, fitScore, fitLabel, isPerDiemUrgent } from "../lib/engine";
import { REGIONS, LANGUAGE_OPTIONS } from "../data/seed";

export default function PlanOutreach() {
  const { outreaches, staff, partners, createOutreach, toggleAssign, submitForApproval, approveOutreach, approvePerDiem } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showCreate, setShowCreate] = useState(false);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const openParam = searchParams.get("open");
    if (openParam) setOpenId(openParam);
  }, [searchParams]);

  const open = outreaches.find((o) => o.id === openId) || null;

  const closeDetail = () => {
    setOpenId(null);
    searchParams.delete("open");
    setSearchParams(searchParams, { replace: true });
  };

  return (
    <div>
      <div className="section-head">
        <h2>Outreach register</h2>
        <div className="row-flex">
          <span className="hint">{outreaches.length} logged</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(true)}>+ New outreach</button>
        </div>
      </div>
      <div className="card" style={{ padding: 0 }}>
        <table>
          <thead><tr><th style={{ width: 28 }}>#</th><th>Outreach</th><th>Region</th><th>Date</th><th>Audience</th><th>Team</th><th>Status</th><th>Per diem</th><th></th></tr></thead>
          <tbody>
            {outreaches.map((o, i) => {
              const target = getTeamTarget(o);
              return (
                <tr key={o.id}>
                  <td className="ledger-idx">{String(i + 1).padStart(2, "0")}</td>
                  <td><strong>{o.title}</strong><div className="muted" style={{ fontSize: 11.5 }}>{partnerName(o, partners)} · {o.town}</div></td>
                  <td>{o.region}</td>
                  <td className="mono">{fmtDate(o.date)}</td>
                  <td className="mono">{o.expectedAudience}</td>
                  <td>{o.assigned.length}/{target.total}</td>
                  <td><StatusPill status={o.status} /></td>
                  <td><PerDiemStamp status={o.perDiemStatus} urgent={isPerDiemUrgent(o)} /></td>
                  <td><button className="btn btn-ghost btn-sm" onClick={() => setOpenId(o.id)}>Open →</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <CreateOutreachModal
          partners={partners}
          onClose={() => setShowCreate(false)}
          onCreate={(draft) => { const id = createOutreach(draft); setShowCreate(false); setOpenId(id); }}
        />
      )}

      {open && (
        <OutreachDetail
          outreach={open}
          partnerLabel={partnerName(open, partners)}
          staff={staff}
          onClose={closeDetail}
          onToggleAssign={(sid) => toggleAssign(open.id, sid)}
          onSubmit={() => { submitForApproval(open.id); closeDetail(); }}
          onApprove={() => { approveOutreach(open.id); closeDetail(); }}
          onApprovePerDiem={() => approvePerDiem(open.id)}
        />
      )}
    </div>
  );
}

function OutreachDetail({ outreach, partnerLabel, staff, onClose, onToggleAssign, onSubmit, onApprove, onApprovePerDiem }) {
  const rec = getTeamTarget(outreach);
  const assignedStaff = outreach.assigned.map((id) => staff.find((s) => s.id === id)).filter(Boolean);
  const assignedTrainers = assignedStaff.filter((s) => s.role === "Trainer").length;
  const assignedManagers = assignedStaff.filter((s) => s.role === "Account Manager").length;

  const candidates = staff.map((s) => ({ ...s, score: fitScore(s, outreach) })).sort((a, b) => b.score - a.score);
  const trainerCandidates = candidates.filter((s) => s.role === "Trainer");
  const managerCandidates = candidates.filter((s) => s.role === "Account Manager");

  const overStaffed = assignedStaff.length > rec.total;
  const understaffed = assignedStaff.length < rec.total;

  return (
    <div className="modal-back" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-head">
          <div>
            <h3 style={{ margin: "0 0 4px" }}>{outreach.title}</h3>
            <div className="muted" style={{ fontSize: 12.5 }}>{partnerLabel} · {outreach.town}, {outreach.region} · {fmtDate(outreach.date)} · {outreach.days} day(s)</div>
          </div>
          <button className="x-close" onClick={onClose}>×</button>
        </div>

        {outreach.need && <div className="callout" style={{ marginBottom: 16 }}>{outreach.need}</div>}

        <div className="grid cols-3" style={{ marginBottom: 18 }}>
          <div className="card" style={{ padding: 14 }}>
            <div className="muted" style={{ fontSize: 11 }}>EXPECTED AUDIENCE</div>
            <div className="mono" style={{ fontSize: 18, fontWeight: 600 }}>{outreach.expectedAudience}</div>
          </div>
          <div className="card" style={{ padding: 14 }}>
            <div className="muted" style={{ fontSize: 11 }}>{rec.isOverridden ? "TEAM (MANAGER-SET)" : "RECOMMENDED TEAM"}</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{rec.trainers} Trainer{rec.trainers !== 1 ? "s" : ""} + {rec.managers} Acct. Mgr{rec.managers !== 1 ? "s" : ""}</div>
          </div>
          <div className="card" style={{ padding: 14 }}>
            <div className="muted" style={{ fontSize: 11 }}>ASSIGNED SO FAR</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2, color: overStaffed ? "var(--red)" : understaffed ? "var(--gold-deep)" : "var(--forest-3)" }}>
              {assignedTrainers} Trainer{assignedTrainers !== 1 ? "s" : ""} + {assignedManagers} Mgr{assignedManagers !== 1 ? "s" : ""}
              {overStaffed && " — over-staffed"}
              {understaffed && " — below recommendation"}
            </div>
          </div>
        </div>

        <div className="section-head" style={{ margin: "18px 0 8px" }}><h2 style={{ fontSize: 15 }}>Best-fit Trainers</h2></div>
        {trainerCandidates.slice(0, 4).map((s) => <CandidateRow key={s.id} s={s} outreach={outreach} onToggleAssign={onToggleAssign} />)}

        <div className="section-head" style={{ margin: "22px 0 8px" }}><h2 style={{ fontSize: 15 }}>Best-fit Account Managers</h2></div>
        {managerCandidates.slice(0, 4).map((s) => <CandidateRow key={s.id} s={s} outreach={outreach} onToggleAssign={onToggleAssign} />)}

        <div className="divider"></div>
        <div className="row-flex" style={{ justifyContent: "space-between" }}>
          <div>
            <div className="muted" style={{ fontSize: 11, marginBottom: 6 }}>PER DIEM STATUS</div>
            <PerDiemStamp status={outreach.perDiemStatus} urgent={false} />
          </div>
          <div className="row-flex">
            {outreach.status === "Draft" && <button className="btn btn-primary" onClick={onSubmit}>Submit for approval</button>}
            {outreach.status === "Pending Approval" && <button className="btn btn-gold" onClick={onApprove}>Approve outreach plan</button>}
            {outreach.perDiemStatus === "Pending Accounting" && <button className="btn btn-primary" onClick={onApprovePerDiem}>Approve per diem</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

function CandidateRow({ s, outreach, onToggleAssign }) {
  const on = outreach.assigned.includes(s.id);
  const lbl = fitLabel(s.score);
  return (
    <div className="match-row">
      <Avatar name={s.name} />
      <div style={{ flex: 1 }}>
        <div className="row-flex" style={{ gap: 8 }}>
          <strong style={{ fontSize: 13.5 }}>{s.name}</strong>
          <span className={lbl.cls}>{lbl.label}</span>
          {s.status === "Deployed" && <span className="tag" style={{ background: "var(--red-soft)", color: "var(--red)", borderColor: "transparent" }}>Deployed elsewhere</span>}
        </div>
        <div className="muted" style={{ fontSize: 11.5, margin: "3px 0 6px" }}>{s.homeRegion} · {s.languages.join(", ")} · {s.note}</div>
        <div className="fit-bar"><div style={{ width: s.score + "%" }}></div></div>
      </div>
      <button className={"btn btn-sm " + (on ? "btn-danger" : "btn-ghost")} onClick={() => onToggleAssign(s.id)}>{on ? "Remove" : "Assign"}</button>
    </div>
  );
}

function RegionField({ region, setRegion, customRegion, setCustomRegion }) {
  return (
    <div className="field">
      <label>Region</label>
      <select value={region} onChange={(e) => setRegion(e.target.value)}>
        {REGIONS.map((r) => <option key={r}>{r}</option>)}
        <option value="Other">Other (type below)</option>
      </select>
      {region === "Other" && (
        <div className="other-field">
          <input value={customRegion} onChange={(e) => setCustomRegion(e.target.value)} placeholder="Enter the region name" />
        </div>
      )}
    </div>
  );
}

function CreateOutreachModal({ partners, onClose, onCreate }) {
  const [partnerMode, setPartnerMode] = useState("existing");
  const [partnerId, setPartnerId] = useState(partners[0]?.id || "");
  const [customPartnerName, setCustomPartnerName] = useState("");
  const [title, setTitle] = useState("");
  const [region, setRegion] = useState(REGIONS[0]);
  const [customRegion, setCustomRegion] = useState("");
  const [town, setTown] = useState("");
  const [sector, setSector] = useState("Informal");
  const [languages, setLanguages] = useState(["Luganda"]);
  const [showOtherLang, setShowOtherLang] = useState(false);
  const [customLanguage, setCustomLanguage] = useState("");
  const [date, setDate] = useState("");
  const [days, setDays] = useState(1);
  const [expectedAudience, setExpectedAudience] = useState(100);
  const [trainersOverride, setTrainersOverride] = useState("");
  const [managersOverride, setManagersOverride] = useState("");
  const [need, setNeed] = useState("");

  const rec = recommendTeamPreview(Number(expectedAudience) || 0);
  const toggleLang = (l) => setLanguages((prev) => (prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]));

  const addCustomLanguage = () => {
    const val = customLanguage.trim();
    if (val && !languages.includes(val)) setLanguages((prev) => [...prev, val]);
    setCustomLanguage("");
    setShowOtherLang(false);
  };

  const resolvedRegion = region === "Other" ? customRegion.trim() : region;
  const canSubmit = title.trim() && date && Number(expectedAudience) > 0 && (partnerMode === "existing" ? partnerId : customPartnerName.trim()) && town.trim() && resolvedRegion;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onCreate({
      title: title.trim(), partnerMode, partnerId, customPartnerName: customPartnerName.trim(),
      region: resolvedRegion, town: town.trim(), sector, languages,
      date, days: Number(days) || 1, expectedAudience: Number(expectedAudience) || 0,
      trainersOverride: trainersOverride !== "" ? Number(trainersOverride) : undefined,
      managersOverride: managersOverride !== "" ? Number(managersOverride) : undefined,
      need: need.trim(),
    });
  };

  return (
    <div className="modal-back" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-head">
          <div>
            <h3 style={{ margin: "0 0 4px" }}>Plan a new outreach</h3>
            <div className="muted" style={{ fontSize: 12.5 }}>Log the who/where/when — the tool will size the team and suggest a fit-matched roster.</div>
          </div>
          <button className="x-close" onClick={onClose}>×</button>
        </div>

        <div className="field">
          <label>Outreach title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Kalerwe Market Sensitization & Onboarding" />
        </div>

        <div className="field">
          <label>Partner or area</label>
          <div className="chip-select" style={{ marginBottom: 10 }}>
            <span className={"chip " + (partnerMode === "existing" ? "on" : "")} onClick={() => setPartnerMode("existing")}>Existing partner</span>
            <span className={"chip " + (partnerMode === "new" ? "on" : "")} onClick={() => setPartnerMode("new")}>New / unlisted partner</span>
          </div>
          {partnerMode === "existing" ? (
            <select value={partnerId} onChange={(e) => setPartnerId(e.target.value)}>
              {partners.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          ) : (
            <input value={customPartnerName} onChange={(e) => setCustomPartnerName(e.target.value)} placeholder="Name of the partner, market, union, or area" />
          )}
        </div>

        <div className="grid cols-2">
          <RegionField region={region} setRegion={setRegion} customRegion={customRegion} setCustomRegion={setCustomRegion} />
          <div className="field">
            <label>Town / specific site</label>
            <input value={town} onChange={(e) => setTown(e.target.value)} placeholder="e.g. Kalerwe" />
          </div>
        </div>

        <div className="field">
          <label>Sector</label>
          <div className="chip-select">
            <span className={"chip " + (sector === "Informal" ? "on" : "")} onClick={() => setSector("Informal")}>Informal</span>
            <span className={"chip " + (sector === "Formal" ? "on" : "")} onClick={() => setSector("Formal")}>Formal</span>
          </div>
        </div>

        <div className="field">
          <label>Language(s) needed</label>
          <div className="chip-select">
            {LANGUAGE_OPTIONS.map((l) => (
              <span key={l} className={"chip " + (languages.includes(l) ? "on" : "")} onClick={() => toggleLang(l)}>{l}</span>
            ))}
            {languages.filter((l) => !LANGUAGE_OPTIONS.includes(l)).map((l) => (
              <span key={l} className="chip on" onClick={() => toggleLang(l)}>{l}</span>
            ))}
            <span className={"chip " + (showOtherLang ? "on" : "")} onClick={() => setShowOtherLang((v) => !v)}>+ Other</span>
          </div>
          {showOtherLang && (
            <div className="other-field row-flex" style={{ gap: 8 }}>
              <input value={customLanguage} onChange={(e) => setCustomLanguage(e.target.value)} placeholder="Type a language" onKeyDown={(e) => e.key === "Enter" && addCustomLanguage()} />
              <button type="button" className="btn btn-ghost btn-sm" onClick={addCustomLanguage}>Add</button>
            </div>
          )}
        </div>

        <div className="grid cols-3">
          <div className="field">
            <label>Start date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="field">
            <label>Duration (days)</label>
            <input type="number" min="1" value={days} onChange={(e) => setDays(e.target.value)} />
          </div>
          <div className="field">
            <label>Expected participants</label>
            <input type="number" min="1" value={expectedAudience} onChange={(e) => setExpectedAudience(e.target.value)} />
          </div>
        </div>

        <div className="callout" style={{ marginTop: 2 }}>
          Based on {expectedAudience || 0} expected participants, the tool recommends <strong>{rec.trainers} Trainer{rec.trainers > 1 ? "s" : ""} + {rec.managers} Account Manager{rec.managers > 1 ? "s" : ""}</strong>.
          Adjust below only if you know something the numbers don't — e.g. a difficult site, a first-time partner, or a known low-conversion history.
        </div>

        <div className="grid cols-2">
          <div className="field">
            <label>Trainers to send (override)</label>
            <input type="number" min="0" value={trainersOverride} onChange={(e) => setTrainersOverride(e.target.value)} placeholder={rec.trainers + " (recommended)"} />
          </div>
          <div className="field">
            <label>Account Managers to send (override)</label>
            <input type="number" min="0" value={managersOverride} onChange={(e) => setManagersOverride(e.target.value)} placeholder={rec.managers + " (recommended)"} />
          </div>
        </div>

        <div className="field">
          <label>Other factors to consider</label>
          <textarea rows="3" value={need} onChange={(e) => setNeed(e.target.value)} placeholder="e.g. partner has underperformed before, site needs early-morning start, security concerns, materials required, VIP attendance expected..." />
        </div>

        <div className="divider"></div>
        <div className="row-flex" style={{ justifyContent: "flex-end", gap: 10 }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!canSubmit} onClick={handleSubmit}>Create outreach</button>
        </div>
      </div>
    </div>
  );
}

function recommendTeamPreview(expectedAudience) {
  const total = Math.max(2, Math.ceil(expectedAudience / 65));
  const trainers = Math.max(1, Math.round(total * 0.45));
  const managers = Math.max(1, total - trainers);
  return { trainers, managers, total: trainers + managers };
}
