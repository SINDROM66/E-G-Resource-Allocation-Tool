import { createContext, useContext, useEffect, useState } from "react";
import { buildInitialUsers } from "../data/seed";
import { loadState, saveState } from "../lib/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => loadState("users", buildInitialUsers()));
  const [currentUserId, setCurrentUserId] = useState(() => loadState("currentUserId", null));

  useEffect(() => saveState("users", users), [users]);
  useEffect(() => saveState("currentUserId", currentUserId), [currentUserId]);

  const currentUser = users.find((u) => u.id === currentUserId) || null;

  const login = (username, password) => {
    const match = users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
    );
    if (!match) return { ok: false, error: "Username or password is incorrect." };
    setCurrentUserId(match.id);
    return { ok: true };
  };

  const logout = () => setCurrentUserId(null);

  const addUser = (draft) => {
    const id = "U-" + Date.now();
    setUsers((prev) => [...prev, { id, ...draft }]);
    return id;
  };

  return (
    <AuthContext.Provider value={{ users, currentUser, login, logout, addUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
