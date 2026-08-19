import { RATE, HARDSHIP_REGIONS, TODAY } from "../data/seed";

export function recommendTeam(expectedAudience) {
  const total = Math.max(2, Math.ceil((Number(expectedAudience) || 0) / 65));
  const trainers = Math.max(1, Math.round(total * 0.45));
  const managers = Math.max(1, total - trainers);
  return { trainers, managers, total: trainers + managers };
}

export function fitScore(person, outreach) {
  let score = 0;
  const sectorRate = outreach.sector === "Formal" ? person.formalRate : person.informalRate;
  score += sectorRate * 0.5;
  if ((outreach.languages || []).some((l) => person.languages.includes(l))) score += 20;
  if (person.homeRegion === outreach.region) score += 20;
  else if (!HARDSHIP_REGIONS.includes(outreach.region)) score += 8;
  if (person.status === "Available") score += 10;
  return Math.round(score);
}

export function fitLabel(score) {
  if (score >= 80) return { label: "Best match", cls: "badge-best" };
  if (score >= 60) return { label: "Good fit", cls: "badge-good" };
  return { label: "Consider", cls: "badge-consider" };
}

export function perDiemForPerson(person, outreach) {
  let daily = RATE[person.role] || 0;
  if (HARDSHIP_REGIONS.includes(outreach.region)) daily += 30000;
  return daily * (outreach.days || 1);
}

export function totalPerDiem(outreach, staffList) {
  return outreach.assigned.reduce((sum, id) => {
    const p = staffList.find((s) => s.id === id);
    return p ? sum + perDiemForPerson(p, outreach) : sum;
  }, 0);
}

export function daysUntil(dateStr) {
  const d = new Date(dateStr);
  return Math.round((d - TODAY) / (1000 * 60 * 60 * 24));
}

export function fmtDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function partnerName(outreach, partners) {
  const partner = partners.find((p) => p.id === outreach.partnerId);
  if (partner) return partner.name;
  if (outreach.customPartner) return outreach.customPartner;
  return "Unlisted partner / area";
}

export function getTeamTarget(outreach) {
  const rec = recommendTeam(outreach.expectedAudience);
  const hasTrainerOverride = outreach.overrideTrainers !== undefined && outreach.overrideTrainers !== null && outreach.overrideTrainers !== "";
  const hasManagerOverride = outreach.overrideManagers !== undefined && outreach.overrideManagers !== null && outreach.overrideManagers !== "";
  const trainers = hasTrainerOverride ? Number(outreach.overrideTrainers) : rec.trainers;
  const managers = hasManagerOverride ? Number(outreach.overrideManagers) : rec.managers;
  return { trainers, managers, total: trainers + managers, isOverridden: hasTrainerOverride || hasManagerOverride };
}

export function genId(prefix, existing) {
  const nums = existing.map((o) => parseInt((o.id.split("-")[1]) || "0", 10)).filter((n) => !isNaN(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return prefix + "-" + String(max + 1).padStart(3, "0");
}

export function fieldTimeInfo(outreach) {
  const start = new Date(outreach.date);
  const plannedEnd = new Date(start.getTime() + (outreach.days - 1) * 86400000);
  const daysElapsed = Math.floor((TODAY - start) / 86400000) + 1;
  const daysOver = Math.floor((TODAY - plannedEnd) / 86400000);
  const isActive = outreach.status !== "Completed" && TODAY >= start && daysElapsed <= outreach.days + 10;
  return { start, plannedEnd, daysElapsed, daysOver, isActive, overstaying: isActive && daysOver > 0 };
}

export function getFieldEntries(outreaches, staff) {
  const entries = [];
  outreaches.forEach((o) => {
    const info = fieldTimeInfo(o);
    if (!info.isActive) return;
    o.assigned.forEach((sid) => {
      const person = staff.find((s) => s.id === sid);
      if (person) entries.push({ person, outreach: o, ...info });
    });
  });
  return entries;
}

export function isPerDiemUrgent(outreach) {
  return outreach.perDiemStatus === "Pending Accounting" && daysUntil(outreach.date) <= 3 && daysUntil(outreach.date) >= 0;
}
