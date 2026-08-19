import { useData } from "../context/DataContext";

export default function Personalisation() {
  const { partners, pipeline, staff } = useData();
  
  // Combine all active partners and pipeline leads that have needs assessment data
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
                      {entity.stage ? `Pipeline: ${entity.stage}` : "Active Partner"}
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
}
