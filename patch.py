import re

with open(r'c:\Users\HP\Desktop\E&G-RESOURCE ALLOCATION TOOL\nssf-eg-tool_3.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update IdentifyPartnerModal
new_modal = '''function IdentifyPartnerModal({staff, onClose, onCreate}){
  const [name, setName] = useState("");
  const [region, setRegion] = useState(REGIONS[0]);
  const [customRegion, setCustomRegion] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [officerId, setOfficerId] = useState(staff[0]?.id || "");
  const [targetAudience, setTargetAudience] = useState(100);

  const [sector, setSector] = useState("Informal");
  const [formalSubcategory, setFormalSubcategory] = useState("MDA-Ministries/ Departments & Agencies");
  const [informalSubcategory, setInformalSubcategory] = useState("Saloonists");
  const [orgSize, setOrgSize] = useState("");
  const [accountOwner, setAccountOwner] = useState("");
  const [earningCycle, setEarningCycle] = useState("Monthly");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const resolvedRegion = region==="Other" ? customRegion.trim() : region;
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
    <div className="modal-back" onClick={(e)=>{if(e.target===e.currentTarget) onClose();}}>
      <div className="modal">
        <div className="modal-head">
          <div>
            <h3 style={{margin:"0 0 4px"}}>Identify a new partner</h3>
            <div className="muted" style={{fontSize:12.5}}>Logs a fresh lead into the Sourcing Pipeline — it becomes an Active Partner once it\\'s been outreached.</div>
          </div>
          <button className="x-close" onClick={onClose}>×</button>
        </div>
        <div className="field">
          <label>Partner / lead name</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Owino Market Traders Association" />
        </div>
        <div className="grid cols-2">
          <div className="field">
            <label>Region</label>
            <select value={region} onChange={e=>setRegion(e.target.value)}>
              {REGIONS.map(r=><option key={r}>{r}</option>)}
              <option value="Other">Other (type below)</option>
            </select>
            {region==="Other" && (
              <div className="other-field">
                <input value={customRegion} onChange={e=>setCustomRegion(e.target.value)} placeholder="Enter the region name" />
              </div>
            )}
          </div>
          <div className="field">
            <label>Target audience (est.)</label>
            <input type="number" min="1" value={targetAudience} onChange={e=>setTargetAudience(Number(e.target.value)||0)} />
          </div>
        </div>
        <div className="grid cols-2">
          <div className="field">
            <label>Contact person</label>
            <input value={contact} onChange={e=>setContact(e.target.value)} placeholder="Full name" />
          </div>
          <div className="field">
            <label>Contact phone</label>
            <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="07XX XXX XXX" />
          </div>
        </div>
        <div className="field">
          <label>Lead Initiator</label>
          <select value={officerId} onChange={e=>setOfficerId(e.target.value)}>
            {staff.map(s=><option key={s.id} value={s.id}>{s.name} — {s.role}</option>)}
          </select>
        </div>

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
        <div className="row-flex" style={{justifyContent:"flex-end", gap:10}}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!canSubmit} onClick={handleSubmit}>Add to pipeline</button>
        </div>
      </div>
    </div>
  );
}'''

content = re.sub(r'function IdentifyPartnerModal\(\{staff, onClose, onCreate\}\)\{.*?(?=function RecordResultsModal)', new_modal + '\n\n', content, flags=re.DOTALL)

# 2. Update identifyPartner and activateLead
new_activate_lead = '''  const activateLead = (leadId) => {
    const lead = pipeline.find(l=>l.id===leadId);
    if(!lead) return;
    const newId = "P" + String(partners.length+1).padStart(2,"0") + "-" + leadId;
    setPartners(prev => [...prev, {
      id:newId, name:lead.name, region:lead.region, 
      sector:lead.sector || "Informal", 
      subcategory: lead.subcategory,
      orgSize: lead.orgSize,
      accountOwner: lead.accountOwner,
      earningCycle: lead.earningCycle,
      additionalInfo: lead.additionalInfo,
      contact:lead.contact, phone:lead.phone,
      officerId:lead.officerId, outreaches:0, attendees:0, onboarded:0, spend:0,
    }]);
    setPipeline(prev => prev.filter(l=>l.id!==leadId));
    setSubTab("active");
  };'''

new_identify_partner = '''  const identifyPartner = (draft) => {
    const newId = "L" + String(pipeline.length+1).padStart(2,"0");
    setPipeline(prev => [...prev, {
      id:newId, name:draft.name, region:draft.region, officerId:draft.officerId,
      contact:draft.contact, phone:draft.phone, stage:"Identified",
      targetAudience:draft.targetAudience, identifiedDate:"2026-07-21",
      sector: draft.sector, subcategory: draft.subcategory,
      orgSize: draft.orgSize, accountOwner: draft.accountOwner,
      earningCycle: draft.earningCycle, additionalInfo: draft.additionalInfo
    }]);
    setShowIdentify(false);
    setSubTab("pipeline");
  };'''

content = re.sub(r'  const activateLead = \(leadId\) => \{.*?\n  \};\n', new_activate_lead + '\n\n', content, flags=re.DOTALL)
content = re.sub(r'  const identifyPartner = \(draft\) => \{.*?\n  \};\n', new_identify_partner + '\n\n', content, flags=re.DOTALL)

# 3. Update table headers
content = content.replace('<th>Identifying Officer</th>', '<th>Lead Initiator</th>')

# 4. Remove role limitation for + Identify New Partner
content = content.replace('{role==="senior" && <button className="btn btn-primary" onClick={()=>setShowIdentify(true)}>+ Identify New Partner</button>}', '<button className="btn btn-primary" onClick={()=>setShowIdentify(true)}>+ Identify New Partner</button>')

# 5. Add Personalisation role option
content = content.replace('<span className={"chip "+(subRole==="Account Manager"?"on":"")} onClick={()=>setSubRole("Account Manager")}>Account Manager</span>', '<span className={"chip "+(subRole==="Account Manager"?"on":"")} onClick={()=>setSubRole("Account Manager")}>Account Manager</span>\n                  <span className={"chip "+(subRole==="Personalisation"?"on":"")} onClick={()=>setSubRole("Personalisation")}>Personalisation</span>')

# 6. Create PersonalisationView
personalisation_view = '''function PersonalisationView({ partners, pipeline, staff }) {
  const allEntities = [...partners, ...pipeline].filter(e => e.subcategory || e.earningCycle || e.sector);
  const officerName = (id) => staff.find(s => s.id === id)?.name || "Unassigned";

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
                <tr key={entity.id}>
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
    </div>
  );
}'''

# Inject PersonalisationView before App
content = re.sub(r'const TABS = \[', personalisation_view + '\n\nconst TABS = [', content)

# 7. Add Personalisation tab
content = content.replace('{id:"results", label:"Results & Insights", seniorOnly:false},', '{id:"results", label:"Results & Insights", seniorOnly:false},\n  {id:"personalisation", label:"Personalisation Insights", seniorOnly:false},')

# 8. Render PersonalisationView in App component
content = content.replace('{tab==="results" && <ResultsView outreaches={outreaches} partners={partners} staff={staff}/>}', '{tab==="results" && <ResultsView outreaches={outreaches} partners={partners} staff={staff}/>}\n          {tab==="personalisation" && <PersonalisationView partners={partners} pipeline={pipeline} staff={staff}/>}')


with open(r'c:\Users\HP\Desktop\E&G-RESOURCE ALLOCATION TOOL\nssf-eg-tool_4.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Success')
