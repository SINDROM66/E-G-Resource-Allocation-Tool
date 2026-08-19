import { createContext, useContext, useEffect, useState } from "react";
import { STAFF, PARTNERS, INITIAL_PIPELINE, INITIAL_OUTREACHES } from "../data/seed";
import { loadState, saveState } from "../lib/storage";
import { genId } from "../lib/engine";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [staff, setStaff] = useState(() => loadState("staff", STAFF));
  const [partners, setPartners] = useState(() => loadState("partners", PARTNERS));
  const [pipeline, setPipeline] = useState(() => loadState("pipeline", INITIAL_PIPELINE));
  const [outreaches, setOutreaches] = useState(() => loadState("outreaches", INITIAL_OUTREACHES));

  useEffect(() => saveState("staff", staff), [staff]);
  useEffect(() => saveState("partners", partners), [partners]);
  useEffect(() => saveState("pipeline", pipeline), [pipeline]);
  useEffect(() => saveState("outreaches", outreaches), [outreaches]);

  // ---- outreach actions ----
  const createOutreach = (draft) => {
    const id = genId("OUT", outreaches);
    const newOutreach = {
      id,
      title: draft.title,
      partnerId: draft.partnerMode === "existing" ? draft.partnerId : null,
      customPartner: draft.partnerMode === "new" ? draft.customPartnerName : null,
      region: draft.region,
      town: draft.town,
      sector: draft.sector,
      languages: draft.languages,
      date: draft.date,
      days: draft.days,
      expectedAudience: draft.expectedAudience,
      status: "Draft",
      assigned: [],
      perDiemStatus: "Not submitted",
      results: null,
      need: draft.need,
      overrideTrainers: draft.trainersOverride,
      overrideManagers: draft.managersOverride,
    };
    setOutreaches((prev) => [...prev, newOutreach]);
    return id;
  };

  const toggleAssign = (outreachId, staffId) => {
    setOutreaches((prev) =>
      prev.map((o) => {
        if (o.id !== outreachId) return o;
        const has = o.assigned.includes(staffId);
        return { ...o, assigned: has ? o.assigned.filter((x) => x !== staffId) : [...o.assigned, staffId] };
      })
    );
  };

  const submitForApproval = (id) => {
    setOutreaches((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, status: "Pending Approval", perDiemStatus: o.perDiemStatus === "Not submitted" ? "Pending Accounting" : o.perDiemStatus }
          : o
      )
    );
  };

  const approveOutreach = (id) => {
    setOutreaches((prev) => prev.map((o) => (o.id === id ? { ...o, status: "Approved" } : o)));
  };

  const approvePerDiem = (id) => {
    setOutreaches((prev) => prev.map((o) => (o.id === id ? { ...o, perDiemStatus: "Approved" } : o)));
  };

  // ---- partner / pipeline actions ----
  const recordResults = (partnerId, attendeesAdded, onboardedAdded) => {
    setPartners((prev) =>
      prev.map((p) =>
        p.id === partnerId
          ? { ...p, attendees: p.attendees + attendeesAdded, onboarded: p.onboarded + onboardedAdded, outreaches: p.outreaches + 1 }
          : p
      )
    );
  };

  const advanceStage = (leadId) => {
    const stages = ["Identified", "Vetted & Contacted", "MOU Signed"];
    setPipeline((prev) =>
      prev.map((l) => {
        if (l.id !== leadId) return l;
        const idx = stages.indexOf(l.stage);
        return { ...l, stage: stages[Math.min(idx + 1, stages.length - 1)] };
      })
    );
  };

  const activateLead = (leadId) => {
    const lead = pipeline.find((l) => l.id === leadId);
    if (!lead) return;
    const newId = genId("P", partners);
    setPartners((prev) => [
      ...prev,
      { 
        id: newId, 
        name: lead.name, 
        region: lead.region, 
        sector: lead.sector || "Informal",
        subcategory: lead.subcategory,
        orgSize: lead.orgSize,
        accountOwner: lead.accountOwner,
        earningCycle: lead.earningCycle,
        additionalInfo: lead.additionalInfo,
        contact: lead.contact, 
        phone: lead.phone, 
        officerId: lead.officerId, 
        outreaches: 0, 
        attendees: 0, 
        onboarded: 0 
      },
    ]);
    setPipeline((prev) => prev.filter((l) => l.id !== leadId));
  };

  const identifyPartner = (draft) => {
    const newId = genId("L", pipeline);
    setPipeline((prev) => [
      ...prev,
      { 
        id: newId, 
        name: draft.name, 
        region: draft.region, 
        officerId: draft.officerId, 
        contact: draft.contact, 
        phone: draft.phone, 
        stage: "Identified", 
        targetAudience: draft.targetAudience, 
        identifiedDate: new Date().toISOString().slice(0, 10),
        sector: draft.sector,
        subcategory: draft.subcategory,
        orgSize: draft.orgSize,
        accountOwner: draft.accountOwner,
        earningCycle: draft.earningCycle,
        additionalInfo: draft.additionalInfo
      },
    ]);
  };

  // ---- staff actions ----
  const addStaff = (draft) => {
    const id = genId("S", staff);
    setStaff((prev) => [...prev, { id, ...draft }]);
    return id;
  };

  const value = {
    staff, setStaff, addStaff,
    partners, setPartners,
    pipeline, setPipeline,
    outreaches, setOutreaches,
    createOutreach, toggleAssign, submitForApproval, approveOutreach, approvePerDiem,
    recordResults, advanceStage, activateLead, identifyPartner,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  return useContext(DataContext);
}
