import re
import os

path = r'c:\Users\HP\Desktop\E&G-RESOURCE ALLOCATION TOOL\nssf-eg-tool_4.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update PersonalisationView
new_personalisation_view = '''function PersonalisationView({ partners, pipeline, staff, role, me, updateEntityInsights }) {
  const [editingEntity, setEditingEntity] = useState(null);

  const canEdit = role === "senior" || (role === "field" && me?.role === "Personalisation");
  
  const allEntities = [...partners, ...pipeline];
  const officerName = (id) => staff.find(s => s.id === id)?.name || "Unassigned";

  const handleRowClick = (entity) => {
    if (!canEdit) return;
    setEditingEntity(entity);
  };

  return (
    <div>
      <div className="callout">
        Personalisation Insights based on Needs Assessment data to identify what info/communication/marketing messaging is required for specific partnerships.
      </div>
      
      <div className="section-head" style={{ marginTop: 0 }}>
        <h2>Personalisation & Needs Assessment Insights</h2>
        <span className="hint">Showing data for active partners and pipeline leads</span>
      </div>
      
      {allEntities.length === 0 ? (
        <div className="empty">No needs assessment data available yet. Please identify a new partner.</div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <table>
            <thead>
              <tr>
                <th>Partner / Lead</th>
                <th>Sector & Category</th>
                <th>Earning Cycle</th>
                <th>Size</th>
                <th>Account Owner</th>
                <th>Needs / Messaging Focus</th>
              </tr>
            </thead>
            <tbody>
              {allEntities.map((entity) => (
                <tr 
                  key={entity.id} 
                  onClick={() => handleRowClick(entity)}
                  style={{ cursor: canEdit ? "pointer" : "default" }}
                  className={canEdit ? "hoverable-row" : ""}
                >
                  <td>
                    <strong>{entity.name}</strong>
                    <div className="muted" style={{ fontSize: 11.5 }}>
                      {entity.stage ? "Pipeline: " + entity.stage : "Active Partner"}
                    </div>
                  </td>
                  <td>
                    <div><span className="tag">{entity.sector || "Informal"}</span></div>
                    <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>{entity.subcategory || "N/A"}</div>
                  </td>
                  <td>
                    {entity.earningCycle ? (
                      <span className="pill approved"><span className="pill-dot"></span>{entity.earningCycle}</span>
                    ) : (
                      <span className="muted">N/A</span>
                    )}
                  </td>
                  <td className="mono">{entity.orgSize || "N/A"}</td>
                  <td className="muted" style={{ fontSize: 12.5 }}>{entity.accountOwner ? officerName(entity.accountOwner) : "N/A"}</td>
                  <td>
                    <div style={{ fontSize: 13, maxWidth: 250, whiteSpace: "normal" }}>
                      {entity.additionalInfo || <span className="muted">No specific needs captured.</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingEntity && (
        <EditInsightsModal
          entity={editingEntity}
          staff={staff}
          onClose={() => setEditingEntity(null)}
          onSave={(updates) => {
            updateEntityInsights(editingEntity.id, updates);
            setEditingEntity(null);
          }}
        />
      )}
    </div>
  );
}

function EditInsightsModal({ entity, staff, onClose, onSave }) {
  const [sector, setSector] = useState(entity.sector || "Informal");
  const [formalSubcategory, setFormalSubcategory] = useState(
    entity.sector === "Formal" ? entity.subcategory || "MDA-Ministries/ Departments & Agencies" : "MDA-Ministries/ Departments & Agencies"
  );
  const [informalSubcategory, setInformalSubcategory] = useState(
    entity.sector === "Informal" ? entity.subcategory || "Saloonists" : "Saloonists"
  );
  const [orgSize, setOrgSize] = useState(entity.orgSize || "");
  const [accountOwner, setAccountOwner] = useState(entity.accountOwner || "");
  const [earningCycle, setEarningCycle] = useState(entity.earningCycle || "Monthly");
  const [additionalInfo, setAdditionalInfo] = useState(entity.additionalInfo || "");

  const accountManagers = staff.filter(s => s.role === "Account Manager");

  const handleSubmit = () => {
    onSave({
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
            <h3 style={{ margin: "0 0 4px" }}>Edit Insights: {entity.name}</h3>
            <div className="muted" style={{ fontSize: 12.5 }}>Update the needs assessment and personalization data for this partner/lead.</div>
          </div>
          <button className="x-close" onClick={onClose}>×</button>
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
          <button className="btn btn-primary" onClick={handleSubmit}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}'''

content = re.sub(r'function PersonalisationView\(\{ partners, pipeline, staff \}\) \{.*?\n\}\n(?=const TABS = \[)', new_personalisation_view + '\n', content, flags=re.DOTALL)

# 2. Add updateEntityInsights
update_entity_str = '''{tab==="personalisation" && <PersonalisationView partners={partners} pipeline={pipeline} staff={staff} role={role} me={me} updateEntityInsights={(id, up) => {
            if (id.startsWith("P")) {
              setPartners((prev) => prev.map(p => p.id === id ? { ...p, ...up } : p));
            } else {
              setPipeline((prev) => prev.map(l => l.id === id ? { ...l, ...up } : l));
            }
          }}/>}'''

content = re.sub(r'\{tab==="personalisation" && <PersonalisationView partners=\{partners\} pipeline=\{pipeline\} staff=\{staff\}\/>\}', update_entity_str, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print('done')
