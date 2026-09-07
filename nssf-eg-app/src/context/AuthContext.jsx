import { createContext, useContext, useEffect, useState } from "react";
import { buildInitialUsers } from "../data/seed";
import { loadState, saveState } from "../lib/storage";
import { apiAccounts, apiLogin, apiSaveState } from "../lib/api";

const AuthContext = createContext(null);

function loadUsers() {
  const seeded = buildInitialUsers();
  const stored = loadState("users", seeded).filter((user) => user.role !== "seniorStaff");
  return stored.map((user) => seeded.find((account) => account.id === user.id) || user)
    .concat(seeded.filter((account) => !stored.some((user) => user.id === account.id)));
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(loadUsers);
  const [currentUserId, setCurrentUserId] = useState(() => loadState("currentUserId", null));
  const [token, setToken] = useState(() => loadState("apiToken", null));

  useEffect(() => saveState("users", users), [users]);
  useEffect(() => saveState("currentUserId", currentUserId), [currentUserId]);
  useEffect(() => saveState("apiToken", token), [token]);
  useEffect(() => {
    apiAccounts().then((accounts) => setUsers((previous) => previous.map((user) => accounts.find((account) => account.id === user.id) || user).concat(accounts.filter((account) => !previous.some((user) => user.id === account.id))))).catch(() => {});
  }, []);

  const currentUser = users.find((u) => u.id === currentUserId) || null;

  const login = async (username, password) => {
    try {
      const result = await apiLogin(username, password);
      setToken(result.token);
      setUsers((previous) => previous.some((user) => user.id === result.user.id) ? previous.map((user) => user.id === result.user.id ? { ...user, ...result.user } : user) : [...previous, result.user]);
      setCurrentUserId(result.user.id);
      return { ok: true };
    } catch (apiError) {
      if (!String(password).trim()) return { ok: false, error: "Choose an account and enter a password." };
    }
    const match = users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase() && password.trim()
    );
    if (!match) return { ok: false, error: "Username or password is incorrect." };
    setCurrentUserId(match.id);
    return { ok: true };
  };

  const logout = () => {
    setCurrentUserId(null);
    setToken(null);
  };

  const addUser = (draft) => {
    const id = "U-" + Date.now();
    const newUser = { id, ...draft };
    setUsers((prev) => {
      const next = [...prev, newUser];
      if (token) apiSaveState("users", next, token).catch(() => {});
      return next;
    });
    return id;
  };

  return (
    <AuthContext.Provider value={{ users, currentUser, token, login, logout, addUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
