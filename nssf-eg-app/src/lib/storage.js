const NS = "nssf-eg:";

export function loadState(key, fallback) {
  try {
    const raw = window.localStorage.getItem(NS + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

export function saveState(key, value) {
  try {
    window.localStorage.setItem(NS + key, JSON.stringify(value));
  } catch (e) {
    // localStorage can fail in private-browsing/quota-exceeded cases —
    // the app still works for the current session, it just won't persist.
    console.warn("Could not persist", key, e);
  }
}
