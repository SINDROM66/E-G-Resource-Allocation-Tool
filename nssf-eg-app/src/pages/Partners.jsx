import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { Avatar } from "../components/Avatar";
import { fmtDate } from "../lib/engine";
import { REGIONS } from "../data/seed";

export default function Partners() {
  const { currentUser } = useAuth();
  const role = currentUser.role;
  const { partners, pipeline, staff, recordResults, advanceStage, activateLead, identifyPartner } = useData();

  const [subTab, setSubTab] = useState("active");
  const [showIdentify, setShowIdentify] = useState(false);
  const [resultsFor, setResultsFor] = useState(null);

  const officerName = (id) => staff.find((s) => s.id === id)?.name || "Unassigned";
  const ranked = [...partners].sort((a, b) => b.onboarded / b.attendees - a.onboarded / a.attendees);

  const officerStats = staff
    .map((s) => {
      const activePartners = partners.filter((p) => p.officerId === s.id);
      const pipelineLeads = pipeline.filter((l) => l.officerId === s.id);
      const outreachesRun = activePartners.reduce((sum, p) => sum + p.outreaches, 0);
      const totalOnboarded = activePartners.reduce((sum, p) => sum + p.onboarded, 0);
      return { staff: s, partnersSourced: activePartners.length + pipelineLeads.length, outreachesRun, totalOnboarded };
    })
    .filter((o) => o.partnersSourced > 0)
    .sort((a, b) => b.partnersSourced - a.partnersSourced || b.totalOnboarded - a.totalOnboarded);

  return (
    <div>
      <div className="callout">
        Partner identification drives voluntary savings onboarding — this module tracks active partners, prospective
        pipeline leads, and officer sourcing effectiveness.
      </div>

      <div className="row-flex" style={{ justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 10 }}>
        <div className="row-flex" style={{ gap: 8 }}>
          <button className={"btn btn-sm " + (subTab === "active" ? "btn-gold" : "btn-ghost")} onClick={() => setSubTab("active")}>
            Active Registry ({partners.length})
          </button>
          <button className={"btn btn-sm " + (subTab === "pipeline" ? "btn-gold" : "btn-ghost")} onClick={() => setSubTab("pipeline")}>
            Sourcing Pipeline ({pipeline.length})
          </button>
          <button className={"btn btn-sm " + (subTab === "officers" ? "btn-gold" : "btn-ghost")} onClick={() => setSubTab("officers")}>
            Officer Sourcing
          </button>
        </div>
        <button className="btn btn-primary" onClick={() => setShowIdentify(true)}>+ Identify New Partner</button>
      </div>

      {subTab === "active" && (
        <>
          <div className="section-head" style={{ marginTop: 0 }}>
            <h2>Active Partner Registry</h2>
            <span className="hint">ranked by onboarding conversion rate</span>
          </div>
          <div className="card" style={{ padding: 0 }}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: 28 }}>#</th><th>Partner</th><th>Region</th><th>Sector</th><th>Lead Initiator</th>
                  <th>Attendees</th><th>Onboarded</th><th>Conversion</th>{role === "senior" && <th></th>}
                </tr>
              </thead>
              <tbody>
                {ranked.map((p, i) => {
                  const conv = p.attendees > 0 ? Math.round((p.onboarded / p.attendees) * 100) : 0;
                  const low = conv < 25;
                  return (
                    <tr key={p.id}>
                      <td className="ledger-idx">{String(i + 1).padStart(2, "0")}</td>
                      <td><strong>{p.name}</strong><div className="muted" style={{ fontSize: 11.5 }}>{p.outreaches} outreach(es) completed</div></td>
                      <td>{p.region}</td>
                      <td><span className="tag">{p.sector}</span></td>
                      <td className="muted" style={{ fontSize: 12.5 }}>{officerName(p.officerId)}</td>
                      <td className="mono">{p.attendees}</td>
                      <td className="mono">{p.onboarded}</td>
                      <td>
                        {p.attendees > 0 ? (
                          <span className={"pill " + (low ? "urgent" : "approved")}><span className="pill-dot"></span>{conv}%</span>
                        ) : (
                          <span className="pill draft"><span className="pill-dot"></span>No data yet</span>
                        )}
                      </td>
                      {role === "senior" && (
                        <td><button className="btn btn-ghost btn-sm" onClick={() => setResultsFor(p.id)}>Record results</button></td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {subTab === "pipeline" && (
        <>
          <div className="section-head" style={{ marginTop: 0 }}>
            <h2>Partner Sourcing Pipeline</h2>
            <span className="hint">un-outreached partner prospects</span>
          </div>
          {pipeline.length === 0 ? (
            <div className="empty">No leads in the pipeline right now.</div>
          ) : (
            <div className="card" style={{ padding: 0 }}>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: 28 }}>#</th><th>Partner Lead</th><th>Region</th><th>Lead Initiator</th>
                    <th>Pipeline Stage</th><th>Target Audience</th><th>Identified Date</th>{role === "senior" && <th></th>}
                  </tr>
                </thead>
                <tbody>
                  {pipeline.map((l, i) => (
                    <tr key={l.id}>
                      <td className="ledger-idx">{String(i + 1).padStart(2, "0")}</td>
                      <td><strong>{l.name}</strong><div className="muted" style={{ fontSize: 11.5 }}>{l.contact} · {l.phone}</div></td>
                      <td>{l.region}</td>
                      <td className="muted" style={{ fontSize: 12.5 }}>{officerName(l.officerId)}</td>
                      <td><span className="pill pending"><span className="pill-dot"></span>{l.stage}</span></td>
                      <td className="mono">{l.targetAudience}</td>
                      <td className="mono">{fmtDate(l.identifiedDate)}</td>
                      {role === "senior" && (
                        <td>
                          {l.stage !== "MOU Signed" ? (
                            <button className="btn btn-ghost btn-sm" onClick={() => advanceStage(l.id)}>Advance →</button>
                          ) : (
                            <button className="btn btn-gold btn-sm" onClick={() => activateLead(l.id)}>Activate as Partner</button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {subTab === "officers" && (
        <>
          <div className="section-head" style={{ marginTop: 0 }}>
            <h2>Officer Partner Identification Leaderboard</h2>
            <span className="hint">measured on partners identified &amp; onboarding outcomes</span>
          </div>
          {officerStats.length === 0 ? (
            <div className="empty">No partners have been attributed to an officer yet.</div>
          ) : (
            <div className="card" style={{ padding: 0 }}>
              <table>
                <thead><tr><th style={{ width: 28 }}>#</th><th>Officer</th><th>Role</th><th>Partners Sourced</th><th>Outreaches Run</th><th>Total Members Onboarded</th></tr></thead>
                <tbody>
                  {officerStats.map((o, i) => (
                    <tr key={o.staff.id}>
                      <td className="ledger-idx">{String(i + 1).padStart(2, "0")}</td>
                      <td><div className="row-flex"><Avatar name={o.staff.name} /> <strong>{o.staff.name}</strong></div></td>
                      <td><span className="tag">{o.staff.role}</span></td>
                      <td className="mono">{o.partnersSourced} partner(s)</td>
                      <td className="mono">{o.outreachesRun}</td>
                      <td className="mono" style={{ color: "var(--forest-3)", fontWeight: 600 }}>{o.totalOnboarded} members</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {showIdentify && (
        <IdentifyPartnerModal
          staff={staff}
          onClose={() => setShowIdentify(false)}
          onCreate={(draft) => { identifyPartner(draft); setShowIdentify(false); setSubTab("pipeline"); }}
        />
      )}
      {resultsFor && (
        <RecordResultsModal
          partner={partners.find((p) => p.id === resultsFor)}
          onClose={() => setResultsFor(null)}
          onSave={(att, ob) => { recordResults(resultsFor, att, ob); setResultsFor(null); }}
        />
      )}
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

function IdentifyPartnerModal({ staff, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [region, setRegion] = useState(REGIONS[0]);
  const [customRegion, setCustomRegion] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [officerId, setOfficerId] = useState(staff[0]?.id || "");
  const [targetAudience, setTargetAudience] = useState(100);

  // New fields
  const [sector, setSector] = useState("Informal");
  const [formalSubcategory, setFormalSubcategory] = useState("MDA-Ministries/ Departments & Agencies");
  const [informalSubcategory, setInformalSubcategory] = useState("Saloonists");
  const [orgSize, setOrgSize] = useState("");
  const [accountOwner, setAccountOwner] = useState("");
  const [earningCycle, setEarningCycle] = useState("Monthly");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const resolvedRegion = region === "Other" ? customRegion.trim() : region;
  const canSubmit = name.trim() && contact.trim() && officerId && resolvedRegion;

  const accountManagers = staff.filter(s => s.role === "Account Manager");

  const handleSubmit = () => {
    onCreate({ 
      name: name.trim(), 
      region: resolvedRegion, 
      contact: contact.trim(), 
      phone: phone.trim(), 
      officerId, 
      targetAudience,
      sector,
      subcategory: sector === "Formal" ? formalSubcategory : informalSubcategory,
      orgSize: orgSize.trim(),
      accountOwner,
      earningCycle,
      additionalInfo: additionalInfo.trim()
    });
  };

  return (
    <div className="modal-back" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-head">
          <div>
            <h3 style={{ margin: "0 0 4px" }}>Identify a new partner</h3>
            <div className="muted" style={{ fontSize: 12.5 }}>Logs a fresh lead into the Sourcing Pipeline — it becomes an Active Partner once it's been outreached.</div>
          </div>
          <button className="x-close" onClick={onClose}>×</button>
        </div>
        <div className="field">
          <label>Partner / lead name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Owino Market Traders Association" />
        </div>
        <div className="grid cols-2">
          <RegionField region={region} setRegion={setRegion} customRegion={customRegion} setCustomRegion={setCustomRegion} />
          <div className="field">
            <label>Target audience (est.)</label>
            <input type="number" min="1" value={targetAudience} onChange={(e) => setTargetAudience(Number(e.target.value) || 0)} />
          </div>
        </div>
        <div className="grid cols-2">
          <div className="field">
            <label>Contact person</label>
            <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Full name" />
          </div>
          <div className="field">
            <label>Contact phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07XX XXX XXX" />
          </div>
        </div>
        <div className="field">
          <label>Lead Initiator</label>
          <select value={officerId} onChange={(e) => setOfficerId(e.target.value)}>
            {staff.map((s) => <option key={s.id} value={s.id}>{s.name} — {s.role}</option>)}
          </select>
        </div>

        {/* Needs Assessment Section */}
        <div className="section-head" style={{ marginTop: 20, marginBottom: 10 }}>
          <h2 style={{ fontSize: 15 }}>Needs Assessment</h2>
        </div>
        <div className="grid cols-2">
          <div className="field">
            <label>Partner Sector</label>
            <select value={sector} onChange={(e) => setSector(e.target.value)}>
              <option value="Informal">Informal</option>
              <option value="Formal">Formal</option>
            </select>
          </div>
          <div className="field">
            <label>Sector Category</label>
            {sector === "Formal" ? (
              <select value={formalSubcategory} onChange={(e) => setFormalSubcategory(e.target.value)}>
                <option value="MDA-Ministries/ Departments & Agencies">MDA-Ministries/ Departments & Agencies</option>
                <option value="Mass Markets">Mass Markets</option>
              </select>
            ) : (
              <select value={informalSubcategory} onChange={(e) => setInformalSubcategory(e.target.value)}>
                <option value="Saloonists">Saloonists</option>
                <option value="Farmers">Farmers</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Industry">Industry</option>
                <option value="Transportation">Transportation</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Other">Other Livelihoods</option>
              </select>
            )}
          </div>
        </div>

        <div className="grid cols-2">
          <div className="field">
            <label>Partner Organisational Size</label>
            <input value={orgSize} onChange={(e) => setOrgSize(e.target.value)} placeholder="e.g. 50-100" />
          </div>
          <div className="field">
            <label>Earning cycle category</label>
            <select value={earningCycle} onChange={(e) => setEarningCycle(e.target.value)}>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Seasonal">Seasonal</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label>Account owner (Assigned Relationship Manager)</label>
          <select value={accountOwner} onChange={(e) => setAccountOwner(e.target.value)}>
            <option value="">-- Select Account Manager --</option>
            {accountManagers.map((s) => <option key={s.id} value={s.id}>{s.name} — {s.role}</option>)}
          </select>
        </div>

        <div className="field">
          <label>Additional information (Partner Specific Need)</label>
          <textarea rows="3" value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} placeholder="e.g. Training smartlife flexi etc" />
        </div>

        <div className="divider"></div>
        <div className="row-flex" style={{ justifyContent: "flex-end", gap: 10 }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            Add to pipeline
          </button>
        </div>
      </div>
    </div>
  );
}

function RecordResultsModal({ partner, onClose, onSave }) {
  const [attendees, setAttendees] = useState("");
  const [onboarded, setOnboarded] = useState("");
  const canSubmit = attendees !== "" && onboarded !== "" && Number(onboarded) <= Number(attendees);

  return (
    <div className="modal-back" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-head">
          <div>
            <h3 style={{ margin: "0 0 4px" }}>Record outreach results</h3>
            <div className="muted" style={{ fontSize: 12.5 }}>{partner?.name} — this adds to their running total and updates conversion automatically.</div>
          </div>
          <button className="x-close" onClick={onClose}>×</button>
        </div>
        <div className="grid cols-2">
          <div className="field">
            <label>Attendees at this outreach</label>
            <input type="number" min="0" value={attendees} onChange={(e) => setAttendees(e.target.value)} />
          </div>
          <div className="field">
            <label>Members onboarded</label>
            <input type="number" min="0" value={onboarded} onChange={(e) => setOnboarded(e.target.value)} />
          </div>
        </div>
        {Number(onboarded) > Number(attendees) && attendees !== "" && (
          <div className="callout warn">Onboarded can't exceed attendees.</div>
        )}
        <div className="divider"></div>
        <div className="row-flex" style={{ justifyContent: "flex-end", gap: 10 }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!canSubmit} onClick={() => onSave(Number(attendees), Number(onboarded))}>Save results</button>
        </div>
      </div>
    </div>
  );
}
