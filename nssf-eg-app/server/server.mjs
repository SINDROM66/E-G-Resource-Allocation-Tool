import { createServer } from "node:http";
import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildInitialUsers, STAFF, PARTNERS, INITIAL_PIPELINE, INITIAL_OUTREACHES } from "../src/data/seed.js";

const port = Number(process.env.PORT || 4000);
const dataPath = resolve(dirname(fileURLToPath(import.meta.url)), "data.json");
const initialState = { users: buildInitialUsers(), staff: STAFF, partners: PARTNERS, pipeline: INITIAL_PIPELINE, outreaches: INITIAL_OUTREACHES };
const storedState = existsSync(dataPath) ? JSON.parse(readFileSync(dataPath, "utf8")) : {};
const storedUsers = (storedState.users || []).filter((user) => user.role !== "seniorStaff");
const state = {
  ...initialState,
  ...storedState,
  users: storedUsers.map((user) => initialState.users.find((account) => account.id === user.id) || user)
    .concat(initialState.users.filter((account) => !storedUsers.some((user) => user.id === account.id))),
  staff: (storedState.staff || STAFF).map((person) => person.role === "Trainer" ? { ...person, role: "Financial Trainer" } : person),
};
const sessions = new Map();

function persist() {
  writeFileSync(dataPath, JSON.stringify(state, null, 2));
}

if (!existsSync(dataPath)) persist();

function send(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "http://localhost:3000", "Access-Control-Allow-Headers": "Content-Type, Authorization", "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS" });
  res.end(JSON.stringify(body));
}

function userFromRequest(req) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  return sessions.get(token) || null;
}

function readBody(req) {
  return new Promise((resolveBody, reject) => {
    let body = "";
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", () => { try { resolveBody(body ? JSON.parse(body) : {}); } catch (error) { reject(error); } });
    req.on("error", reject);
  });
}

const server = createServer(async (req, res) => {
  if (req.method === "OPTIONS") return send(res, 204, {});
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "GET" && url.pathname === "/api/health") return send(res, 200, { ok: true });
  if (req.method === "GET" && url.pathname === "/api/accounts") {
    return send(res, 200, state.users.map(({ password, ...account }) => account));
  }
  if (req.method === "POST" && url.pathname === "/api/login") {
    const { username, password } = await readBody(req);
    const user = state.users.find((candidate) => candidate.username.toLowerCase() === String(username || "").trim().toLowerCase());
    if (!user || !String(password || "").trim()) return send(res, 401, { error: "Choose an account and enter a password." });
    const token = randomBytes(24).toString("hex");
    sessions.set(token, user);
    const { password: ignored, ...safeUser } = user;
    return send(res, 200, { token, user: safeUser });
  }

  const user = userFromRequest(req);
  if (!user) return send(res, 401, { error: "Authentication required." });

  if (req.method === "GET" && url.pathname === "/api/bootstrap") {
    const safeUsers = user.role === "senior" ? state.users.map(({ password, ...account }) => account) : [];
    return send(res, 200, { ...state, users: safeUsers });
  }

  const match = url.pathname.match(/^\/api\/state\/(users|staff|partners|pipeline|outreaches)$/);
  if (req.method === "PUT" && match) {
    if (match[1] === "users" && user.role !== "senior") return send(res, 403, { error: "Senior Management access required." });
    const value = await readBody(req);
    if (!Array.isArray(value)) return send(res, 400, { error: "State value must be an array." });
    state[match[1]] = value;
    persist();
    return send(res, 200, { ok: true });
  }

  return send(res, 404, { error: "Not found." });
});

server.listen(port, () => console.log(`E&G API listening on http://localhost:${port}`));
