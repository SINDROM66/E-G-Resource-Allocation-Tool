export const REGIONS = ["Kampala", "Wakiso", "Mukono", "Jinja", "Gulu", "Mbarara", "Mbale"];
export const HARDSHIP_REGIONS = ["Gulu", "Jinja", "Mbarara"];
export const RATE = { Trainer: 120000, "Account Manager": 130000 };
export const LANGUAGE_OPTIONS = ["Luganda", "English", "Acholi", "Swahili", "Runyankole", "Luo"];
export const PIPELINE_STAGES = ["Identified", "Vetted & Contacted", "MOU Signed"];

// "Today" is fixed so the seeded demo data (urgent per diem, overstay flags, etc.)
// always tells the same story. In a real deployment this would just be `new Date()`.
export const TODAY = new Date("2026-07-21");

export const DEMO_PASSWORD = "NssfEG@2026";

export const STAFF = [
  { id: "S01", name: "Aisha Nabatanzi", role: "Trainer", strength: "Informal", languages: ["Luganda", "English"], homeRegion: "Kampala", note: "Strong at market & vendor sensitization", formalRate: 55, informalRate: 88, trips: 14, status: "Available" },
  { id: "S02", name: "Peter Okello", role: "Trainer", strength: "Formal", languages: ["English", "Acholi"], homeRegion: "Gulu", note: "Best with MDAs and school staff", formalRate: 84, informalRate: 50, trips: 11, status: "Available" },
  { id: "S03", name: "Grace Namutebi", role: "Account Manager", strength: "Both", languages: ["Luganda", "English"], homeRegion: "Kampala", note: "High closer, adapts to any crowd", formalRate: 78, informalRate: 80, trips: 20, status: "Available" },
  { id: "S04", name: "Sam Lubega", role: "Account Manager", strength: "Informal", languages: ["Luganda", "English"], homeRegion: "Wakiso", note: "Boda boda & transport sector specialist", formalRate: 48, informalRate: 82, trips: 16, status: "Deployed" },
  { id: "S05", name: "Josephine Achen", role: "Trainer", strength: "Formal", languages: ["English", "Acholi", "Luo"], homeRegion: "Gulu", note: "Confident presenter for civil servants", formalRate: 80, informalRate: 60, trips: 9, status: "Available" },
  { id: "S06", name: "Moses Kato", role: "Account Manager", strength: "Formal", languages: ["English", "Luganda"], homeRegion: "Mukono", note: "Strong with SACCOs & local government", formalRate: 86, informalRate: 55, trips: 13, status: "Available" },
  { id: "S07", name: "Fatuma Nabirye", role: "Trainer", strength: "Both", languages: ["Luganda", "Swahili", "English"], homeRegion: "Jinja", note: "Trusted in fishing & lakeside communities", formalRate: 60, informalRate: 79, trips: 10, status: "Available" },
  { id: "S08", name: "Brian Ssekandi", role: "Account Manager", strength: "Informal", languages: ["Luganda", "English"], homeRegion: "Kampala", note: "High energy, thrives at market events", formalRate: 45, informalRate: 85, trips: 18, status: "Deployed" },
  { id: "S09", name: "Diana Auma", role: "Trainer", strength: "Formal", languages: ["English", "Acholi"], homeRegion: "Gulu", note: "New joiner, currently being mentored", formalRate: 62, informalRate: 45, trips: 3, status: "Available" },
  { id: "S10", name: "Ronald Byaruhanga", role: "Account Manager", strength: "Both", languages: ["Luganda", "English", "Runyankole"], homeRegion: "Mbarara", note: "Versatile, covers the western region", formalRate: 70, informalRate: 72, trips: 12, status: "Available" },
];

export const PARTNERS = [
  { id: "P01", name: "Boda Boda Union — Kisenyi", region: "Kampala", sector: "Informal", contact: "Hassan Mugisha", phone: "0772 114 552", officerId: "S04", outreaches: 5, attendees: 620, onboarded: 187 },
  { id: "P02", name: "Nakasero Market Vendors Assoc.", region: "Kampala", sector: "Informal", contact: "Sarah Nakato", phone: "0781 220 918", officerId: "S01", outreaches: 3, attendees: 340, onboarded: 61 },
  { id: "P03", name: "St. Mary's Teachers SACCO", region: "Wakiso", sector: "Formal", contact: "Robert Ssebunya", phone: "0700 445 210", officerId: "S06", outreaches: 2, attendees: 90, onboarded: 58 },
  { id: "P04", name: "Mukono District Local Government", region: "Mukono", sector: "Formal", contact: "Immaculate Nabatanzi", phone: "0752 663 401", officerId: "S03", outreaches: 2, attendees: 150, onboarded: 41 },
  { id: "P05", name: "Jinja Fishing Community Cooperative", region: "Jinja", sector: "Informal", contact: "Wilson Wanyama", phone: "0783 902 774", officerId: "S07", outreaches: 3, attendees: 210, onboarded: 33 },
  { id: "P06", name: "Gulu Boda Boda & Traders Alliance", region: "Gulu", sector: "Informal", contact: "Christine Aol", phone: "0774 558 330", officerId: "S02", outreaches: 1, attendees: 95, onboarded: 12 },
];

export const INITIAL_PIPELINE = [
  { id: "L01", name: "Kalerwe Produce Traders Association", region: "Kampala", officerId: "S08", contact: "Fred Musoke", phone: "0701 992 331", stage: "MOU Signed", targetAudience: 450, identifiedDate: "2026-06-18" },
  { id: "L02", name: "Mbarara Taxi Operators Coop", region: "Mbarara", officerId: "S10", contact: "Dennis Tumusiime", phone: "0775 882 119", stage: "Vetted & Contacted", targetAudience: 320, identifiedDate: "2026-07-02" },
  { id: "L03", name: "Mbale Coffee Farmers Federation", region: "Mbale", officerId: "S03", contact: "Patrick Wambede", phone: "0782 334 001", stage: "Identified", targetAudience: 600, identifiedDate: "2026-07-14" },
];

export const INITIAL_OUTREACHES = [
  { id: "OUT-013", title: "Extended Roadshow — Kisenyi & Nakawa Stages", partnerId: "P01", region: "Kampala", town: "Kisenyi & Nakawa", sector: "Informal", languages: ["Luganda"], date: "2026-07-16", days: 2, expectedAudience: 140, status: "Approved", assigned: ["S08", "S04"], perDiemStatus: "Approved", results: null, need: "Two-stage boda roadshow — planned as a 2-day trip" },
  { id: "OUT-014", title: "Kisenyi Sensitization & Onboarding Drive", partnerId: "P01", region: "Kampala", town: "Kisenyi", sector: "Informal", languages: ["Luganda"], date: "2026-07-24", days: 1, expectedAudience: 180, status: "Pending Approval", assigned: ["S01", "S08", "S04"], perDiemStatus: "Pending Accounting", results: null, need: "Sensitization + onboarding at Saturday union meeting point" },
  { id: "OUT-015", title: "St. Mary's Teachers Staff Enrollment Session", partnerId: "P03", region: "Wakiso", town: "Kira", sector: "Formal", languages: ["English"], date: "2026-07-22", days: 1, expectedAudience: 60, status: "Approved", assigned: ["S06", "S02"], perDiemStatus: "Approved", results: null, need: "Onboarding-focused, staffroom presentation after school hours" },
  { id: "OUT-016", title: "Mukono MDA Sensitization Week", partnerId: "P04", region: "Mukono", town: "Mukono Town", sector: "Formal", languages: ["English", "Luganda"], date: "2026-07-28", days: 3, expectedAudience: 220, status: "Draft", assigned: [], perDiemStatus: "Not submitted", results: null, need: "Multi-day district office sensitization ahead of enrollment push" },
  { id: "OUT-017", title: "Nakasero Market Onboarding Follow-up", partnerId: "P02", region: "Kampala", town: "Nakasero", sector: "Informal", languages: ["Luganda"], date: "2026-07-19", days: 1, expectedAudience: 150, status: "Completed", assigned: ["S08", "S04", "S01"], perDiemStatus: "Disbursed", results: { attendees: 138, onboarded: 34 }, need: "Follow-up onboarding for vendors sensitized in June" },
  { id: "OUT-018", title: "Lakeside Savings Drive", partnerId: "P05", region: "Jinja", town: "Walukuba", sector: "Informal", languages: ["Luganda", "Swahili"], date: "2026-08-03", days: 2, expectedAudience: 130, status: "Pending Approval", assigned: ["S07"], perDiemStatus: "Pending Accounting", results: null, need: "Two landing sites, morning sessions before fishers go out" },
  { id: "OUT-019", title: "Gulu Traders Re-engagement Outreach", partnerId: "P06", region: "Gulu", town: "Gulu Town", sector: "Informal", languages: ["Acholi", "English"], date: "2026-08-06", days: 1, expectedAudience: 100, status: "Draft", assigned: [], perDiemStatus: "Not submitted", results: null, need: "Partner underperformed last visit (12/95) — re-engage cautiously" },
];

// ---- Demo accounts -------------------------------------------------------
// These stand in for a real identity system. Passwords are shared/demo-grade
// on purpose — see README for what a production login would need instead.

export const SENIOR_MANAGERS = [
  { id: "U-SM01", username: "d.kintu", name: "David Kintu", title: "Senior Manager — Financial Literacy" },
  { id: "U-SM02", username: "p.namono", name: "Patricia Namono", title: "Senior Manager — Partnerships (Informal Sector)" },
];

function slugUsername(name) {
  const parts = name.toLowerCase().split(" ");
  return parts[0][0] + "." + parts[parts.length - 1];
}

export function buildInitialUsers() {
  const senior = SENIOR_MANAGERS.map((m) => ({
    id: m.id,
    username: m.username,
    password: DEMO_PASSWORD,
    role: "senior",
    name: m.name,
    title: m.title,
    staffId: null,
  }));
  const field = STAFF.map((s) => ({
    id: "U-" + s.id,
    username: slugUsername(s.name),
    password: DEMO_PASSWORD,
    role: "field",
    name: s.name,
    title: s.role,
    staffId: s.id,
  }));
  return [...senior, ...field];
}
