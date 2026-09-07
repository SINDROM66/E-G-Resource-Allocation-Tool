const API_BASE = "/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || `Request failed (${response.status})`);
  return body;
}

export function apiLogin(username, password) {
  return request("/login", { method: "POST", body: JSON.stringify({ username, password }) });
}

export function apiAccounts() {
  return request("/accounts");
}

export function apiBootstrap(token) {
  return request("/bootstrap", { headers: { Authorization: `Bearer ${token}` } });
}

export function apiSaveState(key, value, token) {
  return request(`/state/${key}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(value),
  });
}
